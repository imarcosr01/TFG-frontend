// src/app/guards/role.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const user = this.auth.getUser();
    const allowedRoles: string[] = route.data['roles'] as string[] || [];

    if (user && allowedRoles.includes(user.rol)) {
      return true;
    }
    // Si el rol no coincide, redirigimos según su rol real
    if (user?.rol === 'administrador') {
      return this.router.createUrlTree(['/admin']);
    } else if (user?.rol === 'profesor') {
      return this.router.createUrlTree(['/']);
    }
    // En caso contrario, al login
    return this.router.createUrlTree(['/login']);
  }
}
