package com.example.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.HorarioDisponibleResponseDTO;
import com.example.demo.entity.HorarioDisponibleEntity;
import com.example.demo.repository.HorarioDisponibleRepository;

@RestController
@RequestMapping("/horarios")
public class HorarioDisponibleController {

    @Autowired
    private HorarioDisponibleRepository horarioDisponibleRepository;

    @GetMapping
    public List<HorarioDisponibleResponseDTO> getHorarios(
            @RequestParam("salaId") Long salaId) {
        List<HorarioDisponibleEntity> horarios = horarioDisponibleRepository.findBySalaOrderByHoraInicio(salaId);
        return horarios.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private HorarioDisponibleResponseDTO convertToDTO(HorarioDisponibleEntity entity) {
        HorarioDisponibleResponseDTO dto = new HorarioDisponibleResponseDTO();
        dto.setId(entity.getId());
        dto.setHoraInicio(entity.getHoraInicio());
        dto.setHoraTermino(entity.getHoraTermino());
        return dto;
    }
}
