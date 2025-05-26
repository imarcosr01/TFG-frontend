// src/app/components/home-profesor/home-profesor.component.ts
import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule }          from '@angular/common';
import { MatButtonModule }       from '@angular/material/button';
import { MatIconModule }         from '@angular/material/icon';
import { AuthService }           from '../../services/auth.service';

@Component({
  selector: 'app-home-profesor',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './home-profesor.component.html',
  styleUrls: ['./home-profesor.component.scss']
})
export class HomeProfesorComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}