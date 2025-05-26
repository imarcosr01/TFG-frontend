import { Clase } from "./clase.model";

export interface Alumno {
  id_alumno: number;
  numero_identificacion: string;
  nombre: string;
  apellido: string;
  id_clase?: number;
  clase?: Clase;
}
