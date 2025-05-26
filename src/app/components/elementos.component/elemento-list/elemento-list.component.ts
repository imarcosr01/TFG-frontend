import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ElementosService } from '../../../services/elemento.service';
import { AuthService } from '../../../services/auth.service';
import { Elemento } from '../../../models/elemento.model';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { UnifiedNavbarComponent } from '../../../nav-bar/unified-navbar.component';






@Component({
  selector: 'app-elemento-list',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatTableModule,
    MatBadgeModule,
    MatChipsModule,
    UnifiedNavbarComponent
    
  ],
  templateUrl: './elemento-list.component.html',
  styleUrls: ['./elemento-list.component.scss'],
})
export class ElementoListComponent implements OnInit {
  private elementosService = inject(ElementosService);
  private authService      = inject(AuthService);
  private router           = inject(Router);
  private dialog           = inject(MatDialog);

  elementos: Elemento[] = [];
  elementosFiltrados: Elemento[] = [];
  categorias: string[] = [];
  searchControl = new FormControl('');
  categoryControl = new FormControl('todas');
  isAdmin = false;

  ngOnInit(): void {
    this.isAdmin = this.authService.getUser()?.rol === 'administrador';
    this.loadElementos();

    // al cambiar buscador o categoría, refiltrar
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.categoryControl.valueChanges.subscribe(() => this.applyFilters());
  }

  private loadElementos(): void {
    this.elementosService.getAll().subscribe({
      next: data => {
        this.elementos = data;
        this.categorias = ['todas', ...new Set(data.map(e => e.categoria?.nombre || 'Sin categoría'))];
        this.applyFilters();
      },
      error: err => console.error('Error cargando elementos', err)
    });
  }

  private applyFilters(): void {
    const term = this.searchControl.value?.toLowerCase() || '';
    const cat  = this.categoryControl.value;
    this.elementosFiltrados = this.elementos.filter(e => {
      const matchesCat = cat === 'todas' || (e.categoria?.nombre === cat);
      const matchesTerm = !term
        || e.nombre.toLowerCase().includes(term)
        || e.codigoQr.toLowerCase().includes(term);
      return matchesCat && matchesTerm;
    });
  }
getStockRing(e: Elemento): string {
  const pct = this.getStockPct(e);
  let color = '';
  
  if (pct < 20) {
    color = '#d32f2f'; // Rojo crítico
  } else if (pct < 50) {
    color = '#f57c00'; // Naranja advertencia
  } else {
    color = '#388e3c'; // Verde bueno
  }

  return `conic-gradient(${color} ${pct}%, #e0e0e0 ${pct}% 100%)`;
}
getStockBadgeClass(e: Elemento): string {
  const pct = this.getStockPct(e);
  if (pct < 20) return 'badge-critical';
  if (pct < 50) return 'badge-warning';
  return 'badge-good';
}

getStockBarClass(e: Elemento): string {
  const pct = this.getStockPct(e);
  if (pct < 20) return 'fill-critical';
  if (pct < 50) return 'fill-warning';
  return 'fill-good';
}

getStockStatusClass(e: Elemento): string {
  const pct = this.getStockPct(e);
  if (pct < 20) return 'status-critical';
  if (pct < 50) return 'status-warning';
  return 'status-good';
}

getStockStatusText(e: Elemento): string {
  const pct = this.getStockPct(e);
  if (pct === 0) return 'Sin stock disponible';
  if (pct < 20) return 'Stock crítico - Reponer urgente';
  if (pct < 50) return 'Stock bajo - Considerar reposición';
  return 'Stock disponible';
}

getStockIcon(e: Elemento): string {
  const pct = this.getStockPct(e);
  if (pct === 0) return 'error';
  if (pct < 20) return 'warning';
  if (pct < 50) return 'info';
  return 'check_circle';
}

  // navegación y acciones
  addElemento(): void { this.router.navigate(['/admin/elementos/nuevo']); }
  editElemento(id: number): void { this.router.navigate([`/admin/elementos/${id}/editar`]); }


  deleteElemento(elem: Elemento): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar elemento', message: `¿Eliminar "${elem.nombre}"?` }
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) this.elementosService.delete(elem.id).subscribe(() => this.loadElementos());
    });
  }

  getStockPct(e: Elemento): number {
    return e.stockTotal ? (e.stockDisponible / e.stockTotal) * 100 : 0;
  }
}
