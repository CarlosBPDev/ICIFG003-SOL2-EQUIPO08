import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  links = [
    { label: 'Inicio', path: '/' },
    { label: 'Salas', path: '/salas' },
    { label: 'Mis Reservas', path: '/reservas' }
  ];
}
