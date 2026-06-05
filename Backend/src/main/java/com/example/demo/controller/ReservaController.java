package com.example.demo.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ReservaRequestDTO;
import com.example.demo.dto.ReservaResponseDTO;
import com.example.demo.service.ReservaService;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @GetMapping
    public List<ReservaResponseDTO> getReservas(
            @RequestParam(value = "salaId", required = false) Long salaId,
            @RequestParam(value = "fecha", required = false) String fechaStr) {

        LocalDate fecha = (fechaStr != null) ? LocalDate.parse(fechaStr) : null;
        return reservaService.obtenerReservas(salaId, fecha);
    }

    @PostMapping
    public ReservaResponseDTO createReserva(@RequestBody ReservaRequestDTO request) {
        return reservaService.crearReserva(request);
    }
}
