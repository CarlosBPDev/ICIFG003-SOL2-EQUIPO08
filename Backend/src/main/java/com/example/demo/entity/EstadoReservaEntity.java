package com.example.demo.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

    @OneToMany(mappedBy = "estadoReserva")
    @JsonIgnore
    private List<ReservaEntity> reservas = new ArrayList<>();
}
