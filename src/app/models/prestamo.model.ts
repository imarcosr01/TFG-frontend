
export interface PrestamoElementoPayload {
  id_elemento: number;
  cantidad: number;
}

export interface PrestamoCreatePayload {
  id_profesor: number;
  id_clase: number;
  id_grupo?: number | null;
  id_alumno?: number | null;
  elementos: PrestamoElementoPayload[];
}

export interface PrestamoElemento {
  id_prestamo: number;
  id_elemento: number;
  cantidad: number;
  elemento: {
    id_elemento: number;
    nombre: string;
    stock_disponible: number;
  };
}
export interface PrestamoUpdatePayload extends Partial<PrestamoCreatePayload> {
  devuelto?: boolean;
}
export interface Prestamo {
  id_prestamo: number;
  destino: string;
  fecha_prestamo: string;      // ISO datetime
  devuelto: boolean;
  profesor: { id_usuario: number; nombre: string; };
  alumno?: { id_alumno: number; nombre: string; apellido: string; };
  grupo?: { id_grupo: number; nombre: string; };
  id_clase: number;
  elementos: PrestamoElemento[];
}
