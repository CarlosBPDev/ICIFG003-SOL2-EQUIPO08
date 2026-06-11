package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.EdificioEntity;
import com.example.demo.repository.EdificioRepository;

@RestController
@RequestMapping("/edificios")
public class EdificioController {

    @Autowired
    private EdificioRepository edificioRepository;

    @GetMapping
    public List<EdificioEntity> getAllEdificios() {
        return edificioRepository.findAll();
    }
}
