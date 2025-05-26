import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { HorarioTaller } from '../../models/horario-taller.model';
import { Reserva } from '../../models/reserva.model';
import { HorarioTallerService } from '../../services/horario-taller.service';
import { ReservaService } from '../../services/reserva.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UnifiedNavbarComponent } from '../../nav-bar/unified-navbar.component';
import { addDays,startOfWeek,endOfWeek,  format, parseISO, isBefore,  startOfDay, } from 'date-fns';
import { finalize, map } from 'rxjs/operators';





@Component({
  selector: 'app-consultar-horario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    UnifiedNavbarComponent
   
  ],
  templateUrl: './consultar-horario.component.html',
  styleUrls: ['./consultar-horario.component.scss']
})
export class ConsultarHorarioComponent implements OnInit {
  private auth = inject(AuthService);

  horarios: HorarioTaller[] = [];
  reservas: Reserva[] = [];
  cargando = true;
  isAdmin = this.auth.getUser()?.rol === 'administrador';

  dias: HorarioTaller['dia_semana'][] = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'
  ];
  fechaSeleccionada = this.today();

  constructor(
    private horarioService: HorarioTallerService,
    private reservaService: ReservaService
  ) {}

  ngOnInit(): void {
    this.reloadAll();
  }
  /** Cambia la fecha actual sumando el número de días indicado */
changeDate(days: number) {
  // parseISO trata "YYYY-MM-DD" como fecha en tu zona local
  const current = parseISO(this.fechaSeleccionada);
  // añade (o resta) los días
  const next = addDays(current, days);
  // formatea de vuelta a "YYYY-MM-DD" en local
  this.fechaSeleccionada = format(next, 'yyyy-MM-dd');
  this.reloadAll();
}
getWeekRange(fecha: string): { start: string, end: string } {
  const d = parseISO(fecha);
  // startOfWeek por defecto arranca el domingo; forzamos lunes:
  const weekStart = startOfWeek(d, { weekStartsOn: 1 });
  const weekEnd   = endOfWeek(d,   { weekStartsOn: 1 });
  return {
    start: format(weekStart, 'yyyy-MM-dd'),
    end:   format(weekEnd,   'yyyy-MM-dd'),
  };
}

  /** Carga franjas y reservas para la fecha seleccionada */
reloadAll() {
  this.cargando = true;

  // 1. Calculamos el lunes de la semana actual
  const d = parseISO(this.fechaSeleccionada);
  const weekStart = startOfWeek(d, { weekStartsOn: 1 });

  // 2. Generamos los cinco strings "YYYY-MM-DD" de Lunes a Viernes
  const weekDates = Array.from({ length: 5 }, (_, i) => {
    const dt = addDays(weekStart, i);
    return format(dt, 'yyyy-MM-dd');
  });

  // 3. ForkJoin sobre getAll() y las 5 peticiones a listByFecha()
  forkJoin({
    horarios: this.horarioService.getAll(),
    reservasArrays: forkJoin(
      weekDates.map(fecha => this.reservaService.listByFecha(fecha))
    )
  })
  .pipe(
    // siempre quitamos el spinner, haga lo que haga
    finalize(() => this.cargando = false)
  )
  .subscribe({
    next: ({ horarios, reservasArrays }) => {
      this.horarios = horarios;
      // 4. Aplanamos los 5 arrays en uno
      this.reservas = reservasArrays.flat();
    },
    error: err => {
      console.error('Error cargando datos', err);
      alert('No he podido cargar el horario. Mira la consola.');
    }
  });
}

  /** Filtra franjas por día */
 getHorariosPorDia(dia: HorarioTaller['dia_semana']): HorarioTaller[] {
  const normalizado = this.normalizeDia(dia);
  return this.horarios.filter(h =>
    this.normalizeDia(h.dia_semana) === normalizado
  );
}

private normalizeDia(d: string): string {
  return d.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
}

  /** ¿Esta franja está reservada? */
isReservado(h: HorarioTaller): boolean {
  const fechaFranja = this.getFechaDeFranja(h);
  return this.reservas.some(r =>
    r.id_horario === h.id_horario &&
    r.fecha === fechaFranja
  );
}

  /** ¿Reservó este profesor la franja? */
