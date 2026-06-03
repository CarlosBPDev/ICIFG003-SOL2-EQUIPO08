package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.HorarioDisponibleEntity;

@Repository
public interface HorarioDisponibleRepository extends JpaRepository<HorarioDisponibleEntity, Long> {

    @Query("SELECT h FROM HorarioDisponibleEntity h " +
           "WHERE h.sala.id = :salaId " +
           "ORDER BY h.horaInicio")
    List<HorarioDisponibleEntity> findBySalaOrderByHoraInicio(@Param("salaId") Long salaId);
}
