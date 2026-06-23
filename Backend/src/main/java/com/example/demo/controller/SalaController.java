package com.example.demo.controller;

import java.time.LocalDate;
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

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/salas")
public class SalaController {

    @Autowired
    private SalaRepository salaRepository;

    @GetMapping
    public List<SalaResponseDTO> getSalas(
            @RequestParam(value = "capacidad", required = false) Integer capacidad,
            @RequestParam(value = "capacidadMax", required = false) Integer capacidadMax,
            @RequestParam(value = "capacidadMin", required = false) Integer capacidadMin,
            @RequestParam(value = "edificioId", required = false) Long edificioId) {
        
        log.info("Consultando salas - capacidad: {}, capacidadMax: {}, capacidadMin: {}, edificioId: {}", 
                 capacidad, capacidadMax, capacidadMin, edificioId);
        List<SalaEntity> salas;

        if (capacidadMax != null) {
            salas = salaRepository.findByCapacidadMax(capacidadMax);
        } else if (capacidadMin != null) {
            salas = salaRepository.findByCapacidadMayorA(capacidadMin);
        } else if (capacidad != null && edificioId != null) {
            salas = salaRepository.findByCapacidadAndEdificioNative(capacidad, edificioId);
        } else {
            salas = salaRepository.findAllWithEdificio();
        }

        log.info("Salas encontradas: {}", salas.size());
        return salas.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @GetMapping("/disponibles")
    public List<SalaResponseDTO> getSalasDisponibles(
            @RequestParam("fecha") String fechaStr) {
        log.info("Consultando salas disponibles para fecha: {}", fechaStr);
        LocalDate fecha = LocalDate.parse(fechaStr);
        List<SalaEntity> salas = salaRepository.findSalasDisponiblesPorFecha(fecha);
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
