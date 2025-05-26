import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Elemento,StockAdjustment } from '../models/elemento.model';

@Injectable({
  providedIn: 'root'
})
export class ElementosService {
  private endpoint = 'elementos';
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // --- Manejo de errores común ---
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error.status}, Mensaje: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  // --- Métodos CRUD ---
  getAll(): Observable<Elemento[]> {
    return this.http.get<Elemento[]>(`${this.apiUrl}/${this.endpoint}`)
      .pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Elemento> {
    return this.http.get<Elemento>(`${this.apiUrl}/${this.endpoint}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(elemento: Partial<Elemento>): Observable<Elemento> {
    return this.http.post<Elemento>(`${this.apiUrl}/${this.endpoint}`, elemento)
      .pipe(catchError(this.handleError));
  }

  update(id: number, elemento: Partial<Elemento>): Observable<Elemento> {
    return this.http.put<Elemento>(`${this.apiUrl}/${this.endpoint}/${id}`, elemento)
      .pipe(catchError(this.handleError));
  }

  adjustStock(id: number, adjustment: StockAdjustment): Observable<Elemento> {
    return this.http.patch<Elemento>(
      `${this.apiUrl}/${this.endpoint}/${id}/stock`, 
      { delta: adjustment.delta }
    ).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.endpoint}/${id}`)
      .pipe(catchError(this.handleError));
  }
  getByQr(codigoQr: string): Observable<Elemento> {
  return this.http.get<Elemento>(`${this.apiUrl}/elementos/qr/${codigoQr}`);
}

}