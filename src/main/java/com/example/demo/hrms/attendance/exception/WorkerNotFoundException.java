package com.example.demo.hrms.attendance.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class WorkerNotFoundException extends AttendanceException {
    public WorkerNotFoundException(String message) {
        super(message);
    }
}

