package com.example.demo.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.CarreraResponseDTO;
import com.example.demo.dto.EdificioResponseDTO;
import com.example.demo.dto.EstadoReservaResponseDTO;
import com.example.demo.dto.EstudianteResponseDTO;
import com.example.demo.dto.HorarioDisponibleResponseDTO;
import com.example.demo.dto.ReservaRequestDTO;
import com.example.demo.dto.ReservaResponseDTO;
import com.example.demo.dto.SalaResponseDTO;
import com.example.demo.entity.EstadoReservaEntity;
import com.example.demo.entity.EstudianteEntity;
import com.example.demo.entity.HorarioDisponibleEntity;
import com.example.demo.entity.ReservaEntity;
import com.example.demo.entity.SalaEntity;
import com.example.demo.repository.EstadoReservaRepository;
import com.example.demo.repository.EstudianteRepository;
import com.example.demo.repository.HorarioDisponibleRepository;
import com.example.demo.repository.ReservaRepository;
import com.example.demo.repository.SalaRepository;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private SalaRepository salaRepository;

    @Autowired
    private HorarioDisponibleRepository horarioDisponibleRepository;

    @Autowired
    private EstadoReservaRepository estadoReservaRepository;

    @GetMapping
    public List<ReservaResponseDTO> getReservas(
            @RequestParam(value = "salaId", required = false) Long salaId,
            @RequestParam(value = "fecha", required = false) String fechaStr) {
        
        List<ReservaEntity> reservas;
        if (salaId != null && fechaStr != null) {
            LocalDate fecha = LocalDate.parse(fechaStr);
            reservas = reservaRepository.findBySalaAndFecha(salaId, fecha);
        } else {
            reservas = reservaRepository.findAll();
        }
        return reservas.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @PostMapping
    public ReservaResponseDTO createReserva(@RequestBody ReservaRequestDTO request) {
        ReservaEntity entity = new ReservaEntity();
        entity.setFechaReserva(request.getFechaReserva());
        entity.setObservacion(request.getObservacion());

        if (request.getEstudianteId() != null) {
            EstudianteEntity estudiante = estudianteRepository.findById(request.getEstudianteId())
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
            entity.setEstudiante(estudiante);
        }

        if (request.getSalaId() != null) {
            SalaEntity sala = salaRepository.findById(request.getSalaId())
                    .orElseThrow(() -> new RuntimeException("Sala no encontrada"));
            entity.setSala(sala);
        }

        if (request.getHorarioDisponibleId() != null) {
            HorarioDisponibleEntity horario = horarioDisponibleRepository.findById(request.getHorarioDisponibleId())
                    .orElseThrow(() -> new RuntimeException("Horario disponible no encontrado"));
            entity.setHorarioDisponible(horario);
        }

        if (request.getEstadoReservaId() != null) {
            EstadoReservaEntity estado = estadoReservaRepository.findById(request.getEstadoReservaId())
                    .orElseThrow(() -> new RuntimeException("Estado de reserva no encontrado"));
            entity.setEstadoReserva(estado);
        }

        ReservaEntity saved = reservaRepository.save(entity);
        return convertToDTO(saved);
    }

    private ReservaResponseDTO convertToDTO(ReservaEntity entity) {
        ReservaResponseDTO dto = new ReservaResponseDTO();
        dto.setId(entity.getId());
        dto.setFechaReserva(entity.getFechaReserva());
        dto.setObservacion(entity.getObservacion());
        dto.setFechaCreacion(entity.getFechaCreacion());

        if (entity.getEstudiante() != null) {
            EstudianteResponseDTO estDTO = new EstudianteResponseDTO();
            estDTO.setId(entity.getEstudiante().getId());
            estDTO.setRut(entity.getEstudiante().getRut());
            estDTO.setNombre(entity.getEstudiante().getNombre());
            estDTO.setApellido(entity.getEstudiante().getApellido());
            estDTO.setCorreo(entity.getEstudiante().getCorreo());
            estDTO.setTelefono(entity.getEstudiante().getTelefono());
            estDTO.setFechaRegistro(entity.getEstudiante().getFechaRegistro());
            
            if (entity.getEstudiante().getCarrera() != null) {
                CarreraResponseDTO carrDTO = new CarreraResponseDTO();
                carrDTO.setId(entity.getEstudiante().getCarrera().getId());
                carrDTO.setNombreCarrera(entity.getEstudiante().getCarrera().getNombreCarrera());
                carrDTO.setFacultad(entity.getEstudiante().getCarrera().getFacultad());
                estDTO.setCarrera(carrDTO);
            }
            dto.setEstudiante(estDTO);
        }

        if (entity.getSala() != null) {
            SalaResponseDTO salaDTO = new SalaResponseDTO();
            salaDTO.setId(entity.getSala().getId());
            salaDTO.setCodigoSala(entity.getSala().getCodigoSala());
            salaDTO.setNombreSala(entity.getSala().getNombreSala());
            salaDTO.setCapacidad(entity.getSala().getCapacidad());
            salaDTO.setPiso(entity.getSala().getPiso());
            salaDTO.setDescripcion(entity.getSala().getDescripcion());
            salaDTO.setEstado(entity.getSala().getEstado());

            if (entity.getSala().getEdificio() != null) {
                EdificioResponseDTO edDTO = new EdificioResponseDTO();
                edDTO.setId(entity.getSala().getEdificio().getId());
                edDTO.setNombreEdificio(entity.getSala().getEdificio().getNombreEdificio());
                edDTO.setDireccion(entity.getSala().getEdificio().getDireccion());
                salaDTO.setEdificio(edDTO);
            }
            dto.setSala(salaDTO);
        }

        if (entity.getHorarioDisponible() != null) {
            HorarioDisponibleResponseDTO horDTO = new HorarioDisponibleResponseDTO();
            horDTO.setId(entity.getHorarioDisponible().getId());
            horDTO.setHoraInicio(entity.getHorarioDisponible().getHoraInicio());
            horDTO.setHoraTermino(entity.getHorarioDisponible().getHoraTermino());
            dto.setHorarioDisponible(horDTO);
        }

        if (entity.getEstadoReserva() != null) {
            EstadoReservaResponseDTO estResDTO = new EstadoReservaResponseDTO();
            estResDTO.setId(entity.getEstadoReserva().getIdEstado());
            estResDTO.setNombreEstado(entity.getEstadoReserva().getNombreEstado());
            dto.setEstadoReserva(estResDTO);
        }

        return dto;
    }
}
