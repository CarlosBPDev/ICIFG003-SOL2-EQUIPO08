package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecursoResponseDTO {
    private Long id;
    private String nombreRecurso;
    private String descripcion;
}
