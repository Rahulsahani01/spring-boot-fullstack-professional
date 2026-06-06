package com.example.demo.hrms.attendance.controller;

import com.example.demo.hrms.attendance.Worker;
import com.example.demo.hrms.attendance.WorkerRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/workers")
@AllArgsConstructor
public class WorkerController {

    private final WorkerRepository workerRepository;

    @PostMapping
    public Worker addWorker(@RequestBody Worker worker) {
        worker.setActive(true);
        return workerRepository.save(worker);
    }

    @GetMapping
    public List<Worker> getAllWorkers() {
        return workerRepository.findAll();
    }
}
