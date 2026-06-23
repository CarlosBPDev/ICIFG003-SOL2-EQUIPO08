import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoggerService } from '../../../services/logger.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  salasPreview = [
    { codigo: 'S-101', nombre: 'Sala de Estudio Individual', capacidad: 1, descripcion: 'Espacio privado ideal para concentración y estudio silencioso.' },
    { codigo: 'S-204', nombre: 'Sala de Trabajo Grupal', capacidad: 6, descripcion: 'Equipada con pizarra y proyector para trabajos en equipo.' },
    { codigo: 'S-308', nombre: 'Sala de Conferencias', capacidad: 12, descripcion: 'Sala amplia con sistema de videoconferencia y acústica profesional.' }
  ];

  avisos = [
    { icono: 'fas fa-bullhorn', texto: 'Las reservas deben realizarse con al menos un día de anticipación.' },
    { icono: 'fas fa-clock', texto: 'El uso máximo por sala es de 4 horas consecutivas por estudiante.' },
    { icono: 'fas fa-broom', texto: 'Mantén el orden y limpieza de las salas después de su uso.' },
    { icono: 'fas fa-phone', texto: 'Para incidentes, contacta a la biblioteca al anexo 1234.' }
  ];

  constructor(private logger: LoggerService) {}

  ngOnInit(): void {
    this.logger.info('Componente home inicializado');
  }
}
