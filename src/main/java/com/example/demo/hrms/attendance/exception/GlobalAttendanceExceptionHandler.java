package com.example.demo.hrms.attendance.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalAttendanceExceptionHandler {

    @ExceptionHandler(AttendanceException.class)
    public Map<String, Object> handleAttendanceException(AttendanceException ex) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        // Many exceptions are annotated with @ResponseStatus, but this keeps a stable response body.
        ResponseStatus rs = ex.getClass().getAnnotation(ResponseStatus.class);
        if (rs != null) {
            status = rs.value();
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", status.getReasonPhrase());
        body.put("message", ex.getMessage());
        body.put("timestamp", Instant.now().toString());
        return body;
    }
}

// Local copy to avoid extra imports in some environments
@interface ResponseStatus {
    HttpStatus value();
}

