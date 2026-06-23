import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalaResponseDTO } from '../models';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class SalaService {
  private apiUrl = '/api/salas';

  constructor(private http: HttpClient, private logger: LoggerService) {}

  getSalas(capacidadMax?: number, capacidadMin?: number, edificioId?: number): Observable<SalaResponseDTO[]> {
    this.logger.info('Obteniendo salas - capacidadMax: {}, capacidadMin: {}, edificioId: {}', capacidadMax, capacidadMin, edificioId);
    let params = new HttpParams();
    if (capacidadMax != null) {
      params = params.set('capacidadMax', capacidadMax.toString());
    }
    if (capacidadMin != null) {
      params = params.set('capacidadMin', capacidadMin.toString());
    }
    if (edificioId != null) {
      params = params.set('edificioId', edificioId.toString());
    }
    return this.http.get<SalaResponseDTO[]>(this.apiUrl, { params });
  }

  getSalasDisponibles(fecha: string): Observable<SalaResponseDTO[]> {
    this.logger.info('Obteniendo salas disponibles para fecha: {}', fecha);
    let params = new HttpParams().set('fecha', fecha);
    return this.http.get<SalaResponseDTO[]>(`${this.apiUrl}/disponibles`, { params });
  }
}
