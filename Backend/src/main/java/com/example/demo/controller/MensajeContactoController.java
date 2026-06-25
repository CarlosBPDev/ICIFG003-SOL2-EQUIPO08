package com.example.demo.controller;

import com.example.demo.entity.MensajeContactoEntity;
import com.example.demo.service.MensajeContactoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mensajes")
@CrossOrigin("*")
public class MensajeContactoController {

    private final MensajeContactoService service;

    public MensajeContactoController(MensajeContactoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<MensajeContactoEntity> crearMensaje(@RequestBody MensajeContactoEntity mensaje) {
        MensajeContactoEntity nuevo = service.guardarMensaje(mensaje);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MensajeContactoEntity>> listarMensajes() {
        return ResponseEntity.ok(service.obtenerTodos());
    }
}
