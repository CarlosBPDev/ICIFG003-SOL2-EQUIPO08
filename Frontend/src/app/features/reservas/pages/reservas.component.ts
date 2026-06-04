import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalaService } from '../../../services/sala.service';
import { ReservaService } from '../../../services/reserva.service';
import { SalaResponseDTO, ReservaResponseDTO } from '../../../models';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(
    private salaService: SalaService,
    private reservaService: ReservaService
  ) {}

  ngOnInit(): void {
    this.loadSalas();
  }

  loadSalas(): void {
    this.salaService.getSalas().subscribe({
      next: (data) => {
        this.salas = data;
      },
      error: (err) => {
        console.error('Error al cargar salas:', err);
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

    this.loading = true;
    this.reservaService.getReservas(this.selectedSalaId, this.selectedFecha).subscribe({
      next: (data) => {
        this.reservas = data;
        this.totalReservasDelDia = data.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        this.loading = false;
      }
    });
  }
}