isMyReserva(h: HorarioTaller): Reserva | undefined {
  const userId = this.auth.getUser()!.id;
  const fechaFranja = this.getFechaDeFranja(h);
  return this.reservas.find(r =>
    r.id_horario === h.id_horario &&
    r.id_profesor === userId &&
    r.fecha === fechaFranja
  );
}
   getReservaPorHorario(h: HorarioTaller): Reserva | undefined {
  return this.reservas.find(r =>
    r.id_horario === h.id_horario &&
    r.fecha === this.getFechaDeFranja(h)
  );
}
 getFechaDeFranja(h: HorarioTaller): string {
  const semana = parseISO(this.fechaSeleccionada);
  const lunes = startOfWeek(semana, { weekStartsOn: 1 });

  const diasNormalizados = this.dias.map(d =>
    d.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
  );
  const diaH = h.dia_semana.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  const indice = diasNormalizados.indexOf(diaH);

  if (indice === -1) {
    console.warn('Día de semana no reconocido:', h.dia_semana);
    return format(lunes, 'yyyy-MM-dd'); // por seguridad
  }

  const fecha = addDays(lunes, indice);
  return format(fecha, 'yyyy-MM-dd');
}
isPastFranja(h: HorarioTaller): boolean {
  const fechaStr = this.getFechaDeFranja(h);         // p.ej. '2025-05-27'
  const hoyStr = this.todayStr();                    // p.ej. '2025-05-23'

  if (fechaStr !== hoyStr) {
    // Si es un día futuro o pasado, sólo bloquear si ya pasó la fecha
    const fecha = new Date(fechaStr);
    const hoy = startOfDay(new Date());
    return fecha < hoy;
  }

  // Si es hoy, comparamos hora también
  const fechaHora = new Date(`${fechaStr}T${h.hora_inicio}`);
  const ahora = new Date();
  return fechaHora < ahora;
}


  /** Toggle: reserva o cancela según estado */
 toggleReserva(h: HorarioTaller): void {
  // 1) Busca la reserva asociada a esta franja
  const reserva = this.getReservaPorHorario(h);
  if (!reserva) {
    // No hay reserva: crear una nueva *normal* (no recurrente)
    const user = this.auth.getUser()!;
    const fechaReal = this.getFechaDeFranja(h);
    this.reservaService.create({
      fecha: fechaReal,
      id_horario: h.id_horario,
      id_profesor: user.id,
      es_recurrente: false   // explícito, aunque el back acepta si no lo pones
    }).subscribe(() => this.reloadAll());
    return;
  }

  // 2) Si la reserva es recurrente, no permitimos cancelarla
  if (reserva.es_recurrente) {
    return;
  }

  // 3) Si ya la tienes tú, la cancelas; si es de otro, no debería llegar aquí
  const myRes = this.isMyReserva(h);
  if (myRes) {
    if (!confirm('¿Cancelar tu reserva?')) return;
    this.reservaService.delete(myRes.id_reserva)
      .subscribe(() => this.reloadAll());
  }
}


  /** Admin: elimina reserva cualquiera */
  borrarReserva(r: Reserva | undefined): void {
    if (!r) return;
    if (!confirm('¿Eliminar esta reserva?')) return;
    this.reservaService.delete(r.id_reserva).subscribe(() => this.reloadAll());
  }
  /**
 * Obtiene el icono de estado para una franja horaria
 */
getStatusIcon(h: HorarioTaller): string {
  if (this.isPastFranja(h)) {
    return 'schedule';
  }
  if (this.isMyReserva(h)) {
    return 'event_available';
  }
  if (this.isReservado(h)) {
    return 'event_busy';
  }
  return 'event_available';
}

/**
 * Obtiene el texto de estado para una franja horaria
 */
getStatusText(h: HorarioTaller): string {
  if (this.isPastFranja(h)) {
    return 'No disponible';
  }
  if (this.isMyReserva(h)) {
    return 'Tu reserva';
  }
  if (this.isReservado(h)) {
    return 'Ocupado';
  }
  return 'Disponible';
}

  /** Admin: elimina bloque de horario */
  borrar(h: HorarioTaller): void {
    if (!confirm('¿Eliminar este bloque de horario?')) return;
    this.horarioService.delete(h.id_horario).subscribe(() => this.reloadAll());
  }

  /** Admin: generar horario por defecto */
  generarHorarioPorDefecto() {
    if (!confirm('¿Estás seguro?')) return;
    this.horarioService.generarDefault().subscribe(() => this.reloadAll());
  }
  marcarRecurrentes(): void {
  if (!confirm('¿Marcar TODAS las reservas de esta semana como recurrentes?')) return;
  this.reservaService.markWeekRecurrentes(this.fechaSeleccionada)
    .subscribe(() => this.reloadAll());
}

  /** Admin: eliminar todo el horario */
  eliminarTodoElHorario() {
    if (!confirm('¿Eliminar TODO el horario?')) return;
    this.horarioService.eliminarTodo().subscribe(() => this.reloadAll());
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
  private todayStr(): string {
  return new Date().toISOString().slice(0,10);
}

}
