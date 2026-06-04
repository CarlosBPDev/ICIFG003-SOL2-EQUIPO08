package com.example.demo.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sala")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_sala", length = 20, unique = true)
    private String codigoSala;

    @NotNull
    @Column(name = "nombre_sala", length = 100, nullable = false)
    private String nombreSala;

    @NotNull
    @Column(nullable = false)
    private Integer capacidad;

    @NotNull
    @Column(nullable = false)
    private Integer piso;

    @NotNull
    @Column(length = 255, nullable = false)
    private String descripcion;

    @NotNull
    @Column(length = 30, nullable = false)
    private String estado;

    @ManyToOne
    @JoinColumn(name = "id_edificio")
    private EdificioEntity edificio;
}
