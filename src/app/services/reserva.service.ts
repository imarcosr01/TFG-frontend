import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:3000/api/reservas';

  constructor(private http: HttpClient) {}

  /** Lista todas las reservas de una fecha */
  listByFecha(fecha: string): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}?fecha=${fecha}`);
  }

  /** Crea una reserva nueva */
 create(data: {
  fecha: string;
  id_horario: number;
  id_profesor: number;
  es_recurrente?: boolean;    // ← añadir aquí
}): Observable<Reserva> {
  return this.http.post<Reserva>(this.apiUrl, data);
}
  /** Borra una reserva existente */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  listByFechaRange(desde: string, hasta: string) {
  return this.http.get<Reserva[]>(
    `${this.apiUrl}?fecha_gte=${desde}&fecha_lte=${hasta}`
  );
}
 getAll(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }
markWeekRecurrentes(fecha: string): Observable<void> {
  // El endpoint recoge fecha como query param
  return this.http.post<void>(
    `${this.apiUrl}/marcar-recurrentes?fecha=${fecha}`,
    {}
  );
}
}
