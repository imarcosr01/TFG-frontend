export interface Reserva {
  id_reserva: number;
  fecha: string;
  id_horario: number;
  id_profesor: number;
  created_at: string;
  es_recurrente?: boolean;
}
