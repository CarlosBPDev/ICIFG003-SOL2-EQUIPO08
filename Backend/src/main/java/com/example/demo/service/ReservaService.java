package com.example.demo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

@Service
public class ReservaService {

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

    public List<ReservaResponseDTO> obtenerReservas(Long salaId, LocalDate fecha) {
        List<ReservaEntity> reservas;
        if (salaId != null && fecha != null) {
            reservas = reservaRepository.findBySalaAndFecha(salaId, fecha);
        } else if (fecha != null) {
            reservas = reservaRepository.findByFecha(fecha);
        } else {
            reservas = reservaRepository.findAll();
        }
        return reservas.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public ReservaResponseDTO crearReserva(ReservaRequestDTO request) {
        if (request.getFechaReserva() == null) {
            throw new RuntimeException("La fecha de reserva es obligatoria");
        }
        if (request.getFechaReserva().isBefore(LocalDate.now())) {
            throw new RuntimeException("La fecha de reserva no puede ser anterior a hoy");
        }

        if (request.getObservacion() == null || request.getObservacion().trim().length() < 15) {
            throw new RuntimeException("La observación debe tener al menos 15 caracteres");
        }

        EstudianteEntity estudiante = estudianteRepository.findById(request.getEstudianteId())
                .orElseThrow(() -> new RuntimeException("El estudiante con ID " + request.getEstudianteId() + " no existe"));

        SalaEntity sala = salaRepository.findById(request.getSalaId())
                .orElseThrow(() -> new RuntimeException("La sala con ID " + request.getSalaId() + " no existe"));

        HorarioDisponibleEntity horario = horarioDisponibleRepository.findById(request.getHorarioDisponibleId())
                .orElseThrow(() -> new RuntimeException("El horario disponible con ID " + request.getHorarioDisponibleId() + " no existe"));

        EstadoReservaEntity estado = estadoReservaRepository.findById(request.getEstadoReservaId())
                .orElseThrow(() -> new RuntimeException("El estado de reserva con ID " + request.getEstadoReservaId() + " no existe"));

        List<ReservaEntity> conflictos = reservaRepository.findConflictoHorario(
                request.getSalaId(),
                request.getHorarioDisponibleId(),
                request.getFechaReserva(),
                "Cancelada");

        if (!conflictos.isEmpty()) {
            throw new RuntimeException("Ya existe una reserva activa para esta sala, horario y fecha");
        }

        ReservaEntity entity = new ReservaEntity();
        entity.setFechaReserva(request.getFechaReserva());
        entity.setObservacion(request.getObservacion().trim());
        entity.setEstudiante(estudiante);
        entity.setSala(sala);
        entity.setHorarioDisponible(horario);
        entity.setEstadoReserva(estado);

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
