package com.example.demo.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservaResponseDTO {
    private Long id;
    private LocalDate fechaReserva;
    private String observacion;
    private LocalDateTime fechaCreacion;
    private EstudianteResponseDTO estudiante;
    private SalaResponseDTO sala;
    private HorarioDisponibleResponseDTO horarioDisponible;
    private EstadoReservaResponseDTO estadoReserva;
}
