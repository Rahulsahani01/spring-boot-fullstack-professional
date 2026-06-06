package com.example.demo.hrms.attendance.service;

import com.example.demo.hrms.attendance.*;
import com.example.demo.hrms.attendance.dto.OvertimeSummaryResponse;
import com.example.demo.hrms.attendance.dto.SettlementResponse;
import com.example.demo.hrms.attendance.exception.SettlementNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@AllArgsConstructor
@Service
public class OvertimeService {

    private final WorkerRepository workerRepository;
    private final SiteRepository siteRepository;
    private final OvertimeEntryRepository overtimeEntryRepository;

    public OvertimeSummaryResponse getOvertimeSummary(Long workerId,
                                                       Long siteId,
                                                       Instant from,
                                                       Instant to) {
        // Expects entries with UNSETTLED status only.
        List<OvertimeEntry> entries = overtimeEntryRepository.findAllByWorker_IdAndSite_IdAndOvertimeGeneratedAtBetweenAndSettlementStatus(
                workerId,
                siteId,
                from,
                to,
                SettlementStatus.UNSETTLED
        );

        int sum = entries.stream().mapToInt(OvertimeEntry::getOvertimeMinutes).sum();

        return new OvertimeSummaryResponse(workerId, siteId, from, to, sum);
    }

    public SettlementResponse settleAllUnsettled(Instant from, Instant to) {
        List<OvertimeEntry> entries = overtimeEntryRepository.findAllBySettlementStatusAndOvertimeGeneratedAtBetween(
                SettlementStatus.UNSETTLED,
                from,
                to
        );

        if (entries.isEmpty()) {
            throw new SettlementNotFoundException("No unsettled overtime entries in the given range");
        }

        for (OvertimeEntry entry : entries) {
            entry.setSettlementStatus(SettlementStatus.SETTLED);
        }
        overtimeEntryRepository.saveAll(entries);

        return new SettlementResponse(SettlementStatus.SETTLED, entries.size());
    }
}

