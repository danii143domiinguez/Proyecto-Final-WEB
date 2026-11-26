import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Jugadora {
  nombre: string;
  dorsal: number | null;
  posicion: string;
}

@Component({
  selector: 'app-registros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registros.html',
  styleUrl: './registros.css'
})
export class Registros {
  nombreEquipo = '';
  logoArchivo: File | null = null;
  logoPreview: string | null = null;

  jugadoras: Jugadora[] = [
    { nombre: '', dorsal: null, posicion: 'Delantera' }
  ];

  mensajeExito = '';

  onLogoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.logoArchivo = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string;
      };
      reader.readAsDataURL(this.logoArchivo);
    }
  }

  agregarJugadora() {
    this.jugadoras.push({ nombre: '', dorsal: null, posicion: 'Mediocampista' });
  }

  eliminarJugadora(index: number) {
    if (this.jugadoras.length > 1) {
      this.jugadoras.splice(index, 1);
    }
  }

  registrarEquipo() {
    if (!this.nombreEquipo.trim()) {
      return;
    }

    const datosRegistro = {
      equipo: this.nombreEquipo,
      logo: this.logoArchivo ? this.logoArchivo.name : null,
      jugadoras: this.jugadoras.filter(j => j.nombre.trim() !== '')
    };

    console.log('Datos listos para enviar:', datosRegistro);
    this.mensajeExito = `El equipo "${this.nombreEquipo}" con ${datosRegistro.jugadoras.length} jugadora(s) ha sido registrado.`;

    this.nombreEquipo = '';
    this.logoArchivo = null;
    this.logoPreview = null;
    this.jugadoras = [{ nombre: '', dorsal: null, posicion: 'Delantera' }];
  }
}