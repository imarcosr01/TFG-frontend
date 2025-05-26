// src/app/models/horario-taller.model.ts
export interface HorarioTaller {
  id_horario: number;
  dia_semana: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';
  hora_inicio: string;  // 'HH:MM:SS'
  hora_fin: string;     // generado en backend
  created_at?: string;
}
