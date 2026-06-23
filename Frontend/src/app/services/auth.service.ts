import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EstudianteResponseDTO, LoginRequestDTO } from '../models';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth/login';
  private currentUserSubject = new BehaviorSubject<EstudianteResponseDTO | null>(null);
  currentUser$: Observable<EstudianteResponseDTO | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private logger: LoggerService) {}

  get currentUser(): EstudianteResponseDTO | null {
    return this.currentUserSubject.value;
  }

  loginWithCredentials(correo: string, password: string): Observable<EstudianteResponseDTO> {
    this.logger.info('Intentando login con correo: {}', correo);
    const body: LoginRequestDTO = { username: correo, password };
    return this.http.post<EstudianteResponseDTO>(this.apiUrl, body).pipe(
      tap(user => {
        this.logger.info('Login exitoso para: {}', correo);
        this.currentUserSubject.next(user);
      })
    );
  }

  login(user: EstudianteResponseDTO): void {
    this.logger.info('Login manual para usuario: {} {}', user.nombre, user.apellido);
    this.currentUserSubject.next(user);
  }

  logout(): void {
    this.logger.info('Cerrando sesion');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
