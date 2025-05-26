// src/app/services/grupos-trabajo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GrupoTrabajoCreate, GrupoTrabajoView } from '../models/grupo-trabajo.model';
import { Alumno } from '../models/alumno.model';

@Injectable({ providedIn: 'root' })
export class GruposTrabajoService {
  private apiUrl = `${environment.apiBaseUrl}/grupos-trabajo`; // Aseguramos ruta correcta

  constructor(private http: HttpClient) {}

  // Obtener todas las clases
  getClases(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/clases`);
  }

  // Obtener alumnos de una clase específica
  getAlumnosPorClase(idClase: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(`${environment.apiBaseUrl}/alumnos/clase/${idClase}`);
  }

  // Crear nuevo grupo de trabajo
  crearGrupo(grupo: GrupoTrabajoCreate): Observable<GrupoTrabajoView> {
    return this.http.post<GrupoTrabajoView>(
      this.apiUrl,
      grupo
    );
  }

  // Listar grupos por profesor
  //getGruposPorProfesor(id: number): Observable<GrupoTrabajoView[]> {
 // return this.http.get<GrupoTrabajoView[]>(`${environment.apiUrl}/grupos-trabajo/profesor/${id}`);
//}
getGruposPorProfesor(id: number): Observable<GrupoTrabajoView[]> {
    return this.http.get<GrupoTrabajoView[]>(
      `${this.apiUrl}/profesor/${id}` // ✅ URL correcta
    );
  }
  // Eliminar grupo
  eliminarGrupo(idGrupo: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idGrupo}`);
  }

  // Obtener alumnos de un grupo
  getAlumnosGrupo(idGrupo: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(`${this.apiUrl}/${idGrupo}/alumnos`);
  }

  // Asignar alumnos
  asignarAlumnos(idGrupo: number, alumnos: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${idGrupo}/alumnos`, { alumnos });
  }
}
