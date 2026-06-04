import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstudianteResponseDTO } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = '/api/estudiantes/buscar';

  constructor(private http: HttpClient) {}

  buscarEstudiante(query: { rut?: string; nombre?: string; apellido?: string }): Observable<EstudianteResponseDTO[]> {
    let params = new HttpParams();
    if (query.rut) {
      params = params.set('rut', query.rut);
    }
    if (query.nombre) {
      params = params.set('nombre', query.nombre);
    }
    if (query.apellido) {
      params = params.set('apellido', query.apellido);
    }
    return this.http.get<EstudianteResponseDTO[]>(this.apiUrl, { params });
  }
}
