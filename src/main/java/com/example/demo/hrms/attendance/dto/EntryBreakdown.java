package com.example.demo.hrms.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EntryBreakdown {
    private Long attendanceLogId;
    private int overtimeMinutes;
}

