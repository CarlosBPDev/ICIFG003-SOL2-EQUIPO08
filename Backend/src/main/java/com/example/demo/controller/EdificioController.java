package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.EdificioEntity;
import com.example.demo.repository.EdificioRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/edificios")
public class EdificioController {

    @Autowired
    private EdificioRepository edificioRepository;

    @GetMapping
    public List<EdificioEntity> getAllEdificios() {
        log.info("Consultando lista de edificios");
        return edificioRepository.findAll();
    }
}
