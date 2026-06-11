package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.CarreraResponseDTO;
import com.example.demo.dto.EstudianteResponseDTO;
import com.example.demo.dto.LoginRequestDTO;
import com.example.demo.entity.UsuarioEntity;
import com.example.demo.repository.UsuarioRepository;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public EstudianteResponseDTO login(@RequestBody LoginRequestDTO request) {
        UsuarioEntity usuario = usuarioRepository.findByUsernameWithEstudiante(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario o contraseña incorrectos"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new RuntimeException("Usuario o contraseña incorrectos");
        }

        var estudiante = usuario.getEstudiante();
        EstudianteResponseDTO dto = new EstudianteResponseDTO();
        dto.setId(estudiante.getId());
        dto.setRut(estudiante.getRut());
        dto.setNombre(estudiante.getNombre());
        dto.setApellido(estudiante.getApellido());
        dto.setCorreo(estudiante.getCorreo());
        dto.setTelefono(estudiante.getTelefono());
        dto.setFechaRegistro(estudiante.getFechaRegistro());

        if (estudiante.getCarrera() != null) {
            CarreraResponseDTO carreraDTO = new CarreraResponseDTO();
            carreraDTO.setId(estudiante.getCarrera().getId());
            carreraDTO.setNombreCarrera(estudiante.getCarrera().getNombreCarrera());
            carreraDTO.setFacultad(estudiante.getCarrera().getFacultad());
            dto.setCarrera(carreraDTO);
        }

        return dto;
    }
}
