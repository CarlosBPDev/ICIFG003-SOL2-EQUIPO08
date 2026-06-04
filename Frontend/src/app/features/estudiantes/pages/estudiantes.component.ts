import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 3rem; text-align: center; color: white;">
      <h2>Estudiantes</h2>
      <p>Componente temporal de Estudiantes</p>
    </div>
  `
})
export class EstudiantesComponent {}
