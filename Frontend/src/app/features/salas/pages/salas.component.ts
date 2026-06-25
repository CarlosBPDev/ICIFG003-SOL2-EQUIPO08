import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SalaService } from '../../../services/sala.service';
import { ReservaService } from '../../../services/reserva.service';
import { HorarioService } from '../../../services/horario.service';
import { SalaCardComponent } from '../../../shared/components/sala-card/sala-card.component';
import { LoggerService } from '../../../services/logger.service';
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
    private router: Router,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.logger.info('Componente de salas inicializado');
    this.loadSalas();
  }

  loadSalas(): void {
    this.loading = true;
    this.logger.info('Cargando salas con filtro de capacidad: {}, fecha: {}', this.capacidadFilter, this.fechaFilter);

    // Determine capacity range params based on filter
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
      // Use the availability endpoint when a date is selected
      this.salaService.getSalasDisponibles(this.fechaFilter).subscribe({
        next: (data) => {
          this.salas = data;
          this.loadHorarios();
          this.applyCapacidadFilter();
          this.loadReservationsForDate();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar salas disponibles:', err);
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
        },
        error: (err) => {
          console.error('Error al cargar salas:', err);
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
    this.logger.info('Navegando a formulario de reserva para sala ID: {}', salaId);
    this.router.navigate(['/reservas/nueva'], { queryParams: { salaId } });
  }
}
