package com.example.demo.hrms.attendance.controller;

import com.example.demo.hrms.attendance.dto.OvertimeSummaryResponse;
import com.example.demo.hrms.attendance.dto.SettlementResponse;
import com.example.demo.hrms.attendance.service.OvertimeService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("api/v1/overtime")
@AllArgsConstructor
public class OvertimeController {

    private final OvertimeService overtimeService;

    @GetMapping("/summary")
    public OvertimeSummaryResponse summary(
            @RequestParam Long workerId,
            @RequestParam Long siteId,
            @RequestParam Instant from,
            @RequestParam Instant to
    ) {
        return overtimeService.getOvertimeSummary(workerId, siteId, from, to);
    }

    @PostMapping("/settle")
    public SettlementResponse settle(
            @RequestParam Instant from,
            @RequestParam Instant to
    ) {
        return overtimeService.settleAllUnsettled(from, to);
    }
}

