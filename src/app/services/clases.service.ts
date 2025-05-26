import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clase } from '../models/clase.model';
import { environment } from '../../environments/environment'; // Asegúrate de que esta ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  private baseUrl = `${environment.apiBaseUrl}`; // Cambia esto si usas otra URL base

  constructor(private http: HttpClient) {}

  getClases(): Observable<Clase[]> {
    return this.http.get<Clase[]>(`${this.baseUrl}/clases`);
  }
}
