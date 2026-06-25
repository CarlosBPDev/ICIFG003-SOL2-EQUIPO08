import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private apiUrl = 'http://localhost:6789/api/mensajes';

  constructor(private http: HttpClient) { }

  enviarMensaje(mensaje: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, mensaje);
  }
}
