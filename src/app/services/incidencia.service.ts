// src/app/services/incidencia.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Incidencia, IncidenciaCreate } from '../models/incidencia.model';

@Injectable({ providedIn: 'root' })
export class IncidenciaService {
  private base = `${environment.apiUrl}/incidencias`;

  constructor(private http: HttpClient) {}

  list(includeSolved = true): Observable<Incidencia[]> {
    let params = new HttpParams().set('solved', String(includeSolved));
    return this.http.get<Incidencia[]>(this.base, { params });
  }

  get(id: number): Observable<Incidencia> {
    return this.http.get<Incidencia>(`${this.base}/${id}`);
  }

  create(payload: IncidenciaCreate): Observable<Incidencia> {
    return this.http.post<Incidencia>(this.base, payload);
  }

  update(id: number, payload: Partial<Incidencia>): Observable<Incidencia> {
    return this.http.put<Incidencia>(`${this.base}/${id}`, payload);
  }

  markSolved(id: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/${id}/solve`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
