import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservaRequestDTO, ReservaResponseDTO } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = '/api/reservas';

  constructor(private http: HttpClient) {}

  getReservas(salaId?: number, fecha?: string): Observable<ReservaResponseDTO[]> {
    let params = new HttpParams();
    if (salaId != null) {
      params = params.set('salaId', salaId.toString());
    }
    if (fecha != null) {
      params = params.set('fecha', fecha);
    }
    return this.http.get<ReservaResponseDTO[]>(this.apiUrl, { params });
  }

  crearReserva(dto: ReservaRequestDTO): Observable<ReservaResponseDTO> {
    return this.http.post<ReservaResponseDTO>(this.apiUrl, dto);
  }
}
