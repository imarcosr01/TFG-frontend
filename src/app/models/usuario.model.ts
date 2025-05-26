export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'profesor' | 'administrador';
  created_at?: Date;
}
