// src/app/components/incidencias/incidencia-form/incidencia-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }     from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule }      from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule }    from '@angular/material/select';
import { MatInputModule }     from '@angular/material/input';
import { MatButtonModule }    from '@angular/material/button';
import { MatSnackBar }        from '@angular/material/snack-bar';
import { IncidenciaService }  from '../../../services/incidencia.service';
import { Incidencia, IncidenciaCreate } from '../../../models/incidencia.model';
import { ElementosService }   from '../../../services/elemento.service';
import { ClasesService }      from '../../../services/clases.service';
import { AuthService }        from '../../../services/auth.service';
import { UnifiedNavbarComponent } from '../../../nav-bar/unified-navbar.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-incidencia-form',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatButtonModule,
    UnifiedNavbarComponent,
    MatIcon, 
  ],
  templateUrl: './incidencia-form.component.html',
  styleUrls: ['./incidencia-form.component.scss']
})
export class IncidenciaFormComponent implements OnInit {
  private fb    = inject(FormBuilder);
  private svc   = inject(IncidenciaService);
  private elemSvc = inject(ElementosService);
  private claseSvc= inject(ClasesService);
  private auth  = inject(AuthService);
  public router= inject(Router);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);

  form = this.fb.group({
    descripcion: ['', Validators.required],
    id_elemento: [null as number | null, Validators.required],
    id_clase:    [null as number | null, Validators.required]
  });

  elementos: { id_elemento: number; nombre: string }[] = [];
  clases: { id_clase: number; nombre: string }[] = [];
  editingId?: number;

  ngOnInit() {
    // cargar listas desplegables
    this.elemSvc.getAll().subscribe(e => this.elementos = e.map(x=>({ id_elemento: x.id, nombre: x.nombre })));
    this.claseSvc.getClases().subscribe(c=> this.clases = c);

    // si vengo con :id, cargo para editar
    this.editingId = Number(this.route.snapshot.params['id']);
    if (this.editingId) {
      this.svc.get(this.editingId).subscribe(i => {
        this.form.patchValue({
          descripcion: i.descripcion,
          id_elemento: i.id_elemento,
          id_clase:    i.id_clase
        });
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    const payload: IncidenciaCreate = {
      descripcion: this.form.value.descripcion!,
      id_profesor: this.auth.getUser()!.id,
      id_elemento: this.form.value.id_elemento!,
      id_clase:    this.form.value.id_clase!
    };

    const obs = this.editingId
      ? this.svc.update(this.editingId, payload)
      : this.svc.create(payload);

    obs.subscribe(() => {
      this.snack.open('Guardado', 'Cerrar', { duration: 2000 });
      this.router.navigateByUrl('/incidencias');
    });
  }
}
