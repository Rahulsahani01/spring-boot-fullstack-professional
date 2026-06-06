package com.example.demo.hrms.attendance.controller;

import com.example.demo.hrms.attendance.Site;
import com.example.demo.hrms.attendance.SiteRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/sites")
@AllArgsConstructor
public class SiteController {

    private final SiteRepository siteRepository;

    @PostMapping
    public Site addSite(@RequestBody Site site) {
        return siteRepository.save(site);
    }

    @GetMapping
    public List<Site> getAllSites() {
        return siteRepository.findAll();
    }
}
