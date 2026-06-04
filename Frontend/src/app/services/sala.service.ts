import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalaResponseDTO } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SalaService {
  private apiUrl = '/api/salas';

  constructor(private http: HttpClient) {}

  getSalas(capacidad?: number, edificioId?: number): Observable<SalaResponseDTO[]> {
    let params = new HttpParams();
    if (capacidad != null) {
      params = params.set('capacidad', capacidad.toString());
    }
    if (edificioId != null) {
      params = params.set('edificioId', edificioId.toString());
    }
    return this.http.get<SalaResponseDTO[]>(this.apiUrl, { params });
  }
}
