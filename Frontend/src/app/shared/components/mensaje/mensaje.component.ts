import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mensaje',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.css']
})
export class MensajeComponent {
  @Input() tipo: 'exito' | 'error' | 'advertencia' = 'error';
  @Input() texto: string = '';

  get icono(): string {
    switch (this.tipo) {
      case 'exito': return 'fa-check-circle';
      case 'error': return 'fa-exclamation-triangle';
      case 'advertencia': return 'fa-exclamation-circle';
    }
  }
}
