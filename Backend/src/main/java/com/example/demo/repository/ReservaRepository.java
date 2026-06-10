package com.example.demo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.ReservaEntity;

@Repository
public interface ReservaRepository extends JpaRepository<ReservaEntity, Long> {

    @Query(value = "SELECT * FROM reserva WHERE sala_id = :salaId AND fecha_reserva = :fecha",
           nativeQuery = true)
    List<ReservaEntity> findBySalaAndFecha(@Param("salaId") Long salaId,
                                           @Param("fecha") LocalDate fecha);

    @Query(value = "SELECT * FROM reserva WHERE fecha_reserva = :fecha",
           nativeQuery = true)
    List<ReservaEntity> findByFecha(@Param("fecha") LocalDate fecha);

    @Query("SELECT r FROM ReservaEntity r " +
           "WHERE r.sala.id = :salaId " +
           "AND r.horarioDisponible.id = :horarioId " +
           "AND r.fechaReserva = :fecha " +
           "AND r.estadoReserva.nombreEstado <> :estadoExcluido")
    List<ReservaEntity> findConflictoHorario(@Param("salaId") Long salaId,
                                             @Param("horarioId") Long horarioId,
                                             @Param("fecha") LocalDate fecha,
                                             @Param("estadoExcluido") String estadoExcluido);
}
