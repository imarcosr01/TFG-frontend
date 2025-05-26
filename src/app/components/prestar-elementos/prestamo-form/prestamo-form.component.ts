import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }     from '@angular/common';
import { Router, RouterModule }         from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule }         from '@angular/material/card';
import { MatFormFieldModule }    from '@angular/material/form-field';
import { MatSelectModule }       from '@angular/material/select';
import { MatInputModule }        from '@angular/material/input';
import { MatButtonModule }       from '@angular/material/button';
import { MatIconModule }         from '@angular/material/icon';
import { MatTableModule }        from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService }           from '../../../services/auth.service';
import { GruposTrabajoService }  from '../../../services/grupos-trabajo.service';
import { ElementosService } from '../../../services/elemento.service';
import { PrestamoService }       from '../../../services/prestamo.service';
import { GrupoTrabajoView }      from '../../../models/grupo-trabajo.model';
import { Alumno }                from '../../../models/alumno.model';
import { Elemento }              from '../../../models/elemento.model';
import { UnifiedNavbarComponent } from '../../../nav-bar/unified-navbar.component';
import { ActivatedRoute } from '@angular/router';
import { PrestamoCreatePayload } from '../../../models/prestamo.model';


@Component({
  selector: 'app-prestamo-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    UnifiedNavbarComponent
  ],
  templateUrl: './prestamo-form.component.html',
  styleUrls: ['./prestamo-form.component.scss']
})
export class PrestamoFormComponent implements OnInit {
  private fb    = inject(FormBuilder);
  private auth  = inject(AuthService);
  public  router= inject(Router);            // <-- ahora público
  private grpSvc= inject(GruposTrabajoService);
  private elSvc = inject(ElementosService);
  private prSvc = inject(PrestamoService);

  private route = inject(ActivatedRoute);
prestamoId: number | null = null;

form = this.fb.group({
  id_grupo:  [null as number | null, Validators.required],
  id_alumno: [null as number | null],
});
  elementos: Elemento[] = [];
  grupos: GrupoTrabajoView[] = [];
  alumnos: Alumno[] = [];
  qty: number[] = [];
  cargandoAlumnos = false;

ngOnInit() {
  const u = this.auth.getUser()!;
  // Cargamos grupos y elementos
  this.grpSvc.getGruposPorProfesor(u.id).subscribe(g => this.grupos = g);
  this.elSvc.getAll().subscribe(e => {
    this.elementos = e;
    this.qty = e.map(_ => 0);

    // 2.1. Detectamos si hay parámetro “id” en la URL
    this.prestamoId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.prestamoId) {
      // 2.2. Si hay ID, pedimos el préstamo existente
      this.prSvc.getById(this.prestamoId).subscribe(p => {
        // 2.3. Extraemos los campos correctos
        const grupoId  = p.grupo   ? p.grupo.id_grupo   : null;
        const alumnoId = p.alumno  ? p.alumno.id_alumno : null;

        // 2.4. Parcheamos el formulario
        this.form.patchValue({
          id_grupo:  grupoId,
          id_alumno: alumnoId
        });

        // 2.5. Cargamos la lista de alumnos de ese grupo
        if (grupoId) {
          this.onGrupoChange();
          // Si quisieras volver a marcar el alumno tras cargar:
          // this.grpSvc.getAlumnosGrupo(grupoId)
          //   .subscribe(a => { this.alumnos = a; this.form.patchValue({ id_alumno: alumnoId }); });
        }

        // 2.6. Ajustamos cantidades
        this.qty = this.elementos.map(el => {
          const encontrado = p.elementos.find(x => x.id_elemento === el.id);
          return encontrado ? encontrado.cantidad : 0;
        });
      });
    }
  });
}



  onGrupoChange() {
    const id = this.form.value.id_grupo!;
    this.cargandoAlumnos = true;
    this.grpSvc.getAlumnosGrupo(id)
      .subscribe(a => {
        this.alumnos = a;
        this.cargandoAlumnos = false;
      });
    this.form.patchValue({ id_alumno: null });
  }

  onQtyChange(i: number, v: any) {
    const n = parseInt(v,10);
    this.qty[i] = isNaN(n) ? 0 : n;
  }

  submit() {
  if (this.form.invalid) return;

  // 3.1. Datos comunes
  const idGrupo = this.form.value.id_grupo!;
  const grupoSeleccionado = this.grupos.find(g => g.id_grupo === idGrupo)!;
  const idClase = grupoSeleccionado.clase.id_clase;

  // 3.2. Construimos el array de elementos
  const elementos = this.elementos
    .map((el, i) => ({ id_elemento: el.id, cantidad: this.qty[i] }))
    .filter(x => x.cantidad > 0);

  if (elementos.length === 0) {
    alert('Debes pedir al menos un elemento');
    return;
  }

  // 3.3. Payload común
  const payload: PrestamoCreatePayload = {
    id_profesor: this.auth.getUser()!.id,
    id_clase:    idClase,
    id_grupo:    idGrupo,
    id_alumno:   this.form.value.id_alumno ?? null,
    elementos
  };

  // 3.4. Elegimos crear o actualizar
  const accion$ = this.prestamoId
    ? this.prSvc.update(this.prestamoId, payload)
    : this.prSvc.create(payload);

  // 3.5. Al terminar, volvemos al listado
  accion$.subscribe(() => this.router.navigateByUrl('/prestamos'));
}

}