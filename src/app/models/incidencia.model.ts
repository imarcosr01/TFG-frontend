export interface Incidencia {
  id_incidencia: number;
  descripcion: string;
  solucionada: boolean;
  id_profesor: number;
  id_elemento: number;
  id_clase: number;
  profesor: { id_usuario: number; nombre: string; apellido: string };
  elemento: { id_elemento: number; nombre: string };
  clase: { id_clase: number; nombre: string };
  created_at: string;
  updated_at: string;
}

export interface IncidenciaCreate {
  descripcion: string;
  id_profesor: number;
  id_elemento: number;
  id_clase: number;
}