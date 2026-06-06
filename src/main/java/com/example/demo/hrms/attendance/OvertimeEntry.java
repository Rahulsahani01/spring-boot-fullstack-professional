package com.example.demo.hrms.attendance;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "overtime_entry")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class OvertimeEntry {

    @Id
    @SequenceGenerator(
            name = "overtime_entry_sequence",
            sequenceName = "overtime_entry_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            generator = "overtime_entry_sequence",
            strategy = GenerationType.SEQUENCE
    )
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false)
    private Site site;

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "attendance_log_id", nullable = false, unique = true)
    private AttendanceLog attendanceLog;

    @Column(nullable = false)
    private Instant overtimeGeneratedAt;

    @Column(nullable = false)
    private int overtimeMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SettlementStatus settlementStatus;
}

