package com.example.demo.dto;

import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HorarioDisponibleResponseDTO {
    private Long id;
    private LocalTime horaInicio;
    private LocalTime horaTermino;
}
