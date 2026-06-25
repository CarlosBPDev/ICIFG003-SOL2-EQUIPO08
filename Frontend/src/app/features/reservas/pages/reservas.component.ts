import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SalaService } from '../../../services/sala.service';
import { ReservaService } from '../../../services/reserva.service';
import { MensajeComponent } from '../../../shared/components/mensaje/mensaje.component';
import { LoggerService } from '../../../services/logger.service';
import { SalaResponseDTO, ReservaResponseDTO } from '../../../models';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule, MensajeComponent],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  salas: SalaResponseDTO[] = [];
  reservas: ReservaResponseDTO[] = [];

  selectedSalaId: number | null = null;
  selectedFecha: string = '';

  loading: boolean = false;
  totalReservasDelDia: number = 0;
  errorSalasMsg: string | null = null;
  errorReservasMsg: string | null = null;

  constructor(
    private salaService: SalaService,
    private reservaService: ReservaService,
    private route: ActivatedRoute,
    private logger: LoggerService
  ) {}

  get hoy(): string {
    return new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.logger.info('Componente de reservas inicializado');
    this.route.queryParams.subscribe(params => {
      if (params['salaId'] && params['fecha']) {
        this.selectedSalaId = Number(params['salaId']);
        this.selectedFecha = params['fecha'];
        this.logger.info('Parametros de consulta recibidos - salaId: {}, fecha: {}', params['salaId'], params['fecha']);
        this.loadReservas();
      }
    });
    this.loadSalas();
  }

  loadSalas(): void {
    this.errorSalasMsg = null;
    this.logger.info('Cargando lista de salas');
    this.salaService.getSalas().subscribe({
      next: (data) => {
        this.salas = data;
        this.logger.info('Salas cargadas: {}', data.length);
      },
      error: (err) => {
        this.logger.error('Error al cargar salas: {}', err.message);
        this.errorSalasMsg = err.error?.userMessage || 'No se pudieron cargar las salas. Verifica tu conexión.';
      }
    });
  }

  onCriteriaChange(): void {
    if (this.selectedSalaId && this.selectedFecha) {
      this.loadReservas();
    } else {
      this.reservas = [];
      this.totalReservasDelDia = 0;
    }
  }

  loadReservas(): void {
    if (!this.selectedSalaId || !this.selectedFecha) return;

    this.logger.info('Cargando reservas para sala ID: {}, fecha: {}', this.selectedSalaId, this.selectedFecha);
    this.loading = true;
    this.errorReservasMsg = null;
    this.reservaService.getReservas(this.selectedSalaId, this.selectedFecha).subscribe({
      next: (data) => {
        this.reservas = data;
        this.totalReservasDelDia = data.length;
        this.logger.info('Reservas cargadas: {}', data.length);
        this.loading = false;
      },
      error: (err) => {
        this.logger.error('Error al cargar reservas: {}', err.message);
        this.errorReservasMsg = err.error?.userMessage || 'No se pudieron cargar las reservas. Verifica tu conexión.';
        this.loading = false;
      }
    });
  }
}
