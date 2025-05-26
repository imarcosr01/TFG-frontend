
import { Clase } from './clase.model';
import { Alumno } from './alumno.model';

// Modelo para crear grupos
export interface GrupoTrabajoCreate {
  nombre: string;
  id_clase: number;
  id_profesor: number;
  clase?: string; // opcional, ya que puede no estar presente
  alumnos: number[]; // IDs de alumnos
}

// Modelo para visualizar grupos
export interface GrupoTrabajoView {
  id_grupo: number;
  nombre: string;
  clase: Clase;               // ➜ objeto completo
  profesor: any;              // o interfaz Usuario
  alumnosGrupo?: Alumno[] | null; // Puede ser un array de alumnos, null o estar indefinido
}