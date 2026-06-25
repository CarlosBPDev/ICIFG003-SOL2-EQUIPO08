package com.example.demo.service;

import com.example.demo.entity.MensajeContactoEntity;
import com.example.demo.repository.MensajeContactoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MensajeContactoService {

    private final MensajeContactoRepository repository;

    public MensajeContactoService(MensajeContactoRepository repository) {
        this.repository = repository;
    }

    public MensajeContactoEntity guardarMensaje(MensajeContactoEntity mensaje) {
        return repository.save(mensaje);
    }

    public List<MensajeContactoEntity> obtenerTodos() {
        return repository.findAll();
    }
}
