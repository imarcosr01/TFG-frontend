import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ImportarUsuariosService {
    private apiUrl = 'http://localhost:3000/api/import/users';

    constructor(private http: HttpClient) { }

    subirArchivo(file: File, userType: 'profesores' | 'alumnos'): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userType', userType);

        // Headers opcionales mejorados
        const headers = new HttpHeaders({
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        });

        return this.http.post(this.apiUrl, formData, { 
            headers,
            reportProgress: true,  // Opcional: para seguimiento de progreso
            responseType: 'json' 
        });
    }
}