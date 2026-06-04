package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalaResponseDTO {
    private Long id;
    private String codigoSala;
    private String nombreSala;
    private Integer capacidad;
    private Integer piso;
    private String descripcion;
    private String estado;
    private EdificioResponseDTO edificio;
}
