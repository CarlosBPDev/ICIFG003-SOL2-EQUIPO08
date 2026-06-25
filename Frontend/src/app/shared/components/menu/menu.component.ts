import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoggerService } from '../../../services/logger.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  links = [
    { label: 'Inicio', path: '/home' },
    { label: 'Salas', path: '/salas' },
    { label: 'Reservas', path: '/reservas' },
    { label: 'Estudiantes', path: '/estudiantes' },
    { label: 'Contacto', path: '/contacto' }
  ];

  constructor(private logger: LoggerService) {}

  ngOnInit(): void {
    this.logger.info('Menu de navegacion inicializado');
  }
}
