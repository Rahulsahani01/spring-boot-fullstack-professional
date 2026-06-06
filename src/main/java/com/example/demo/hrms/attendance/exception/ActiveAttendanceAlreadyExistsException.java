package com.example.demo.hrms.attendance.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class ActiveAttendanceAlreadyExistsException extends AttendanceException {
    public ActiveAttendanceAlreadyExistsException(String message) {
        super(message);
    }
}

