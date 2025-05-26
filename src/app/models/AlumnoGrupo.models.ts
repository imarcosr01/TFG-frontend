import { Alumno } from "./alumno.model";

export interface AlumnoGrupo {
  id_grupo: number;
  id_alumno: number;
  alumno?: Alumno;
}
