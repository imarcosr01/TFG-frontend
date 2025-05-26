// src/app/components/grupos-trabajo/crear-grupo/crear-grupo.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { GruposTrabajoService } from '../../../services/grupos-trabajo.service';
import { AuthService } from '../../../services/auth.service';
import { Alumno } from '../../../models/alumno.model';
import { FormsModule } from '@angular/forms';
import { UnifiedNavbarComponent } from '../../../nav-bar/unified-navbar.component';

@Component({
  selector: 'app-crear-grupo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    FormsModule,
    UnifiedNavbarComponent
  ],
  templateUrl: './crear-grupo.component.html',
  styleUrls: ['./crear-grupo.component.scss']
})
export class CrearGrupoComponent implements OnInit {
  grupoForm: FormGroup;
  clases: any[] = [];
  alumnos: Alumno[] = [];
  filtroAlumnos: string = '';

  constructor(
    private fb: FormBuilder,
    private gruposService: GruposTrabajoService,
    private authService: AuthService,
    public router: Router
  ) {
    this.grupoForm = this.fb.group({
      nombre: ['', Validators.required],
      idClase: [null, Validators.required],
      alumnos: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    // Cargar clases desde el backend
    this.gruposService.getClases().subscribe({
      next: clases => this.clases = clases,
      error: err => console.error('Error al cargar clases', err)
    });

    // Cuando cambie la clase seleccionada, cargar alumnos de esa clase
    this.grupoForm.get('idClase')!.valueChanges.subscribe(idClase => {
      if (idClase) {
        this.gruposService.getAlumnosPorClase(idClase).subscribe({
          next: alumnos => this.alumnos = alumnos,
          error: err => console.error('Error al cargar alumnos', err)
        });
        // Resetear selección de alumnos
        this.grupoForm.get('alumnos')!.setValue([]);
      } else {
        this.alumnos = [];
      }
    });
  }

  // Método para filtrar alumnos basado en el texto de búsqueda
  get alumnosFiltrados(): Alumno[] {
    if (!this.filtroAlumnos.trim()) {
      return this.alumnos;
    }
    
    const filtro = this.filtroAlumnos.toLowerCase().trim();
    return this.alumnos.filter(alumno => 
      alumno.nombre.toLowerCase().includes(filtro) ||
      alumno.apellido.toLowerCase().includes(filtro) ||
      `${alumno.nombre} ${alumno.apellido}`.toLowerCase().includes(filtro) ||
      `${alumno.apellido} ${alumno.nombre}`.toLowerCase().includes(filtro)
    );
  }

  // Añade este método a tu clase CrearGrupoComponent
  getAlumnoNombre(idAlumno: number): string {
    const alumno = this.alumnos.find(a => a.id_alumno === idAlumno);
    return alumno ? `${alumno.apellido}, ${alumno.nombre}` : 'Alumno desconocido';
  }

  removeAlumno(idAlumno: number): void {
    const alumnos = this.grupoForm.get('alumnos')?.value as number[];
    this.grupoForm.get('alumnos')?.setValue(alumnos.filter(id => id !== idAlumno));
  }

  onSubmit(): void {
    if (this.grupoForm.invalid) return;

    // 1. Miras el usuario que tienes guardado
    const user = this.authService.getUser();
    console.log('Usuario autenticado:', user);

    // 2. Lees del formulario
    const nombre = this.grupoForm.value.nombre;
    const idClase = this.grupoForm.value.idClase;
    const alumnos = this.grupoForm.value.alumnos;

    console.log('Nombre del grupo:', nombre);
    console.log('ID de la clase:', idClase);
    console.log('IDs de alumnos:', alumnos);

    // 3. Construyes el payload
    if (typeof user?.id !== 'number') {
      alert('No se ha encontrado el ID del profesor autenticado.');
      return;
    }
    const payload = {
      nombre,
      id_clase: idClase,
      id_profesor: user.id, // garantizado como number
      alumnos
    };
    console.log('Payload completo a enviar:', payload);
    this.gruposService.crearGrupo(payload).subscribe({
      next: response => {
        console.log('✅ Grupo creado:', response);
        this.router.navigate(['/grupos-trabajo/listar']);
      },
      error: err => {
        console.error('❌ Error al crear grupo:', err);
        alert(err.error?.mensaje || 'Error al crear grupo');
      }
    });
  }

  toggleStudent(idAlumno: number): void {
    const alumnosSeleccionados = this.grupoForm.get('alumnos')?.value as number[] || [];
    
    if (alumnosSeleccionados.includes(idAlumno)) {
      // Si ya está seleccionado, lo removemos
      const nuevosAlumnos = alumnosSeleccionados.filter(id => id !== idAlumno);
      this.grupoForm.get('alumnos')?.setValue(nuevosAlumnos);
    } else {
      // Si no está seleccionado, lo agregamos
      const nuevosAlumnos = [...alumnosSeleccionados, idAlumno];
      this.grupoForm.get('alumnos')?.setValue(nuevosAlumnos);
    }

    // Marcar el campo como tocado para mostrar validaciones
    this.grupoForm.get('alumnos')?.markAsTouched();
  }
}