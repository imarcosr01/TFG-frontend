import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UnifiedNavbarComponent } from '../../nav-bar/unified-navbar.component';
import { ImportarUsuariosService } from '../../services/importar-usuarios.service';
import { FileSizePipe } from '../../pipes/filesize.pipe';
import { RouterModule } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-importar-usuarios',
    templateUrl: './importar-usuarios.component.html',
    styleUrls: ['./importar-usuarios.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        MatProgressBarModule,
        MatSnackBarModule,
         FileSizePipe,
         RouterModule,
        UnifiedNavbarComponent
    
        
    ]
})
export class ImportarUsuariosComponent {
    selectedFile: File | null = null;
    userType: 'profesores' | 'alumnos' = 'profesores';
    isLoading = false;
    uploadProgress = 0;

    constructor(
        private importarUsuariosService: ImportarUsuariosService,
        private snackBar: MatSnackBar
    ) {}

    onFileSelected(event: Event): void {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            this.selectedFile = fileInput.files[0];
        }
    }

    onUpload(): void {
        if (!this.selectedFile) {
            this.showError('Por favor, selecciona un archivo');
            return;
        }

        this.isLoading = true;
        this.uploadProgress = 0;

        // Simular progreso (opcional, para UI)
        const progressInterval = setInterval(() => {
            this.uploadProgress = Math.min(this.uploadProgress + 10, 90);
        }, 200);

        this.importarUsuariosService.subirArchivo(this.selectedFile, this.userType)
            .subscribe({
                next: (res) => {
                    clearInterval(progressInterval);
                    this.uploadProgress = 100;
                    this.showSuccess(res.message);
                    if (res.details) {
                        console.warn('Errores durante la importación:', res.details);
                    }
                    this.resetForm();
                },
                error: (err) => {
                    clearInterval(progressInterval);
                    this.showError(err.error?.error || 'Error al importar usuarios');
                    console.error('Error completo:', err);
                },
                complete: () => {
                    this.isLoading = false;
                }
            });
    }

    private showSuccess(message: string): void {
        this.snackBar.open(message, 'Cerrar', {
            duration: 5000,
            panelClass: ['success-snackbar']
        });
    }

    private showError(message: string): void {
        this.snackBar.open(message, 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
        });
    }

    private resetForm(): void {
        this.selectedFile = null;
        this.userType = 'profesores';
        // Resetear el input de archivo
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }
}