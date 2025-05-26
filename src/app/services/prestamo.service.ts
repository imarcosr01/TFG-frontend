import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Prestamo,
  PrestamoCreatePayload,PrestamoUpdatePayload
} from '../models/prestamo.model';

@Injectable({ providedIn: 'root' })
export class PrestamoService {
  private base = `${environment.apiBaseUrl}/prestamos`;

  constructor(private http: HttpClient) {}

  /** List all or filter by devuelto */
  list(devuelto?: boolean): Observable<Prestamo[]> {
    let params = new HttpParams();
    if (devuelto !== undefined) {
      params = params.set('devuelto', String(devuelto));
    }
    return this.http.get<Prestamo[]>(this.base, { params });
  }

  getById(id: number): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${this.base}/${id}`);
  }

  create(payload: PrestamoCreatePayload): Observable<Prestamo> {
    return this.http.post<Prestamo>(this.base, payload);
  }
 update(id: number, payload: PrestamoUpdatePayload) {
    return this.http.put<Prestamo>(`${this.base}/${id}`, payload);
  }

  markReturned(id: number) {
  return this.http.patch(`${this.base}/${id}/return`, {}); // ✅ Usa la URL base
}
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
