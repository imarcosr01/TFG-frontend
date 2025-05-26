import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alumno } from '../models/alumno.model';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {
  private baseUrl = 'http://localhost:3000/api'; // Cambia esto si tu backend tiene otra URL

  constructor(private http: HttpClient) {}

  getAlumnosByClase(idClase: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(`${this.baseUrl}/alumnos/clase/${idClase}`);
  }
}
