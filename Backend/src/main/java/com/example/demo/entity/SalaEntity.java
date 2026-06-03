package com.example.demo.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

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

    @Column(name = "codigo_sala", unique = true)
    private String codigoSala;

    @Column(name = "nombre_sala")
    private String nombreSala;

    private Integer capacidad;
    private Integer piso;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private String estado;

    @ManyToOne
    @JoinColumn(name = "edificio_id")
    private EdificioEntity edificio;
}
