import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SalaService } from '../../../services/sala.service';
import { ReservaService } from '../../../services/reserva.service';
import { HorarioService } from '../../../services/horario.service';
import { SalaCardComponent } from '../../../shared/components/sala-card/sala-card.component';
import { SalaResponseDTO, ReservaResponseDTO } from '../../../models';

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [CommonModule, FormsModule, SalaCardComponent],
  templateUrl: './salas.component.html',
  styleUrls: ['./salas.component.css']
})
export class SalasComponent implements OnInit {
  salas: SalaResponseDTO[] = [];
  filteredSalas: SalaResponseDTO[] = [];
  reservations: ReservaResponseDTO[] = [];

  capacidadFilter: string = 'all';
  fechaFilter: string = '';

  loading: boolean = false;

  constructor(
    private salaService: SalaService,
    private reservaService: ReservaService,
    private horarioService: HorarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSalas();
  }

  loadSalas(): void {
    this.loading = true;
    this.salaService.getSalas().subscribe({
      next: (data) => {
        this.salas = data;
        this.loadHorarios();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar salas:', err);
        this.loading = false;
      }
    });
  }

  loadHorarios(): void {
    this.salas.forEach(sala => {
      this.horarioService.getHorarios(sala.id).subscribe({
        next: (horarios) => {
          sala.horarios = horarios;
        },
        error: () => {}
      });
    });
  }

  onFilterChange(): void {
    if (this.fechaFilter) {
      this.loading = true;
      this.reservaService.getReservas(undefined, this.fechaFilter).subscribe({
        next: (data) => {
          this.reservations = data;
          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar reservas:', err);
          this.loading = false;
        }
      });
    } else {
      this.reservations = [];
      this.applyFilters();
    }
  }

  applyFilters(): void {
    let result = [...this.salas];

    if (this.capacidadFilter === '4') {
      result = result.filter(s => s.capacidad <= 4);
    } else if (this.capacidadFilter === '8') {
      result = result.filter(s => s.capacidad <= 8);
    } else if (this.capacidadFilter === 'more') {
      result = result.filter(s => s.capacidad > 8);
    }

    this.filteredSalas = result;
  }

  isSalaReservada(salaId: number): boolean {
    if (!this.fechaFilter) return false;
    return this.reservations.some(r => r.sala && r.sala.id === salaId);
  }

  getReservasForSala(salaId: number): ReservaResponseDTO[] {
    return this.reservations.filter(r => r.sala && r.sala.id === salaId);
  }

  reservarSala(salaId: number): void {
    this.router.navigate(['/reservas/nueva'], { queryParams: { salaId } });
  }
}
