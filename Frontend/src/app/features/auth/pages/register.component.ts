import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EstudianteService } from '../../../services/estudiante.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <h2>Crear Cuenta</h2>
        <p class="subtitle">Regístrate para reservar salas de estudio</p>

        <form class="login-form" (submit)="onSubmit()">
          <div class="input-group">
            <label for="correo">Correo Institucional</label>
            <input
              id="correo"
              type="email"
              placeholder="nombre@uni.cl"
              [(ngModel)]="correo"
              name="correo"
              required
              autocomplete="email"
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
              minlength="6"
              autocomplete="new-password"
            >
          </div>

          <p class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</p>
          <p class="success-msg" *ngIf="successMsg">{{ successMsg }}</p>

          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Verificando...' : 'Registrarse' }}
          </button>
        </form>

        <div class="register-link">
          <p>¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión aquí</a></p>
        </div>
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
      color: var(--texto-muted);
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
      color: var(--texto-muted);
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
    .input-group input:focus-visible {
      border-color: #6366f1;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
    .error-msg {
      color: var(--color-error);
      font-size: 0.85rem;
      text-align: center;
      margin: 0;
      background: rgba(239, 68, 68, 0.1);
      padding: 0.5rem;
      border-radius: 0.5rem;
    }
    .success-msg {
      color: var(--color-exito);
      font-size: 0.85rem;
      text-align: center;
      margin: 0;
      background: rgba(34, 197, 94, 0.1);
      padding: 0.5rem;
      border-radius: 0.5rem;
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
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
    }
    .btn-primary:focus-visible {
      outline: 2px solid #6366f1;
      outline-offset: 2px;
    }
    .btn-primary:active:not(:disabled) {
      transform: scale(0.97);
    }
    .btn-primary:disabled {
      background: var(--fondo-disabled);
      color: var(--texto-disabled);
      cursor: not-allowed;
      box-shadow: none;
    }
    .register-link {
      margin-top: 1.5rem;
      font-size: 0.9rem;
      color: var(--texto-muted);
    }
    .register-link a {
      color: #818cf8;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }
    .register-link a:hover {
      color: #a5b4fc;
      text-decoration: underline;
    }
    .register-link a:focus-visible {
      outline: 2px solid #6366f1;
      outline-offset: 2px;
      border-radius: 2px;
    }
  `]
})
export class RegisterComponent {
  correo = '';
  password = '';
  errorMsg = '';
  successMsg = '';
  loading = false;

  constructor(
    private estudianteService: EstudianteService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.correo.trim()) {
      this.errorMsg = 'Ingresa un correo electrónico.';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.correo.trim())) {
      this.errorMsg = 'Ingresa un correo electrónico válido (ej: nombre@correo.com).';
      return;
    }
    if (!this.password || this.password.length < 6) {
      this.errorMsg = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    // Simulate registration by checking if the student exists in the system
    this.estudianteService.buscarEstudiante({ correo: this.correo.trim() }).subscribe({
      next: (data) => {
        const estudiante = data.find(e => e.correo === this.correo.trim());
        if (estudiante) {
          // In a real app we would POST to /api/usuarios to create credentials.
          // Since the API only has /api/estudiantes search, we simulate success.
          this.successMsg = '¡Registro exitoso! Iniciando sesión...';
          setTimeout(() => {
            this.authService.login(estudiante);
            this.router.navigate(['/salas']);
          }, 1500);
        } else {
          this.errorMsg = 'No existe un estudiante registrado con este correo institucional. Contacta a la biblioteca.';
          this.loading = false;
        }
      },
      error: (err) => {
        this.errorMsg = err.error?.userMessage || 'Error al comunicarse con el servidor. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }
}
