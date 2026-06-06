package com.example.demo.hrms.attendance.dto;

import com.example.demo.hrms.attendance.SettlementStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SettlementResponse {

    private SettlementStatus status;
    private int settledOvertimeEntries;
}

