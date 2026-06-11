package com.example.demo.entity;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "horario_disponible")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HorarioDisponibleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hora_inicio")
    private LocalTime horaInicio;

    @Column(name = "hora_termino")
    private LocalTime horaTermino;

    @ManyToOne
    @JoinColumn(name = "sala_id")
    private SalaEntity sala;

    @OneToMany(mappedBy = "horarioDisponible")
    @JsonIgnore
    private List<ReservaEntity> reservas = new ArrayList<>();
}
