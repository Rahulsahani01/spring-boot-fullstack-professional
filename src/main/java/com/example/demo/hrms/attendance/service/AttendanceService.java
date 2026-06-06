package com.example.demo.hrms.attendance.service;

import com.example.demo.hrms.attendance.*;
import com.example.demo.hrms.attendance.dto.AttendanceResponse;
import com.example.demo.hrms.attendance.dto.ClockInRequest;
import com.example.demo.hrms.attendance.dto.ClockOutRequest;
import com.example.demo.hrms.attendance.exception.ActiveAttendanceAlreadyExistsException;
import com.example.demo.hrms.attendance.exception.AttendanceNotActiveException;
import com.example.demo.hrms.attendance.exception.SiteNotFoundException;
import com.example.demo.hrms.attendance.exception.WorkerNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@AllArgsConstructor
@Service
public class AttendanceService {

    private final WorkerRepository workerRepository;
    private final SiteRepository siteRepository;
    private final AttendanceLogRepository attendanceLogRepository;
    private final OvertimeEntryRepository overtimeEntryRepository;

    // Simple business rule: overtime starts after 8 hours.
    private static final long DAILY_REGULAR_MINUTES = 8L * 60L;

    public AttendanceResponse clockIn(ClockInRequest req) {
        Worker worker = workerRepository.findById(req.getWorkerId())
                .orElseThrow(() -> new WorkerNotFoundException("Worker with id " + req.getWorkerId() + " not found"));
        Site site = siteRepository.findById(req.getSiteId())
                .orElseThrow(() -> new SiteNotFoundException("Site with id " + req.getSiteId() + " not found"));

        attendanceLogRepository
                .findTopByWorker_IdAndSite_IdAndClockOutTimeIsNullOrderByClockInTimeDesc(worker.getId(), site.getId())
                .ifPresent(x -> {
                    throw new ActiveAttendanceAlreadyExistsException(
                            "Worker " + worker.getId() + " already clocked in for site " + site.getId());
                });

        AttendanceLog log = new AttendanceLog();
        log.setWorker(worker);
        log.setSite(site);
        log.setClockInTime(req.getClockInTime());
        log.setOvertimeCounted(false);
        log.setOvertimeMinutes(0);

        AttendanceLog saved = attendanceLogRepository.save(log);

        return new AttendanceResponse(
                saved.getId(),
                worker.getId(),
                site.getId(),
                saved.getClockInTime(),
                saved.getClockOutTime(),
                saved.getOvertimeMinutes()
        );
    }

    public AttendanceResponse clockOut(ClockOutRequest req) {
        Worker worker = workerRepository.findById(req.getWorkerId())
                .orElseThrow(() -> new WorkerNotFoundException("Worker with id " + req.getWorkerId() + " not found"));
        Site site = siteRepository.findById(req.getSiteId())
                .orElseThrow(() -> new SiteNotFoundException("Site with id " + req.getSiteId() + " not found"));

        AttendanceLog log = attendanceLogRepository
                .findTopByWorker_IdAndSite_IdAndClockOutTimeIsNullOrderByClockInTimeDesc(worker.getId(), site.getId())
                .orElseThrow(() -> new AttendanceNotActiveException(
                        "No active attendance for worker " + worker.getId() + " at site " + site.getId()));

        if (req.getClockOutTime().isBefore(log.getClockInTime())) {
            throw new AttendanceNotActiveException("Clock out time must be after clock in time");
        }

        log.setClockOutTime(req.getClockOutTime());

        long minutesWorked = Duration.between(log.getClockInTime(), req.getClockOutTime()).toMinutes();
        int overtimeMinutes = (int) Math.max(0, minutesWorked - DAILY_REGULAR_MINUTES);

        log.setOvertimeMinutes(overtimeMinutes);
        log.setOvertimeCounted(true);

        AttendanceLog saved = attendanceLogRepository.save(log);

        if (overtimeMinutes > 0) {
            OvertimeEntry entry = new OvertimeEntry();
            entry.setWorker(worker);
            entry.setSite(site);
            entry.setAttendanceLog(saved);
            entry.setOvertimeGeneratedAt(Instant.now());
            entry.setOvertimeMinutes(overtimeMinutes);
            entry.setSettlementStatus(SettlementStatus.UNSETTLED);
            overtimeEntryRepository.save(entry);
        }

        return new AttendanceResponse(
                saved.getId(),
                worker.getId(),
                site.getId(),
                saved.getClockInTime(),
                saved.getClockOutTime(),
                saved.getOvertimeMinutes()
        );
    }
}

