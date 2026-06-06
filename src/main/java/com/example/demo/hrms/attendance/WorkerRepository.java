package com.example.demo.hrms.attendance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkerRepository extends JpaRepository<Worker, Long> {

    boolean existsByPhone(String phone);

    List<Worker> findByActiveTrue();
}

