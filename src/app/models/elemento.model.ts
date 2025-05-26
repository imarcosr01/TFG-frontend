import { CategoriaElemento } from './categoria-elemento.model';

export interface Elemento {
  id: number;
  codigoQr: string;
  nombre: string;
  descripcion?: string;
  stockTotal: number;
  stockDisponible: number;
  idCategoria: number;
  categoria?: CategoriaElemento;
  activo: boolean;
  createdAt?: Date;
}

export interface StockAdjustment {
  delta: number;
  motivo?: string;
}