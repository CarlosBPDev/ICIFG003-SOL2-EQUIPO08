package com.example.demo.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "estado_reserva")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EstadoReservaEntity {
    @Id
    @Column(name = "id_estado")
    private Long idEstado;

    @Column(name = "nombre_estado")
    private String nombreEstado;
}
