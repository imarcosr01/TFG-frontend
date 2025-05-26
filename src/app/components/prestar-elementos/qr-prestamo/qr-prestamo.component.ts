import { Component, OnInit } from '@angular/core';
import { GruposTrabajoService } from '../../../services/grupos-trabajo.service';
import { ElementosService } from '../../../services/elemento.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Alumno } from '../../../models/alumno.model';
import { Elemento } from '../../../models/elemento.model';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BarcodeFormat } from '@zxing/library';
import { AuthService } from '../../../services/auth.service';
import { PrestamoService } from '../../../services/prestamo.service';  // Asegúrate de que la ruta es correcta
import { Router } from '@angular/router';
@Component({
  selector: 'app-qr-prestamo',
  templateUrl: './qr-prestamo.component.html',
  styleUrls: ['./qr-prestamo.component.scss'],
  imports: [
    ZXingScannerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    CommonModule,
  ]
})
export class QrPrestamoComponent implements OnInit {
  stock!: number;
  grupoSeleccionado!: number;
  alumnoSeleccionado?: number | null;

  grupos: any[] = [];
  alumnos: Alumno[] = [];

  escaneando = false;

  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | undefined = undefined;
  hasDevices = false;
  formats: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
constructor(
  private grupoService: GruposTrabajoService,
  private elementoService: ElementosService,
  private prestamoService: PrestamoService, // <-- añade esto
  private snack: MatSnackBar,
  private authService: AuthService,
  private router: Router,
) {}

  ngOnInit(): void {
    const usuario = this.authService.getUser();
    if (usuario && usuario.rol === 'profesor') {
      this.cargarGrupos(usuario.id);
    } else {
      this.snack.open('No se pudo obtener el usuario o no tienes permisos', 'Cerrar', { duration: 3000 });
    }
  }
  compareGrupos(g1: any, g2: any): boolean {
    return g1 && g2 ? g1 === g2 : g1 === g2;
  }
cargarGrupos(idProfesor: number) {
    this.grupoService.getGruposPorProfesor(idProfesor).subscribe({
      next: (grupos) => {
        // Convertir IDs a string si es necesario
        this.grupos = grupos.map(g => ({...g, id: g.id_grupo.toString()}));
      },
      error: () => this.snack.open('Error al cargar grupos', 'Cerrar', { duration: 3000 })
    });
  }
  

  cargarAlumnos() {
    this.alumnoSeleccionado = null;
    if (this.grupoSeleccionado) {
      this.grupoService.getAlumnosGrupo(this.grupoSeleccionado).subscribe({
        next: (alumnos) => this.alumnos = alumnos,
        error: () => this.snack.open('Error al cargar alumnos', 'Cerrar', { duration: 3000 })
      });
    } else {
      this.alumnos = [];
    }
  }

  iniciarEscaneo() {
    if (!this.stock || !this.grupoSeleccionado) {
      this.snack.open('Debes seleccionar el stock y el grupo antes de escanear', 'Cerrar', { duration: 3000 });
      return;
    }
    this.escaneando = true;
  }

  onCamerasFound(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
    this.hasDevices = devices.length > 0;
    if (!this.selectedDevice && devices.length) {
      this.selectedDevice = devices[0];
    }
  }

  onPermissionResponse(hasPermission: boolean) {
    if (!hasPermission) {
      this.snack.open('Permiso de cámara denegado', 'Cerrar', { duration: 3000 });
    }
  }

 handleScan(qrCode: string) {
  this.escaneando = false;

  this.elementoService.getByQr(qrCode).subscribe({
    next: (elemento: Elemento) => {
      const payload = {
        id_profesor: this.authService.getUser()!.id,
        id_clase: this.grupos.find(g => g.id == this.grupoSeleccionado)!.clase.id_clase,
        id_grupo: +this.grupoSeleccionado,
        id_alumno: this.alumnoSeleccionado ?? null,
        elementos: [{ id_elemento: elemento.id, cantidad: this.stock }]
      };

      this.prestamoService.create(payload).subscribe({
        next: () => {
          this.snack.open(`Préstamo de ${elemento.nombre} creado`, 'Cerrar', { duration: 3000 });
          this.router.navigateByUrl('/prestamos'); // ⬅️ REDIRECCIÓN AQUÍ
        },
        error: () => {
          this.snack.open('Error al registrar el préstamo', 'Cerrar', { duration: 3000 });
        }
      });
    },
    error: () => this.snack.open('QR inválido o elemento no encontrado', 'Cerrar', { duration: 3000 })
  });
}}
