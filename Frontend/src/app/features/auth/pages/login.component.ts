import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EstudianteService } from '../../../services/estudiante.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <h2>Bienvenido</h2>
        <p class="subtitle">Ingresa tu correo electrónico para gestionar reservas</p>

        <form class="login-form" (submit)="onSubmit()">
          <div class="input-group">
            <label for="correo">Correo Electrónico</label>
            <input
              id="correo"
              type="email"
              placeholder="nombre@correo.com"
              [(ngModel)]="correo"
              name="correo"
              required
            >
          </div>

          <div class="input-group">
            <label for="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              [(ngModel)]="password"
              name="password"
              required
            >
          </div>

          <p class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</p>

          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Buscando...' : 'Ingresar' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 60%);
      padding: 1.5rem;
    }
    .login-card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 1.25rem;
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      text-align: center;
    }
    h2 {
      font-size: 1.75rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      text-align: left;
    }
    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .input-group label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .input-group input {
      padding: 0.8rem 1rem;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.75rem;
      color: #ffffff;
      outline: none;
      transition: all 0.25s ease;
      font-size: 0.95rem;
    }
    .input-group input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
    .error-msg {
      color: #ef4444;
      font-size: 0.85rem;
      text-align: center;
      margin: 0;
    }
    .btn-primary {
      margin-top: 0.5rem;
      padding: 0.8rem;
      border-radius: 0.75rem;
      border: none;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #ffffff;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
      transition: all 0.25s ease;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  `]
})
export class LoginComponent {
  private static readonly TEST_ACCOUNT = {
    correo: 'test@test.cl',
    password: '1234',
    user: {
      id: 0,
      rut: '0-0',
      nombre: 'Usuario',
      apellido: 'Prueba',
      correo: 'test@test.cl',
      telefono: '900000000',
      fechaRegistro: '2026-01-01T00:00:00',
      carrera: { id: 1, nombreCarrera: 'Ingeniería Informática', facultad: 'Facultad de Ingeniería' }
    }
  };
  correo = '';
  password = '';
  errorMsg = '';
  loading = false;

  constructor(
    private estudianteService: EstudianteService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.correo.trim() || !this.password.trim()) return;

    if (this.correo.trim() === LoginComponent.TEST_ACCOUNT.correo && this.password === LoginComponent.TEST_ACCOUNT.password) {
      this.authService.login(LoginComponent.TEST_ACCOUNT.user as any);
      this.router.navigate(['/salas']);
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.estudianteService.buscarEstudiante({ correo: this.correo.trim() }).subscribe({
      next: (data) => {
        const estudiante = data.find(e => e.correo === this.correo.trim());
        if (estudiante) {
          this.authService.login(estudiante);
          this.router.navigate(['/salas']);
        } else {
          this.errorMsg = 'Estudiante no encontrado con ese correo';
          this.loading = false;
        }
      },
      error: () => {
        this.errorMsg = 'Error al buscar estudiante. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }
}
