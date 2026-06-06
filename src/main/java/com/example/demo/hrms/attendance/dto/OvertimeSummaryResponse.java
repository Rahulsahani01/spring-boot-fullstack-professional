package com.example.demo.hrms.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OvertimeSummaryResponse {

    private Long workerId;
    private Long siteId;
    private Instant from;
    private Instant to;
    private int unsettledOvertimeMinutes;
}

