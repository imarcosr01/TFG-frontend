// src/app/guards/auth.guard.ts

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean | UrlTree {
    // Solo en navegador comprobamos token
    const token = isPlatformBrowser(this.platformId)
      ? this.auth.getToken()
      : null;

    if (token && this.auth.getUser()) {
      return true;
    }
    // Si no hay token o user, vamos a login
    return this.router.createUrlTree(['/login']);
  }
}
