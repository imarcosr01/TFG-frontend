import { Elemento } from "./elemento.model";
export interface CategoriaElemento {
  id: number;
  nombre: string;
  idPadre?: number | null;
  padre?: CategoriaElemento;
  hijas?: CategoriaElemento[];
  elementos?: Elemento[];
  createdAt?: Date;
}