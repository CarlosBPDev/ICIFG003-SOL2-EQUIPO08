package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.SalaEntity;

@Repository
public interface SalaRepository extends JpaRepository<SalaEntity, Long> {

    @Query(value = "SELECT * FROM sala s WHERE s.capacidad = :capacidad AND s.id_edificio = :edificioId", nativeQuery = true)
    List<SalaEntity> findByCapacidadAndEdificioNative(@Param("capacidad") Integer capacidad, @Param("edificioId") Long edificioId);

    @Query("SELECT s FROM SalaEntity s JOIN FETCH s.edificio")
    List<SalaEntity> findAllWithEdificio();
}
