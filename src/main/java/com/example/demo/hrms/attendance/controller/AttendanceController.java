package com.example.demo.hrms.attendance.controller;

import com.example.demo.hrms.attendance.WorkerRepository;
import com.example.demo.hrms.attendance.dto.ActiveWorkerResponse;
import com.example.demo.hrms.attendance.dto.AttendanceResponse;
import com.example.demo.hrms.attendance.dto.ClockInRequest;
import com.example.demo.hrms.attendance.dto.ClockOutRequest;
import com.example.demo.hrms.attendance.service.AttendanceService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/v1/attendance")
@AllArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final WorkerRepository workerRepository;

    @PostMapping("/clock-in")
    public AttendanceResponse clockIn(@RequestBody ClockInRequest request) {
        return attendanceService.clockIn(request);
    }

    @PostMapping("/clock-out")
    public AttendanceResponse clockOut(@RequestBody ClockOutRequest request) {
        return attendanceService.clockOut(request);
    }

    @GetMapping("/active-workers")
    public List<ActiveWorkerResponse> activeWorkers() {
        return workerRepository.findByActiveTrue().stream()
                .map(w -> new ActiveWorkerResponse(w.getId(), w.getName(), w.getPhone(), w.getDesignation()))
                .collect(Collectors.toList());
    }
}

