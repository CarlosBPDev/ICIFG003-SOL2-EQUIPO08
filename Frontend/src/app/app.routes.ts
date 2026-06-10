import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/pages/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/pages/register.component').then(m => m.RegisterComponent) },
  { path: 'salas', loadComponent: () => import('./features/salas/pages/salas.component').then(m => m.SalasComponent), canActivate: [authGuard] },
  { path: 'reservas/nueva', loadComponent: () => import('./features/reservas/pages/reserva-form.component').then(m => m.ReservaFormComponent), canActivate: [authGuard] },
  { path: 'reservas', loadComponent: () => import('./features/reservas/pages/reservas.component').then(m => m.ReservasComponent), canActivate: [authGuard] },
  { path: 'estudiantes', loadComponent: () => import('./features/estudiantes/pages/estudiantes.component').then(m => m.EstudiantesComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
