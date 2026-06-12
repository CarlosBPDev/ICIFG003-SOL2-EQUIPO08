import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EstudianteResponseDTO, LoginRequestDTO } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth/login';
  private currentUserSubject = new BehaviorSubject<EstudianteResponseDTO | null>(null);
  currentUser$: Observable<EstudianteResponseDTO | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): EstudianteResponseDTO | null {
    return this.currentUserSubject.value;
  }

  loginWithCredentials(correo: string, password: string): Observable<EstudianteResponseDTO> {
    const body: LoginRequestDTO = { username: correo, password };
    return this.http.post<EstudianteResponseDTO>(this.apiUrl, body).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  login(user: EstudianteResponseDTO): void {
    this.currentUserSubject.next(user);
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
