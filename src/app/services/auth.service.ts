import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: number;            // <— aquí
  email: string;
  nombre: string;
  apellido: string;
  rol: 'profesor' | 'administrador';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // URL completa del backend
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Inyección para SSR
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    if (isPlatformBrowser(this.platformId)) { // Solo en cliente
      const stored = localStorage.getItem('user');
      if (stored) {
        this.userSubject.next(JSON.parse(stored));
      }
    }
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: User }>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap(({ token, user }) => {
        if (isPlatformBrowser(this.platformId)) { // Solo en cliente
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
        this.userSubject.next(user);
        this.redirectBasedOnRole(user.rol);
      })
    );
  }
private redirectBasedOnRole(rol: 'profesor' | 'administrador') {
  if (rol === 'profesor') {
    // Llévale al menú principal de profesor
    this.router.navigate(['/']);
  } else {
    // Llévale al panel de admin
    this.router.navigate(['/admin']);
  }
}




  logout(): void {
    if (isPlatformBrowser(this.platformId)) { // Solo en cliente
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null;
  }

  getUser(): User | null {
    return this.userSubject.value;
  }
}