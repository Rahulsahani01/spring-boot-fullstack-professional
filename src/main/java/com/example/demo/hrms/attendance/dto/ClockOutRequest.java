package com.example.demo.hrms.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClockOutRequest {

    @NotNull
    private Long workerId;

    @NotNull
    private Long siteId;

    @NotNull
    private Instant clockOutTime;
}

