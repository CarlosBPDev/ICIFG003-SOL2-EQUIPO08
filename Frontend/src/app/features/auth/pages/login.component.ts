import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <h2>Bienvenido</h2>
        <p class="subtitle">Inicia sesión en tu cuenta para gestionar reservas</p>
        
        <form class="login-form" (submit)="$event.preventDefault()">
          <div class="input-group">
            <label>Correo Electrónico</label>
            <input type="email" placeholder="nombre@correo.com">
          </div>
          
          <div class="input-group">
            <label>Contraseña</label>
            <input type="password" placeholder="••••••••">
          </div>
          
          <button type="submit" class="btn-primary">Ingresar</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 65px);
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
  `]
})
export class LoginComponent {}
