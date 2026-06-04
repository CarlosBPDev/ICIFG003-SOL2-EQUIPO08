package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.EdificioEntity;

@Repository
public interface EdificioRepository extends JpaRepository<EdificioEntity, Long> {
}
