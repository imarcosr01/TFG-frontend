// src/app/services/horario-taller.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HorarioTaller } from '../models/horario-taller.model';

@Injectable({ providedIn: 'root' })
export class HorarioTallerService {
  private apiUrl = 'http://localhost:3000/api/horarios';

  constructor(private http: HttpClient) {}

  /** Obtener todos los bloques de horario */
  getAll(): Observable<HorarioTaller[]> {
    return this.http.get<HorarioTaller[]>(this.apiUrl);
  }

  /** Crear un nuevo bloque de horario */
  create(data: {
    dia_semana: HorarioTaller['dia_semana'];
    hora_inicio: string;
  }): Observable<HorarioTaller> {
    return this.http.post<HorarioTaller>(this.apiUrl, data);
  }

  /** Borrar un bloque por ID */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /** Generar horario estándar */
  generarDefault(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/generar-default`, {});
  }

  /** Eliminar TODO el horario */
  eliminarTodo(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar-todos`);
  }
}
