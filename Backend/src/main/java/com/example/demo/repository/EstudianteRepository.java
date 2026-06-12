package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.EstudianteEntity;

@Repository
public interface EstudianteRepository extends JpaRepository<EstudianteEntity, Long> {

    @Query("SELECT e FROM EstudianteEntity e WHERE " +
           "(:rut IS NOT NULL AND e.rut = :rut) OR " +
           "(:nombre IS NOT NULL AND LOWER(e.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')) " +
           "AND (:apellido IS NULL OR :apellido = '' OR LOWER(e.apellido) LIKE LOWER(CONCAT('%', :apellido, '%'))))")
    List<EstudianteEntity> findByRutOrNombreAndApellido(@Param("rut") String rut, @Param("nombre") String nombre, @Param("apellido") String apellido);

    @Query("SELECT e FROM EstudianteEntity e WHERE e.correo = :correo")
    List<EstudianteEntity> findByCorreo(@Param("correo") String correo);
}
