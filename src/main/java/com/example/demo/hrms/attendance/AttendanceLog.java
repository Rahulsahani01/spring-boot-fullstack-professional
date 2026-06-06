package com.example.demo.hrms.attendance;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "attendance_log")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceLog {

    @Id
    @SequenceGenerator(
            name = "attendance_log_sequence",
            sequenceName = "attendance_log_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            generator = "attendance_log_sequence",
            strategy = GenerationType.SEQUENCE
    )
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false)
    private Site site;

    @Column(nullable = false)
    private Instant clockInTime;

    private Instant clockOutTime;

    @Column(nullable = false)
    private boolean overtimeCounted;

    @Column(nullable = false)
    private int overtimeMinutes;
}

