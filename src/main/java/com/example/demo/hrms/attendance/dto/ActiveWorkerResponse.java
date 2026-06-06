package com.example.demo.hrms.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.example.demo.hrms.attendance.Designation;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ActiveWorkerResponse {

    private Long workerId;
    private String name;
    private String phone;
    private Designation designation;
}

