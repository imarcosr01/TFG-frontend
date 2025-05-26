import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clase } from '../models/clase.model';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  private baseUrl = 'http://localhost:3000/api'; // Cambia esto si usas otra URL base

  constructor(private http: HttpClient) {}

  getClases(): Observable<Clase[]> {
    return this.http.get<Clase[]>(`${this.baseUrl}/clases`);
  }
}
