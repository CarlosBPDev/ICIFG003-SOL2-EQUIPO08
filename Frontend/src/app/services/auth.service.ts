import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EstudianteResponseDTO } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<EstudianteResponseDTO | null>(null);
  currentUser$: Observable<EstudianteResponseDTO | null> = this.currentUserSubject.asObservable();

  get currentUser(): EstudianteResponseDTO | null {
    return this.currentUserSubject.value;
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
