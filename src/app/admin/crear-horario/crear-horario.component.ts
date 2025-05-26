// src/app/admin/crear-horario/crear-horario.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder, FormGroup, ReactiveFormsModule, Validators
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HorarioTallerService } from '../../services/horario-taller.service';
import { UnifiedNavbarComponent } from '../../nav-bar/unified-navbar.component';

@Component({
  selector: 'app-crear-horario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    UnifiedNavbarComponent
 
  ],
  templateUrl: './crear-horario.component.html',
  styleUrls: ['./crear-horario.component.scss']
})
export class CrearHorarioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private horarioService = inject(HorarioTallerService);

  dias = ['Lunes','Martes','Miércoles','Jueves','Viernes'] as const;

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      dia_semana: [null, Validators.required],
      hora_inicio: [null, Validators.required]
      
    });
  }

  ngOnInit(): void {}

  cancelar(): void {
    this.router.navigate(['/admin/horarios']);
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { dia_semana, hora_inicio } = this.form.value;
    // Cast seguro porque el select solo da literales válidos
    const payload = {
      dia_semana: dia_semana as typeof this.dias[number],
      hora_inicio
    };

    this.horarioService.create(payload).subscribe({
      next: () => this.router.navigate(['/admin/horarios']),
      error: err => alert('Error al crear horario: ' + err.message)
    });
  }
}
