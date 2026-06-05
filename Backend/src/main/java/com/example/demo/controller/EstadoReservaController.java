package com.example.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.EstadoReservaResponseDTO;
import com.example.demo.entity.EstadoReservaEntity;
import com.example.demo.repository.EstadoReservaRepository;

@RestController
@RequestMapping("/estados-reserva")
public class EstadoReservaController {

    @Autowired
    private EstadoReservaRepository estadoReservaRepository;

    @GetMapping
    public List<EstadoReservaResponseDTO> getEstados() {
        return estadoReservaRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private EstadoReservaResponseDTO convertToDTO(EstadoReservaEntity entity) {
        EstadoReservaResponseDTO dto = new EstadoReservaResponseDTO();
        dto.setId(entity.getIdEstado());
        dto.setNombreEstado(entity.getNombreEstado());
        return dto;
    }
}
