import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ElementosService } from '../../services/elemento.service';
import { CategoriaElementoService } from '../../services/categoria-elemento.service';
import { CategoriaElemento } from '../../models/categoria-elemento.model';
import { UnifiedNavbarComponent } from '../../nav-bar/unified-navbar.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-elemento-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    UnifiedNavbarComponent,
    MatIcon
  ],
  templateUrl: './elemento-form.component.html',
  styleUrls: ['./elemento-form.component.scss']
})
export class ElementoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private elementosService = inject(ElementosService);
  private categoriasService = inject(CategoriaElementoService);

  form!: FormGroup;
  categorias: CategoriaElemento[] = [];
  editing = false;
  elementoId?: number;

  ngOnInit(): void {
    // Inicializar form
    this.form = this.fb.group({
      codigoQr: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: [''],
      idCategoria: [null, Validators.required],
      stockTotal: [0, [Validators.required, Validators.min(1)]]
    });

    // Cargar categorías
    this.categoriasService.getAll().subscribe(cats => this.categorias = cats);

    // Detectar si estamos editando
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editing = true;
        this.elementoId = +id;
        this.elementosService.getById(+id).subscribe(elem => {
          this.form.patchValue({
            codigoQr: elem.codigoQr,
            nombre: elem.nombre,
            descripcion: elem.descripcion,
            idCategoria: elem.idCategoria,
            stockTotal: elem.stockTotal
          });
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const payload = this.form.value;
    if (this.editing && this.elementoId) {
      this.elementosService.update(this.elementoId, payload).subscribe(() => {
        this.router.navigate(['/admin/elementos']);
      });
    } else {
      this.elementosService.create(payload).subscribe(() => {
        this.router.navigate(['/admin/elementos']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/elementos']);
  }
}