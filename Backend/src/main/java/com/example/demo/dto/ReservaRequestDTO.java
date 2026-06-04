package com.example.demo.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservaRequestDTO {
    private LocalDate fechaReserva;
    private String observacion;
    private Long estudianteId;
    private Long salaId;
    private Long horarioDisponibleId;
    private Long estadoReservaId;
}
