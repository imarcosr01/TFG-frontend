// src/app/components/incidencias/incidencia-list/incidencia-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { FormsModule }     from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule }  from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule }   from '@angular/material/icon';
import { MatSnackBar }     from '@angular/material/snack-bar';
import { IncidenciaService } from '../../../services/incidencia.service';
import { Incidencia }      from '../../../models/incidencia.model';
import { UnifiedNavbarComponent } from '../../../nav-bar/unified-navbar.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-incidencia-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatTableModule, MatButtonModule, MatIconModule,
    UnifiedNavbarComponent, 
    MatFormFieldModule, MatSelectModule,
    MatCardModule,CommonModule,MatProgressSpinnerModule
    
  ],
  templateUrl: './incidencia-list.component.html',
  styleUrls: ['./incidencia-list.component.scss']
})
export class IncidenciaListComponent implements OnInit {
  private svc = inject(IncidenciaService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  incidencias: Incidencia[] = [];
  filtro: 'todas'|'pendientes'|'resueltas' = 'todas';
  cargando = false;

  ngOnInit() { this.load(); }

  load() {
    this.cargando = true;
    const includeSolved = this.filtro === 'resueltas' ? true
                        : this.filtro === 'pendientes' ? false
                        : true;
    this.svc.list(includeSolved).subscribe(list => {
      this.incidencias = list;
      this.cargando = false;
    });
  }

  changeFiltro(f: 'todas'|'pendientes'|'resueltas') {
    this.filtro = f;
    this.load();
  }

  toNew() {
    this.router.navigateByUrl('/incidencias/nuevo');
  }

  toEdit(id: number) {
    this.router.navigateByUrl(`/incidencias/${id}/editar`);
  }

  markSolved(i: Incidencia) {
    if (!confirm('Marcar como resuelta?')) return;
    this.svc.markSolved(i.id_incidencia).subscribe(() => {
      this.snack.open('Incidencia marcada', 'Cerrar', { duration: 2000 });
      this.load();
    });
  }

  delete(id: number) {
    if (!confirm('Eliminar incidencia?')) return;
    this.svc.delete(id).subscribe(() => this.load());
  }
}
