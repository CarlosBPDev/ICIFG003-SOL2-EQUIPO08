import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstudianteService } from '../../../services/estudiante.service';
import { EstudianteResponseDTO } from '../../../models';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="estudiantes-container">
      <header class="estudiantes-header">
        <div class="header-overlay"></div>
        <div class="header-content">
          <h1>Estudiantes</h1>
          <p>Busca y consulta estudiantes registrados en el sistema</p>
        </div>
      </header>

      <main class="estudiantes-main">
        <section class="search-card">
          <h2>Buscar Estudiante</h2>
          <div class="search-form">
            <div class="input-group">
              <label for="searchTerm">RUT, nombre o apellido</label>
              <input
                id="searchTerm"
                type="text"
                placeholder="Ej: Juan Pérez o 11111111-1"
                [(ngModel)]="searchTerm"
                (keyup.enter)="buscar()"
              >
            </div>
            <button class="btn-search" (click)="buscar()" [disabled]="!searchTerm.trim()">
              Buscar
            </button>
          </div>
        </section>

        <section class="results-section" *ngIf="busquedaRealizada">
          <div class="section-header">
            <h3>Resultados ({{ estudiantes.length }})</h3>
            <div *ngIf="loading" class="spinner"></div>
          </div>

          <div class="table-wrapper" *ngIf="estudiantes.length > 0; else noResults">
            <table class="students-table">
              <thead>
                <tr>
                  <th>RUT</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Carrera</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let est of estudiantes">
                  <td>{{ est.rut }}</td>
                  <td>{{ est.nombre }}</td>
                  <td>{{ est.apellido }}</td>
                  <td>{{ est.correo }}</td>
                  <td>{{ est.telefono || '-' }}</td>
                  <td>{{ est.carrera?.nombreCarrera || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <ng-template #noResults>
            <div class="empty-state">
              <p>No se encontraron estudiantes con ese criterio de búsqueda.</p>
            </div>
          </ng-template>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .estudiantes-container {
      min-height: calc(100vh - 65px);
    }
    .estudiantes-header {
      position: relative;
      padding: 3rem 2rem;
      text-align: center;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .header-content {
      position: relative;
      z-index: 1;
    }
    .header-content h1 {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .header-content p {
      color: #94a3b8;
      font-size: 1rem;
    }
    .estudiantes-main {
      max-width: 960px;
      margin: 2rem auto;
      padding: 0 1.5rem;
    }
    .search-card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    .search-card h2 {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #e2e8f0;
    }
    .search-form {
      display: flex;
      gap: 0.75rem;
      align-items: flex-end;
    }
    .input-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .input-group label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .input-group input {
      padding: 0.7rem 1rem;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 0.75rem;
      color: #fff;
      outline: none;
      font-size: 0.95rem;
    }
    .input-group input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
    }
    .btn-search {
      padding: 0.7rem 1.5rem;
      border-radius: 0.75rem;
      border: none;
      font-weight: 600;
      cursor: pointer;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #fff;
      white-space: nowrap;
      transition: all 0.25s ease;
    }
    .btn-search:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(99,102,241,0.3);
    }
    .btn-search:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    .results-section {
      margin-top: 1.5rem;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .section-header h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #e2e8f0;
    }
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(99,102,241,0.3);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .table-wrapper {
      overflow-x: auto;
      border-radius: 0.75rem;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .students-table {
      width: 100%;
      border-collapse: collapse;
    }
    .students-table th {
      background: rgba(15, 23, 42, 0.8);
      padding: 0.75rem 1rem;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .students-table td {
      padding: 0.75rem 1rem;
      color: #e2e8f0;
      font-size: 0.9rem;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .students-table tbody tr:hover {
      background: rgba(99, 102, 241, 0.05);
    }
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #64748b;
      background: rgba(30, 41, 59, 0.5);
      border-radius: 0.75rem;
      border: 1px solid rgba(255,255,255,0.05);
    }
  `]
})
export class EstudiantesComponent {
  searchTerm = '';
  estudiantes: EstudianteResponseDTO[] = [];
  loading = false;
  busquedaRealizada = false;

  constructor(private estudianteService: EstudianteService) {}

  buscar(): void {
    const termino = this.searchTerm.trim();
    if (!termino) return;

    this.loading = true;
    this.busquedaRealizada = true;

    const query: { rut?: string; nombre?: string; apellido?: string } = {};
    if (/^[0-9]+-[0-9kK]{1}$/.test(termino)) {
      query.rut = termino;
    } else {
      const partes = termino.split(' ');
      query.nombre = partes[0];
      query.apellido = partes.slice(1).join(' ') || '';
    }

    this.estudianteService.buscarEstudiante(query).subscribe({
      next: (data) => {
        this.estudiantes = data;
        this.loading = false;
      },
      error: () => {
        this.estudiantes = [];
        this.loading = false;
      }
    });
  }
}
