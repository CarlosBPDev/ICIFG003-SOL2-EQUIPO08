import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SalaResponseDTO, HorarioDisponibleResponseDTO } from '../../../models';

@Component({
  selector: 'app-sala-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sala-card.component.html',
  styleUrls: ['./sala-card.component.css']
})
export class SalaCardComponent {
  @Input() sala!: SalaResponseDTO;
  @Input() horarios: HorarioDisponibleResponseDTO[] = [];

  constructor(private router: Router) {}

  getImagenUrl(): string {
    if (this.sala.capacidad <= 4) return 'assets/images/sala4p.jpg';
    if (this.sala.capacidad <= 8) return 'assets/images/sala8p.jpg';
    return 'assets/images/sala8mp.jpg';
  }

  reservar() {
    this.router.navigate(['/reservas/nueva'], { queryParams: { salaId: this.sala.id } });
  }
}
