package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.EstudianteEntity;

@Repository
public interface EstudianteRepository extends JpaRepository<EstudianteEntity, Long> {

    @Query("SELECT e FROM EstudianteEntity e WHERE e.rut = :rut OR (e.nombre = :nombre AND e.apellido = :apellido)")
    List<EstudianteEntity> findByRutOrNombreAndApellido(@Param("rut") String rut, @Param("nombre") String nombre, @Param("apellido") String apellido);

    @Query("SELECT e FROM EstudianteEntity e WHERE e.correo = :correo")
    List<EstudianteEntity> findByCorreo(@Param("correo") String correo);
}
