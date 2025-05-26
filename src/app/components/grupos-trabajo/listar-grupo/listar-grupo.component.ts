import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Angular Material Modules
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Servicios y Modelos
import { GruposTrabajoService } from '../../../services/grupos-trabajo.service';
import { ClasesService } from '../../../services/clases.service';
import { Clase } from '../../../models/clase.model';
import { GrupoTrabajoView } from '../../../models/grupo-trabajo.model';
import { AuthService } from '../../../services/auth.service';
import { UnifiedNavbarComponent } from '../../../nav-bar/unified-navbar.component';


@Component({
  selector: 'app-listar-grupos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    UnifiedNavbarComponent
  ],
  templateUrl: './listar-grupo.component.html',
  styleUrls: ['./listar-grupo.component.scss']
})
export class ListarGruposComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'clase', 'numAlumnos', 'acciones'];
  grupos: GrupoTrabajoView[] = [];
  filteredGrupos: GrupoTrabajoView[] = [];
  clases: Clase[] = [];
  isLoading = false;
  expandedGroup: number | null = null;
  termBusqueda = '';
  claseSeleccionada = '';
  
  // Paginación
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25];
  currentPage = 0;
  totalItems = 0;
  
  idProfesor!: number;

  constructor(
    public router: Router,
    private gruposService: GruposTrabajoService,
    private clasesService: ClasesService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      this.idProfesor = user.id;
      this.cargarClases();
      this.cargarGrupos();
    });
  }

  private cargarClases(): void {
    this.clasesService.getClases().subscribe({
      next: (data) => this.clases = data,
      error: (error) => console.error('Error al cargar clases:', error)
    });
  }

  private cargarGrupos(): void {
    this.isLoading = true;
    this.gruposService.getGruposPorProfesor(this.idProfesor).subscribe({
      next: (data) => {
        // Asignamos directamente los datos y dejamos alumnosGrupo como está
        // (indefinido o con los valores que devuelva la API)
        this.grupos = data;
        this.aplicarFiltros();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar grupos:', error);
        this.isLoading = false;
      }
    });
  }

  aplicarFiltros(): void {
    // Usar la lista completa de grupos para filtrar
    let resultados = [...this.grupos];
    
    // Filtro de búsqueda
    if (this.termBusqueda.trim()) {
      const termino = this.termBusqueda.toLowerCase().trim();
      resultados = resultados.filter(grupo => 
        grupo.nombre.toLowerCase().includes(termino)
      );
    }
    
    // Filtro por clase
    if (this.claseSeleccionada) {
      resultados = resultados.filter(grupo => 
        grupo.clase?.id_clase.toString() === this.claseSeleccionada
      );
    }
    
    this.totalItems = resultados.length;
    
    // Aplicar paginación
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    
    // Importante: mantener las referencias originales a los objetos
    // para que los datos de alumnosGrupo persistan entre filtrados
    this.filteredGrupos = resultados.slice(startIndex, endIndex).map(grupo => {
      // Buscar la referencia original que puede contener datos de alumnos
      const originalGrupo = this.grupos.find(g => g.id_grupo === grupo.id_grupo);
      return originalGrupo || grupo;
    });
    
    console.log('Grupos filtrados:', this.filteredGrupos);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.aplicarFiltros();
  }

  toggleExpansion(idGrupo: number): void {
  console.log('→ toggleExpansion llamado con idGrupo=', idGrupo);

  // Si ya está expandido, colapsamos y salimos
  if (this.expandedGroup === idGrupo) {
    this.expandedGroup = null;
    console.log('← colapsando grupo', idGrupo);
    return;
  }

  // Expandimos
  this.expandedGroup = idGrupo;
  console.log('→ expandiendo grupo', idGrupo);

  // Buscar el grupo original
  const grupo = this.grupos.find(g => g.id_grupo === idGrupo);
  if (!grupo) { return; }

  // Siempre lanzamos la petición al expandir
  console.log('Cargando alumnos para grupo:', idGrupo);
  this.gruposService.getAlumnosGrupo(idGrupo)
    .subscribe({
      next: (alumnos) => {
        console.log('← alumnos recibidos para grupo', idGrupo, alumnos);
        grupo.alumnosGrupo = alumnos;              // asignamos array completo
        this.filteredGrupos = [...this.filteredGrupos]; // forzamos refresco
      },
      error: err => console.error('Error cargando alumnos:', err)
    });
}


  /** Predicate para determinar si una fila debe expandirse */
  isExpanded = (_: number, row: GrupoTrabajoView): boolean => 
    row.id_grupo === this.expandedGroup;

  eliminarGrupo(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este grupo?')) {
      this.gruposService.eliminarGrupo(id).subscribe({
        next: () => {
          this.grupos = this.grupos.filter(g => g.id_grupo !== id);
          this.aplicarFiltros();
        },
        error: (error) => console.error('Error al eliminar grupo:', error)
      });
    }
  }

  getNombreClase(idClase: number): string {
    return this.clases.find(c => c.id_clase === idClase)?.nombre || '';
  }

  // Método para verificar si los alumnos están en proceso de carga
  isLoadingAlumnos(grupo: GrupoTrabajoView): boolean {
    // Los alumnos están cargando si existe alumnosGrupo y es un array vacío
    return Array.isArray(grupo.alumnosGrupo) && grupo.alumnosGrupo.length === 0;
  }
} 