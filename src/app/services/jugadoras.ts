import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class JugadorasService {
    url = 'http://localhost/proyecto_final_web/Proyecto-Final-WEB/backend/jugadoras.php';
    //AQUI TIENEN QUE PONER SU RUTA DE USTEDES

    constructor(private http: HttpClient) { }

    getJugadoras(equipo: string) {
        return this.http.post<any[]>(
            this.url,
            JSON.stringify({ accion: 'listar', equipo: equipo }),
            { headers: { 'Content-Type': 'text/plain' } }
        );
    }

    agregarJugadora(equipo: string, datos: any) {
        return this.http.post<any>(
            this.url,
            JSON.stringify({ accion: 'agregar', equipo: equipo, ...datos }),
            { headers: { 'Content-Type': 'text/plain' } }
        );
    }
}