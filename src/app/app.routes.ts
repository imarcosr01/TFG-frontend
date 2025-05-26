// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

// Componentes de Autenticación
import { LoginComponent } from './components/login/login.component';

// Componentes Profesor
import { HomeProfesorComponent } from './components/home-profesor/home-profesor.component';
import { ConsultarHorarioComponent } from './components/consultar-horario/consultar-horario.component';
import { ListarGruposComponent } from './components/grupos-trabajo/listar-grupo/listar-grupo.component';
import { CrearGrupoComponent } from './components/grupos-trabajo/crear-grupo/crear-grupo.component';
import { ElementoListComponent } from './components/elementos.component/elemento-list/elemento-list.component';
import { ListarPrestamosComponent } from './components/prestar-elementos/listar-prestamos/listar-prestamos.component';
import { PrestamoFormComponent } from './components/prestar-elementos/prestamo-form/prestamo-form.component';
import { IncidenciaListComponent } from './components/incidencias/incidencia-list/incidencia-list.component';
import { IncidenciaFormComponent } from './components/incidencias/incidencia-form/incidencia-form.component';


// Componentes Administrador
import { AdminPanelComponent }       from './admin/admin-panel.component';
import { ImportarUsuariosComponent } from './admin/importar-usuario/importar-usuarios.component';

import { CategoriaListComponent }    from './admin/categoria-list/categoria-list.component';
import { CategoriaFormComponent }    from './admin/categoria-form/categoria-form.component';
import { CrearHorarioComponent }     from './admin/crear-horario/crear-horario.component';
import { QrPrestamoComponent }       from './components/prestar-elementos/qr-prestamo/qr-prestamo.component';
import { ElementoFormComponent }     from './admin/elemento-form/elemento-form.component';



export const routes: Routes = [
  // --- Autenticación ---
  { path: 'login', component: LoginComponent },

  // --- Profesor ---
  {
    path: '',
    component: HomeProfesorComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['profesor'] },
    pathMatch: 'full'
  },
  {
    path: 'horarios',
    component: ConsultarHorarioComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['profesor'] }
  },
  {
    path: 'grupos-trabajo/listar',
    component: ListarGruposComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['profesor'] }
  },
  {
    path: 'grupos-trabajo/crear',
    component: CrearGrupoComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['profesor'] }
  },
  {
    path: 'elementos',
    component: ElementoListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['profesor'] }
  },
 {
  path: 'prestamos',
  component: ListarPrestamosComponent,
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['profesor'] }
},
{
  path: 'prestamos/nuevo',
  component: PrestamoFormComponent,
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['profesor'] }
},
{ path: 'prestamos/:id/editar', 
  component: PrestamoFormComponent, 
  canActivate: [AuthGuard, RoleGuard], 
  data: { roles: ['profesor'] } },
{
  path: 'prestar-elementos/qr',
  component: QrPrestamoComponent,
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['profesor'] }
},
 {
    path: 'incidencias',
    component: IncidenciaListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['profesor'] }
  },
  {
    path: 'incidencias/nuevo',
    component: IncidenciaFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['profesor'] }
  },
  {
    path: 'incidencias/:id/editar',
    component: IncidenciaFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['profesor'] }
  },

{
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] },
    pathMatch: 'full'
  },
 {
    path: 'admin/elementos',
    component: ElementoListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'admin/elementos/nuevo',
    component: ElementoFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'admin/elementos/:id/editar',
    component: ElementoFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'admin/categorias',
    component: CategoriaListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'admin/categorias/nuevo',
    component: CategoriaFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'admin/categorias/:id/editar',
    component: CategoriaFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'admin/importar-usuarios',
    component: ImportarUsuariosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] }
  },
 

  // --- Horarios de Taller (CRUD Admin) ---
  {
    path: 'admin/horarios',
    component: ConsultarHorarioComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'admin/horarios/nuevo',
    component: CrearHorarioComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'admin/horarios/:id/editar',
    component: CrearHorarioComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] }
  },

  // --- Fallback ---
  { path: '**', redirectTo: 'login' }
];
