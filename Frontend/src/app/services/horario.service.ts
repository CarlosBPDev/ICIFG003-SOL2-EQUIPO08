import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HorarioDisponibleResponseDTO } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private apiUrl = '/api/horarios';

  constructor(private http: HttpClient) {}

  getHorarios(salaId: number): Observable<HorarioDisponibleResponseDTO[]> {
    let params = new HttpParams().set('salaId', salaId.toString());
    return this.http.get<HorarioDisponibleResponseDTO[]>(this.apiUrl, { params });
  }
}
