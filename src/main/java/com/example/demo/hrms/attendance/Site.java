package com.example.demo.hrms.attendance;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "site")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Site {

    @Id
    @SequenceGenerator(
            name = "site_sequence",
            sequenceName = "site_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            generator = "site_sequence",
            strategy = GenerationType.SEQUENCE
    )
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String address;
}

