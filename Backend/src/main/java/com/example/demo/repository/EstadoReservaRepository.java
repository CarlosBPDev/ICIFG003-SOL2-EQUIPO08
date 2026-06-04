package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.EstadoReservaEntity;

@Repository
public interface EstadoReservaRepository extends JpaRepository<EstadoReservaEntity, Long> {
}
