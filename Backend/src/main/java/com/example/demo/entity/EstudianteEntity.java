package com.example.demo.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.hibernate.annotations.CreationTimestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "estudiante")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EstudianteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Pattern(regexp = "^[0-9]+-[0-9kK]{1}$", message = "Formato de RUT inválido")
    @Column(length = 12, unique = true)
    private String rut;

    @NotNull
    @Column(length = 100, nullable = false)
    private String nombre;

    @NotNull
    @Column(length = 100, nullable = false)
    private String apellido;

    @Email(message = "El correo debe ser válido")
    @Column(length = 150, unique = true)
    private String correo;

    @Column(length = 20)
    private String telefono;

    @NotNull
    @Column(name = "fecha_registro", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDate fechaRegistro;

    @ManyToOne
    @JoinColumn(name = "id_carrera")
    private CarreraEntity carrera;

    @OneToMany(mappedBy = "estudiante")
    @JsonIgnore
    private List<ReservaEntity> reservas = new ArrayList<>();

    @OneToOne(mappedBy = "estudiante", cascade = CascadeType.ALL)
    @JsonIgnore
    private UsuarioEntity usuario;
}
