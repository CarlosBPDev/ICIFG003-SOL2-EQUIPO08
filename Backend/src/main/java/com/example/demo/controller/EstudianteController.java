package com.example.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.CarreraResponseDTO;
import com.example.demo.dto.EstudianteResponseDTO;
import com.example.demo.entity.EstudianteEntity;
import com.example.demo.repository.EstudianteRepository;

@RestController
@RequestMapping("/estudiantes")
public class EstudianteController {

    @Autowired
    private EstudianteRepository estudianteRepository;

    @GetMapping("/buscar")
    public List<EstudianteResponseDTO> buscarEstudiantes(
            @RequestParam(value = "rut", required = false) String rut,
            @RequestParam(value = "nombre", required = false) String nombre,
            @RequestParam(value = "apellido", required = false) String apellido) {
        
        List<EstudianteEntity> estudiantes = estudianteRepository.findByRutOrNombreAndApellido(rut, nombre, apellido);
        return estudiantes.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private EstudianteResponseDTO convertToDTO(EstudianteEntity entity) {
        EstudianteResponseDTO dto = new EstudianteResponseDTO();
        dto.setId(entity.getId());
        dto.setRut(entity.getRut());
        dto.setNombre(entity.getNombre());
        dto.setApellido(entity.getApellido());
        dto.setCorreo(entity.getCorreo());
        dto.setTelefono(entity.getTelefono());
        dto.setFechaRegistro(entity.getFechaRegistro());

        if (entity.getCarrera() != null) {
            CarreraResponseDTO carreraDTO = new CarreraResponseDTO();
            carreraDTO.setId(entity.getCarrera().getId());
            carreraDTO.setNombreCarrera(entity.getCarrera().getNombreCarrera());
            carreraDTO.setFacultad(entity.getCarrera().getFacultad());
            dto.setCarrera(carreraDTO);
        }
        return dto;
    }
}
