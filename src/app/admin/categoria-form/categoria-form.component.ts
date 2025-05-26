import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CategoriaElementoService } from '../../services/categoria-elemento.service';
import { CategoriaElemento } from '../../models/categoria-elemento.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { UnifiedNavbarComponent } from '../../nav-bar/unified-navbar.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-categoria-form',
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
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.scss']
})
export class CategoriaFormComponent implements OnInit {
  private fb   = inject(FormBuilder);
  private srv  = inject(CategoriaElementoService);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  form!: FormGroup;
  categorias: CategoriaElemento[] = [];
  editing = false;
  id?: number;

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      idPadre: [null]
    });

    this.srv.getAll().subscribe(c => this.categorias = c);

    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.editing = true;
      this.id = +paramId;
      this.srv.getById(this.id).subscribe(cat => {
        this.form.patchValue({ nombre: cat.nombre, idPadre: cat.idPadre || null });
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const data = this.form.value;
    if (this.editing && this.id) {
      this.srv.update(this.id, data).subscribe(() => this.router.navigate(['/admin/categorias']));
    } else {
      this.srv.create(data).subscribe(() => this.router.navigate(['/admin/categorias']));
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/categorias']);
  }
}