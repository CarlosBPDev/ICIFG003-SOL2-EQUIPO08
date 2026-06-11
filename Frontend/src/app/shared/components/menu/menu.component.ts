import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  links = [
    { label: 'Inicio', path: '/home' },
    { label: 'Salas', path: '/salas' },
    { label: 'Reservas', path: '/reservas' },
    { label: 'Estudiantes', path: '/estudiantes' }
  ];
}
