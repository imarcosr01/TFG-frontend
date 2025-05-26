import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { FormsModule }     from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule }      from '@angular/material/card';
import { MatTableModule }     from '@angular/material/table';
import { MatIconModule }      from '@angular/material/icon';
import { MatButtonModule }    from '@angular/material/button';
import { MatSelectModule }    from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatOptionModule }    from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UnifiedNavbarComponent } from '../../../nav-bar/unified-navbar.component';
import { PrestamoService }  from '../../../services/prestamo.service';
import { Prestamo }         from '../../../models/prestamo.model';

@Component({
  selector: 'app-listar-prestamos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    UnifiedNavbarComponent
  
  ],
  templateUrl: './listar-prestamos.component.html',
  styleUrls: ['./listar-prestamos.component.scss']
})
export class ListarPrestamosComponent implements OnInit {
  private router = inject(Router);
  private svc    = inject(PrestamoService);
  snack = inject(MatSnackBar);

  prestamos: Prestamo[] = [];
  filtro: 'todos' | 'pendientes' | 'devueltos' = 'todos';
  cargando = false;

  ngOnInit() {
    this.load();
  }
load() {
  this.cargando = true;
  let dev: boolean | undefined;  // Declaramos dev con tipo boolean o undefined

  if (this.filtro === 'pendientes') dev = false;
  else if (this.filtro === 'devueltos') dev = true;
  // si filtro es 'todos', dev queda undefined para traer todo

  this.svc.list(dev).subscribe(list => {
    this.prestamos = list.map(p => ({
      ...p,
      id_prestamo: (p as any).id_prestamo ?? (p as any).id // fallback si id_prestamo no existe
    }));
    this.cargando = false;
  });
}



  changeFiltro(f: 'todos' | 'pendientes' | 'devueltos') {
    this.filtro = f;
    this.load();
  }

  toNew() {
    this.router.navigateByUrl('/prestamos/nuevo');
  }

  toEdit(id: number) {
  this.router.navigateByUrl(`/prestamos/${id}/editar`);
}
delete(id: number): void {
  if (!confirm('¿Estás seguro de que deseas eliminar este préstamo?')) return;

  this.svc.delete(id).subscribe({
    next: () => {
      this.snack.open('Préstamo eliminado', 'Cerrar', { duration: 3000 });
      this.load(); // recarga la lista
    },
    error: () => {
      this.snack.open('Error al eliminar el préstamo', 'Cerrar', { duration: 3000 });
    }
  });
}

 markReturned(p: Prestamo) {
  if (!confirm('¿Marcar como devuelto?')) return;

  const id = Number(p.id_prestamo);
  if (isNaN(id)) {
    console.error('ID de préstamo inválido:', p.id_prestamo);
    return;  // no seguimos si el ID no es un número
  }

  this.svc.markReturned(id)
    .subscribe(() => this.load(), err => {
      console.error('Error al marcar como devuelto:', err);
      alert('No se pudo marcar como devuelto. Revisa la consola.');
    });
}
  formatElementos(p: Prestamo): string {
  return p.elementos
    .map(pe => `${pe.elemento.nombre} (${pe.cantidad})`)
    .join(', ');
}
formatDestino(p: Prestamo): string {
  return p.destino || '—';
}

}
