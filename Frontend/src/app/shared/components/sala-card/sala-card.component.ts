import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoggerService } from '../../../services/logger.service';
import { SalaResponseDTO, HorarioDisponibleResponseDTO } from '../../../models';

@Component({
  selector: 'app-sala-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sala-card.component.html',
  styleUrls: ['./sala-card.component.css']
})
export class SalaCardComponent implements OnInit {
  @Input() sala!: SalaResponseDTO;
  @Input() horarios: HorarioDisponibleResponseDTO[] = [];

  constructor(private router: Router, private logger: LoggerService) {}

  ngOnInit(): void {
    this.logger.info('SalaCardComponent inicializado para sala ID: {}', this.sala?.id);
  }

  getImagenUrl(): string {
    if (this.sala.capacidad <= 4) return 'assets/images/sala4p.jpg';
    if (this.sala.capacidad <= 8) return 'assets/images/sala8p.jpg';
    return 'assets/images/sala8mp.jpg';
  }

  reservar() {
    this.logger.info('Reservar sala ID: {} desde SalaCardComponent', this.sala.id);
    this.router.navigate(['/reservas/nueva'], { queryParams: { salaId: this.sala.id } });
  }
}
