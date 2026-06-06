package com.example.demo.hrms.attendance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface AttendanceLogRepository extends JpaRepository<AttendanceLog, Long> {

    Optional<AttendanceLog> findTopByWorker_IdAndSite_IdAndClockOutTimeIsNullOrderByClockInTimeDesc(Long workerId, Long siteId);

    List<AttendanceLog> findAllByWorker_IdAndSite_IdAndClockInTimeBetween(Long workerId, Long siteId, Instant start, Instant end);
}

