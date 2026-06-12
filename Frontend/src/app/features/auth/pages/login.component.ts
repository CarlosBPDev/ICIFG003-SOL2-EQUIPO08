import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <img src="assets/logo.png" alt="Logo Biblioteca" class="login-logo">
        <h2>Iniciar Sesión</h2>
        <p class="subtitle">Ingresa tus credenciales para gestionar reservas</p>

        <form class="login-form" (submit)="onSubmit()">
          <div class="mb-3">
            <label for="correo" class="form-label">Correo Electrónico</label>
            <input
              id="correo"
              type="email"
              placeholder="nombre@correo.com"
              [(ngModel)]="correo"
              name="correo"
              required
              class="form-control"
            >
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              [(ngModel)]="password"
              name="password"
              required
              class="form-control"
            >
          </div>

          <p class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</p>

          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>

        <div class="register-link">
          <p>¿No tienes cuenta? <a routerLink="/register">Regístrate aquí</a></p>
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
    .login-logo {
      height: 60px;
      width: auto;
      margin-bottom: 1.5rem;
      border-radius: 0.5rem;
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
    .mb-3 {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .form-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .form-control {
      padding: 0.8rem 1rem;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.75rem;
      color: #ffffff;
      outline: none;
      transition: all 0.25s ease;
      font-size: 0.95rem;
    }
    .form-control:focus {
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
  `]
})
export class LoginComponent {
  correo = '';
  password = '';
  errorMsg = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.correo.trim()) {
      this.errorMsg = 'Ingresa un correo electrónico.';
      return;
    }
    if (!this.password || this.password.length < 4) {
      this.errorMsg = 'La contraseña debe tener al menos 4 caracteres.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.authService.loginWithCredentials(this.correo.trim(), this.password).subscribe({
      next: () => {
        this.router.navigate(['/salas']);
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Correo o contraseña incorrectos.';
        this.loading = false;
      }
    });
  }
}
