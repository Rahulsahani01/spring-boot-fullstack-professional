# HRMS Attendance + Overtime Settlement Module

This document describes **all features and flows** implemented in:
`com.example.demo.hrms.attendance`

---

## 1) Features Implemented
1. **Clock In** for a worker at a site
2. **Clock Out** for the same worker at the same site
3. **Overtime calculation** automatically at clock-out
4. **Overtime summary** (unsettled overtime) for a worker + site within a time range
5. **Overtime settlement** (mark unsettled overtime as settled) for all workers/sites within a time range
6. **Active workers listing**
7. **Consistent error handling** across attendance/overtime flows

---

## 2) REST Endpoints & Flows

### 2.1 Attendance Controller
Base path: `api/v1/attendance`

#### A) Clock In
- **POST** `/api/v1/attendance/clock-in`
- Request body: `ClockInRequest`
  - `workerId`
  - `siteId`
  - `clockInTime` (Instant)
- Response: `AttendanceResponse`

**Flow (AttendanceService.clockIn)**
1. Fetch **Worker** by `workerId`
   - if not found → `WorkerNotFoundException` (404)
2. Fetch **Site** by `siteId`
   - if not found → `SiteNotFoundException` (404)
3. Validate no active attendance exists for (worker, site)
   - if an `AttendanceLog` exists with `clockOutTime IS NULL` → `ActiveAttendanceAlreadyExistsException` (409)
4. Create a new `AttendanceLog`
   - `clockInTime = request.clockInTime`
   - `clockOutTime = null`
   - `overtimeCounted = false`
   - `overtimeMinutes = 0`
5. Save log and return `AttendanceResponse`

---

#### B) Clock Out
- **POST** `/api/v1/attendance/clock-out`
- Request body: `ClockOutRequest`
  - `workerId`
  - `siteId`
  - `clockOutTime` (Instant)
- Response: `AttendanceResponse`

**Flow (AttendanceService.clockOut)**
1. Fetch **Worker** by `workerId`
   - if not found → `WorkerNotFoundException` (404)
2. Fetch **Site** by `siteId`
   - if not found → `SiteNotFoundException` (404)
3. Find latest active attendance log for (worker, site)
   - query: `clockOutTime IS NULL`
   - if not found → `AttendanceNotActiveException` (400)
4. Validate time rule
   - if `clockOutTime < clockInTime` → `AttendanceNotActiveException` (400)
5. Set `clockOutTime`
6. Compute overtime
   - Regular threshold: **8 hours/day**
   - `minutesWorked = between(clockInTime, clockOutTime)`
   - `overtimeMinutes = max(0, minutesWorked - 8*60)`
7. Update attendance log
   - `overtimeMinutes`
   - `overtimeCounted = true`
8. If `overtimeMinutes > 0`, create an `OvertimeEntry`
   - `overtimeGeneratedAt = Instant.now()`
   - `overtimeMinutes`
   - `settlementStatus = UNSETTLED`
   - links 1 attendance log ↔ 1 overtime entry (unique OneToOne)
9. Save and return `AttendanceResponse`

---

#### C) Active Workers List
- **GET** `/api/v1/attendance/active-workers`
- Response: `List<ActiveWorkerResponse>`

**Flow**
1. Query `workerRepository.findByActiveTrue()`
2. Map each Worker to `ActiveWorkerResponse`

---

### 2.2 Overtime Controller
Base path: `api/v1/overtime`

#### D) Overtime Summary
- **GET** `/api/v1/overtime/summary`
- Query params:
  - `workerId`
  - `siteId`
  - `from` (Instant)
  - `to` (Instant)
- Response: `OvertimeSummaryResponse`

**Flow (OvertimeService.getOvertimeSummary)**
1. Query overtime entries with filters:
   - `worker_id = workerId`
   - `site_id = siteId`
   - `overtimeGeneratedAt BETWEEN from AND to`
   - `settlementStatus = UNSETTLED`
2. Sum `overtimeMinutes`
3. Return total unsettled overtime minutes

---

#### E) Settle Unsettled Overtime Entries
- **POST** `/api/v1/overtime/settle`
- Query params:
  - `from` (Instant)
  - `to` (Instant)
- Response: `SettlementResponse`

**Flow (OvertimeService.settleAllUnsettled)**
1. Query overtime entries where:
   - `settlementStatus = UNSETTLED`
   - `overtimeGeneratedAt BETWEEN from AND to`
2. If no entries → `SettlementNotFoundException` (404)
3. For each entry:
   - set `settlementStatus = SETTLED`
4. Save all
5. Return settled count

---

## 3) Data Model Overview

### Entities
- `Worker`
- `Site`
- `AttendanceLog` (clock-in/out + overtime counted fields)
- `OvertimeEntry` (overtime minutes + settlement status)

### Relationships
- `AttendanceLog` has:
  - `ManyToOne` → `Worker`
  - `ManyToOne` → `Site`
- `OvertimeEntry` has:
  - `ManyToOne` → `Worker`
  - `ManyToOne` → `Site`
  - `OneToOne` → `AttendanceLog` (**unique**)

---

## 4) DTOs Overview
- Requests:
  - `ClockInRequest`
  - `ClockOutRequest`
- Responses:
  - `AttendanceResponse`
  - `ActiveWorkerResponse`
  - `OvertimeSummaryResponse`
  - `SettlementResponse`
- Extra DTO exists:
  - `EntryBreakdown` (currently not wired into a flow)

---

## 5) Exceptions & Error Response Flow

### Custom Exceptions (all extend `AttendanceException`)
- `WorkerNotFoundException` → **404 NOT_FOUND**
- `SiteNotFoundException` → **404 NOT_FOUND**
- `ActiveAttendanceAlreadyExistsException` → **409 CONFLICT**
- `AttendanceNotActiveException` → **400 BAD_REQUEST**
- `SettlementNotFoundException` → **404 NOT_FOUND**

### Global Handler
`GlobalAttendanceExceptionHandler` catches `AttendanceException` and returns:
```json
{
  "error": "<reason phrase>",
  "message": "<exception message>",
  "timestamp": "<ISO timestamp>"
}
```

---

## 6) Files Included (for traceability)
- Controllers:
  - `attendance/controller/AttendanceController.java`
  - `attendance/controller/OvertimeController.java`
- Services:
  - `attendance/service/AttendanceService.java`
  - `attendance/service/OvertimeService.java`
- Domain:
  - `Worker.java`, `Site.java`, `AttendanceLog.java`, `OvertimeEntry.java`
  - `Designation.java`, `SettlementStatus.java`
- DTOs:
  - `attendance/dto/*`
- Repositories:
  - `attendance/*Repository.java`
- Exceptions:
  - `attendance/exception/*`
  - `attendance/exception/GlobalAttendanceExceptionHandler.java`

