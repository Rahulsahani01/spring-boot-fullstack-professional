package com.example.demo.hrms.attendance;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteRepository extends JpaRepository<Site, Long> {

    boolean existsByName(String name);
}

