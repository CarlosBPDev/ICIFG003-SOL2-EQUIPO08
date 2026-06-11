package com.example.demo.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EstudianteResponseDTO {
    private Long id;
    private String rut;
    private String nombre;
    private String apellido;
    private String correo;
    private String telefono;
    private LocalDate fechaRegistro;
    private CarreraResponseDTO carrera;
}
