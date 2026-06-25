import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../../services/logger.service';

@Component({
  selector: 'app-mensaje',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.css']
})
export class MensajeComponent implements OnInit {
  @Input() tipo: 'exito' | 'error' | 'advertencia' = 'error';
  @Input() texto: string | null = null;

  constructor(private logger: LoggerService) {}

  ngOnInit(): void {
    this.logger.info('Componente mensaje inicializado - tipo: {}, texto: {}', this.tipo, this.texto);
  }

  get icono(): string {
    switch (this.tipo) {
      case 'exito': return 'fa-check-circle';
      case 'error': return 'fa-exclamation-triangle';
      case 'advertencia': return 'fa-exclamation-circle';
    }
  }
}
