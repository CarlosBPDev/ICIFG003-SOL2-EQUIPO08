import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HorarioDisponibleResponseDTO } from '../models';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private apiUrl = '/api/horarios';

  constructor(private http: HttpClient, private logger: LoggerService) {}

  getHorarios(salaId: number): Observable<HorarioDisponibleResponseDTO[]> {
    this.logger.info('Obteniendo horarios para sala ID: {}', salaId);
    let params = new HttpParams().set('salaId', salaId.toString());
    return this.http.get<HorarioDisponibleResponseDTO[]>(this.apiUrl, { params });
  }
}
