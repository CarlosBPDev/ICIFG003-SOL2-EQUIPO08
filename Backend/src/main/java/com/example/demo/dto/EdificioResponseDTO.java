package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EdificioResponseDTO {
    private Long id;
    private String nombreEdificio;
    private String direccion;
}
