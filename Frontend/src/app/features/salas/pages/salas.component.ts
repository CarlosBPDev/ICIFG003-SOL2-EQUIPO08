import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SalaService } from '../../../services/sala.service';
import { ReservaService } from '../../../services/reserva.service';
import { HorarioService } from '../../../services/horario.service';
import { SalaCardComponent } from '../../../shared/components/sala-card/sala-card.component';
import { MensajeComponent } from '../../../shared/components/mensaje/mensaje.component';
import { SalaResponseDTO, ReservaResponseDTO } from '../../../models';

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [CommonModule, FormsModule, SalaCardComponent, MensajeComponent],
  templateUrl: './salas.component.html',
  styleUrls: ['./salas.component.css']
})
export class SalasComponent implements OnInit, OnDestroy {
  salas: SalaResponseDTO[] = [];
  filteredSalas: SalaResponseDTO[] = [];
  reservations: ReservaResponseDTO[] = [];

  capacidadFilter: string = 'all';
  fechaFilter: string = '';

  loading: boolean = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;
  private successTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private salaService: SalaService,
    private reservaService: ReservaService,
    private horarioService: HorarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSalas();
  }

  private showSuccess(msg: string): void {
    this.successMsg = msg;
    if (this.successTimer) clearTimeout(this.successTimer);
    this.successTimer = setTimeout(() => this.successMsg = null, 3000);
  }

  private clearMessages(): void {
    this.errorMsg = null;
    this.successMsg = null;
  }

  get hoy(): string {
    return new Date().toISOString().split('T')[0];
  }

  loadSalas(): void {
    this.loading = true;
    this.clearMessages();

    let capacidadMax: number | undefined;
    let capacidadMin: number | undefined;

    if (this.capacidadFilter === '4') {
      capacidadMax = 4;
    } else if (this.capacidadFilter === '8') {
      capacidadMax = 8;
    } else if (this.capacidadFilter === 'more') {
      capacidadMin = 8;
    }

    if (this.fechaFilter) {
      this.salaService.getSalasDisponibles(this.fechaFilter).subscribe({
        next: (data) => {
          this.salas = data;
          this.loadHorarios();
          this.applyCapacidadFilter();
          this.loadReservationsForDate();
          this.loading = false;
          this.showSuccess('Salas disponibles cargadas correctamente.');
        },
        error: (err) => {
          console.error('Error al cargar salas disponibles:', err);
          this.errorMsg = err.error?.userMessage || 'No se pudieron cargar las salas. Verifica tu conexión.';
          this.loading = false;
        }
      });
    } else {
      this.salaService.getSalas(capacidadMax, capacidadMin).subscribe({
        next: (data) => {
          this.salas = data;
          this.loadHorarios();
          this.filteredSalas = data;
          this.loading = false;
          this.showSuccess('Salas cargadas correctamente.');
        },
        error: (err) => {
          console.error('Error al cargar salas:', err);
          this.errorMsg = err.error?.userMessage || 'No se pudieron cargar las salas. Verifica tu conexión.';
          this.loading = false;
        }
      });
    }
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

  loadReservationsForDate(): void {
    if (!this.fechaFilter) {
      this.reservations = [];
      return;
    }
    this.reservaService.getReservas(undefined, this.fechaFilter).subscribe({
      next: (data) => {
        this.reservations = data;
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        this.errorMsg = err.error?.userMessage || 'No se pudieron cargar las reservas.';
      }
    });
  }

  onFilterChange(): void {
    this.loadSalas();
  }

  applyCapacidadFilter(): void {
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

  ngOnDestroy(): void {
    if (this.successTimer) clearTimeout(this.successTimer);
  }
}
