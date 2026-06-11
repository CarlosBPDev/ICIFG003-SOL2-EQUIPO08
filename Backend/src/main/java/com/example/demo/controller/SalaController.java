package com.example.demo.controller;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.EdificioResponseDTO;
import com.example.demo.dto.RecursoResponseDTO;
import com.example.demo.dto.SalaResponseDTO;
import com.example.demo.entity.RecursoEntity;
import com.example.demo.entity.SalaEntity;
import com.example.demo.repository.SalaRepository;

@RestController
@RequestMapping("/salas")
public class SalaController {

    @Autowired
    private SalaRepository salaRepository;

    @GetMapping
    public List<SalaResponseDTO> getSalas(
            @RequestParam(value = "capacidad", required = false) Integer capacidad,
            @RequestParam(value = "edificioId", required = false) Long edificioId) {
        
        List<SalaEntity> salas;
        if (capacidad != null && edificioId != null) {
            salas = salaRepository.findByCapacidadAndEdificioNative(capacidad, edificioId);
        } else {
            salas = salaRepository.findAllWithEdificio();
        }

        return salas.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private SalaResponseDTO convertToDTO(SalaEntity entity) {
        SalaResponseDTO dto = new SalaResponseDTO();
        dto.setId(entity.getId());
        dto.setCodigoSala(entity.getCodigoSala());
        dto.setNombreSala(entity.getNombreSala());
        dto.setCapacidad(entity.getCapacidad());
        dto.setPiso(entity.getPiso());
        dto.setDescripcion(entity.getDescripcion());
        dto.setEstado(entity.getEstado());
        
        if (entity.getEdificio() != null) {
            EdificioResponseDTO edificioDTO = new EdificioResponseDTO();
            edificioDTO.setId(entity.getEdificio().getId());
            edificioDTO.setNombreEdificio(entity.getEdificio().getNombreEdificio());
            edificioDTO.setDireccion(entity.getEdificio().getDireccion());
            dto.setEdificio(edificioDTO);
        }

        if (entity.getRecursos() != null && !entity.getRecursos().isEmpty()) {
            Set<RecursoResponseDTO> recursosDTO = entity.getRecursos().stream().map(this::recursoToDTO).collect(Collectors.toSet());
            dto.setRecursos(recursosDTO);
        }

        return dto;
    }

    private RecursoResponseDTO recursoToDTO(RecursoEntity entity) {
        RecursoResponseDTO dto = new RecursoResponseDTO();
        dto.setId(entity.getId());
        dto.setNombreRecurso(entity.getNombreRecurso());
        dto.setDescripcion(entity.getDescripcion());
        return dto;
    }
}
