import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CategoriaElemento } from '../models/categoria-elemento.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaElementoService {
  private endpoint = 'categorias';
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // --- Manejo de errores ---
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error al procesar la categoría';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error.status}, Mensaje: ${error.error.message || error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  // --- Métodos CRUD ---
  getAll(): Observable<CategoriaElemento[]> {
    return this.http.get<CategoriaElemento[]>(`${this.apiUrl}/${this.endpoint}`)
      .pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<CategoriaElemento> {
    return this.http.get<CategoriaElemento>(`${this.apiUrl}/${this.endpoint}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(categoria: Partial<CategoriaElemento>): Observable<CategoriaElemento> {
    return this.http.post<CategoriaElemento>(`${this.apiUrl}/${this.endpoint}`, categoria)
      .pipe(catchError(this.handleError));
  }

  update(id: number, categoria: Partial<CategoriaElemento>): Observable<CategoriaElemento> {
    return this.http.put<CategoriaElemento>(`${this.apiUrl}/${this.endpoint}/${id}`, categoria)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.endpoint}/${id}`)
      .pipe(catchError(this.handleError));
  }
}