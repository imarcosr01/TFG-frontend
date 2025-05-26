// src/app/shared/unified-navbar/unified-navbar.component.ts
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../services/auth.service';
interface NavLink {
  path: string;
  icon: string;
  label: string;
  roles: ('profesor' | 'administrador')[];
}

@Component({
  selector: 'app-unified-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './unified-navbar.component.html',
  styleUrls: ['./unified-navbar.component.scss']
})
export class UnifiedNavbarComponent {
  private auth = inject(AuthService);

  // Definir todos los enlaces con los roles que pueden verlos
  allLinks: NavLink[] = [
    { path: '/', icon: 'home', label: 'Inicio', roles: ['profesor'] },
    { path: '/admin', icon: 'dashboard', label: 'Panel Admin', roles: ['administrador'] },
    { path: '/horarios', icon: 'schedule', label: 'Consultar Horario', roles: ['profesor'] },
    { path: '/admin/horarios', icon: 'schedule', label: 'Gestionar Horarios', roles: ['administrador'] },
    { path: '/grupos-trabajo/listar', icon: 'groups', label: 'Grupos de Trabajo', roles: ['profesor'] },
    { path: '/elementos', icon: 'inventory', label: 'Elementos', roles: ['profesor'] },
    { path: '/admin/elementos', icon: 'inventory', label: 'Gestionar Elementos', roles: ['administrador'] },
    { path: '/admin/categorias', icon: 'category', label: 'Categorías', roles: ['administrador'] },
    { path: '/prestamos', icon: 'assignment', label: 'Préstamos', roles: ['profesor'] },
    { path: '/incidencias', icon: 'report_problem', label: 'Incidencias', roles: ['profesor'] },
    { path: '/admin/importar-usuarios', icon: 'upload', label: 'Importar Usuarios', roles: ['administrador'] }
  ];

  // Obtener enlaces filtrados según el rol del usuario
  get visibleLinks(): NavLink[] {
    const userRole = this.currentUser?.rol;
    if (!userRole) return [];
    
    return this.allLinks.filter(link => link.roles.includes(userRole));
  }

  // Obtener usuario actual
  get currentUser() {
    return this.auth.getUser();
  }

  // Obtener nombre del usuario
  get userName(): string {
    return this.currentUser?.nombre || 'Usuario';
  }

  // Obtener rol formateado para mostrar
  get userRole(): string {
    const role = this.currentUser?.rol;
    return role === 'profesor' ? 'Docente' : 'Administrador';
  }

  // Verificar si es profesor
  get isProfesor(): boolean {
    return this.currentUser?.rol === 'profesor';
  }

  // Verificar si es administrador
  get isAdmin(): boolean {
    return this.currentUser?.rol === 'administrador';
  }

  logout() {
    this.auth.logout();
  }
}