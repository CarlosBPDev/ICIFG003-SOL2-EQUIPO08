package com.example.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.RecursoResponseDTO;
import com.example.demo.entity.RecursoEntity;
import com.example.demo.repository.RecursoRepository;

@RestController
@RequestMapping("/recursos")
public class RecursoController {

    @Autowired
    private RecursoRepository recursoRepository;

    @GetMapping
    public List<RecursoResponseDTO> getRecursos() {
        return recursoRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private RecursoResponseDTO convertToDTO(RecursoEntity entity) {
        RecursoResponseDTO dto = new RecursoResponseDTO();
        dto.setId(entity.getId());
        dto.setNombreRecurso(entity.getNombreRecurso());
        dto.setDescripcion(entity.getDescripcion());
        return dto;
    }
}
