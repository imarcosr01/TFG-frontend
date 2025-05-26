import { ApplicationConfig } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { 
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
  
} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthService } from './services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
     provideAnimations(),
  
    
    // Configura HttpClient con fetch API
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi() // Mantenemos para compatibilidad con interceptores
    ),
    

    // Interceptor de autenticación
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    // Módulos necesarios
    MatSnackBarModule,
    RouterModule
  ]
};