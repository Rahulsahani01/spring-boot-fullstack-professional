package com.example.demo.hrms.attendance;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "worker")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Worker {

    @Id
    @SequenceGenerator(
            name = "worker_sequence",
            sequenceName = "worker_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            generator = "worker_sequence",
            strategy = GenerationType.SEQUENCE
    )
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Designation designation;

    @Column(nullable = false)
    private boolean active;
}

