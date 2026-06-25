package com.example.demo.dto;

import java.time.LocalDate;

import javax.validation.constraints.Future;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservaRequestDTO {

    @NotNull(message = "La fecha de reserva es obligatoria")
    @Future(message = "La fecha de reserva debe ser futura")
    private LocalDate fechaReserva;

    @NotNull(message = "La observación es obligatoria")
    @Size(min = 15, message = "La observación debe tener al menos 15 caracteres")
    private String observacion;

    @NotNull(message = "El estudiante es obligatorio")
    private Long estudianteId;

    @NotNull(message = "La sala es obligatoria")
    private Long salaId;

    @NotNull(message = "El horario es obligatorio")
    private Long horarioDisponibleId;

    @NotNull(message = "El estado de reserva es obligatorio")
    private Long estadoReservaId;
}
