import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 3rem; text-align: center; color: white;">
      <h2>Registro</h2>
      <p>Componente temporal de Registro</p>
    </div>
  `
})
export class RegisterComponent {}
