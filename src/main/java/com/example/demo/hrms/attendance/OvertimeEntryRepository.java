package com.example.demo.hrms.attendance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface OvertimeEntryRepository extends JpaRepository<OvertimeEntry, Long> {

    List<OvertimeEntry> findAllByWorker_IdAndSite_IdAndOvertimeGeneratedAtBetweenAndSettlementStatus(Long workerId,
            Long siteId,
            Instant start,
            Instant end,
            SettlementStatus settlementStatus);

    List<OvertimeEntry> findAllBySettlementStatusAndOvertimeGeneratedAtBetween(SettlementStatus settlementStatus, Instant start, Instant end);
}

