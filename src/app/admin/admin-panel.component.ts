// src/app/admin/admin-panel.component.ts

import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule }   from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule }   from '@angular/material/icon';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent {
  constructor(private router: Router, private auth: AuthService) {}

  opciones = [
    { ruta: '/admin/elementos',      icono: 'inventory',       etiqueta: 'Gestión de Elementos' },
    { ruta: '/admin/categorias',     icono: 'category',        etiqueta: 'Gestión de Categorías' },
    { ruta: '/admin/importar-usuarios', icono: 'upload',       etiqueta: 'Importar Usuarios' },
    { ruta: '/admin/horarios',       icono: 'schedule',         etiqueta: 'Gestión de Horarios' }
  ];

  go(ruta: string) {
    this.router.navigateByUrl(ruta);
  }
    logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
