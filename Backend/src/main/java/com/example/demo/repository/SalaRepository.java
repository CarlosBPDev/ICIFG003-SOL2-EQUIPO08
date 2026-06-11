package com.example.demo.repository;

import java.time.LocalDate;
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

    // T3: Filtro capacidad por rangos
    @Query(value = "SELECT * FROM sala s WHERE s.capacidad <= :maxCapacidad", nativeQuery = true)
    List<SalaEntity> findByCapacidadMax(@Param("maxCapacidad") Integer maxCapacidad);

    @Query(value = "SELECT * FROM sala s WHERE s.capacidad > :minCapacidad", nativeQuery = true)
    List<SalaEntity> findByCapacidadMayorA(@Param("minCapacidad") Integer minCapacidad);

    // T2: Salas disponibles por fecha (que tienen al menos un horario no reservado activamente)
    @Query(value = "SELECT DISTINCT s.* FROM sala s " +
           "JOIN horario_disponible h ON h.sala_id = s.id " +
           "WHERE h.id NOT IN (" +
           "  SELECT r.horario_disponible_id FROM reserva r " +
           "  WHERE r.fecha_reserva = :fecha AND r.estado_reserva_id != 2" +
           ")", nativeQuery = true)
    List<SalaEntity> findSalasDisponiblesPorFecha(@Param("fecha") LocalDate fecha);
}
