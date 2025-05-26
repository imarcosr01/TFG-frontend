import { Component, OnInit, inject } from '@angular/core';
import { CategoriaElementoService } from '../../services/categoria-elemento.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { CategoriaElemento } from '../../models/categoria-elemento.model';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { UnifiedNavbarComponent } from '../../nav-bar/unified-navbar.component';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [
    UnifiedNavbarComponent,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './categoria-list.component.html',
  styleUrls: ['./categoria-list.component.scss']
})
export class CategoriaListComponent implements OnInit {
  private catService = inject(CategoriaElementoService);
  private auth       = inject(AuthService);
  private router     = inject(Router);
  private dialog     = inject(MatDialog);

  categorias: CategoriaElemento[] = [];
  categoriasFiltradas: CategoriaElemento[] = [];
  searchControl = new FormControl('');
  parentControl = new FormControl('todas');
  isAdmin = false;
  padres: (string|null)[] = [];

  ngOnInit(): void {
    this.isAdmin = this.auth.getUser()?.rol === 'administrador';
    this.load();
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.parentControl.valueChanges.subscribe(() => this.applyFilters());
  }

  private load(): void {
    this.catService.getAll().subscribe({
      next: data => {
        this.categorias = data;
        // para el dropdown de padres
        this.padres = ['todas', ...new Set(data.map(c => c.padre?.nombre || null))];
        this.applyFilters();
      },
      error: err => console.error('Error cargando categorías', err)
    });
  }

  private applyFilters(): void {
    const term = this.searchControl.value?.toLowerCase() || '';
    const padre = this.parentControl.value;
    this.categoriasFiltradas = this.categorias.filter(c => {
      const matchesName = !term || c.nombre.toLowerCase().includes(term);
      const matchesPadre = padre === 'todas'
        || (padre === null && !c.padre)
        || c.padre?.nombre === padre;
      return matchesName && matchesPadre;
    });
  }

  add(): void {
    this.router.navigate(['/admin/categorias/nuevo']);
  }

  edit(cat: CategoriaElemento): void {
    this.router.navigate([`/admin/categorias/${cat.id}/editar`]);
  }

  delete(cat: CategoriaElemento): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar categoría',
        message: `¿Eliminar '${cat.nombre}' y todas sus subcategorías? Esto no podrá deshacerse.`
      }
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) this.catService.delete(cat.id).subscribe(() => this.load());
    });
  }

  //pa que quede bonito
  getSubcategoryBadgeClass(cat: CategoriaElemento): string {
  const count = cat.hijas?.length || 0;
  if (count === 0) return 'badge-empty';
  if (count <= 2) return 'badge-few';
  return 'badge-many';
}

getSubcategoryIcon(cat: CategoriaElemento): string {
  const count = cat.hijas?.length || 0;
  if (count === 0) return 'folder_off';
  if (count <= 2) return 'folder';
  return 'folder_special';
}

getSubcategoryPct(cat: CategoriaElemento): number {
  const count = cat.hijas?.length || 0;
  const maxCount = Math.max(...this.categorias.map(c => c.hijas?.length || 0), 5);
  return (count / maxCount) * 100;
}

getSubcategoryBarClass(cat: CategoriaElemento): string {
  const count = cat.hijas?.length || 0;
  if (count === 0) return 'fill-empty';
  if (count <= 2) return 'fill-few';
  return 'fill-many';
}

getSubcategoryStatusClass(cat: CategoriaElemento): string {
  const count = cat.hijas?.length || 0;
  if (count === 0) return 'status-empty';
  if (count <= 2) return 'status-few';
  return 'status-many';
}
// Métodos simplificados para categoria-list.component.ts



getSubcategoryCount(cat: CategoriaElemento): string {
  return cat.hijas && cat.hijas.length > 0 ? 'Padre' : 'Hijo';
}

getCategoryTypeClass(cat: CategoriaElemento): string {
  return cat.hijas && cat.hijas.length > 0 ? 'type-parent' : 'type-child';
}

getCategoryTypeIcon(cat: CategoriaElemento): string {
  return cat.hijas && cat.hijas.length > 0 ? 'account_tree' : 'label';
}

getCategoryTypeText(cat: CategoriaElemento): string {
  if (cat.hijas && cat.hijas.length > 0) {
    return `Categoría padre con ${cat.hijas.length} subcategoría${cat.hijas.length === 1 ? '' : 's'}`;
  }
  return 'Categoría individual';
}

getSubcategoryStatusText(cat: CategoriaElemento): string {
  const count = cat.hijas?.length || 0;
  if (count === 0) return 'Sin subcategorías';
  if (count === 1) return 'Pocas subcategorías';
  if (count <= 2) return 'Algunas subcategorías';
  return 'Muchas subcategorías';
}
}
