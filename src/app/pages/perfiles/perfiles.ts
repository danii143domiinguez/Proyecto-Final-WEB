import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PerfilJugadora {
  nombre: string;
  dorsal: number;
  equipo: string;
  posicion: string;
  goles: number;
  tarjetasAmarillas: number;
  tarjetasRojas: number;
}

@Component({
  selector: 'app-perfiles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfiles.html',
  styleUrl: './perfiles.css'
})
export class Perfiles {
  busqueda = '';
  equipoSeleccionado = 'Todos';

  jugadoras: PerfilJugadora[] = [
    {
      nombre: 'Sofía Martínez',
      dorsal: 10,
      equipo: 'Queer Goals',
      posicion: 'Delantera',
      goles: 7,
      tarjetasAmarillas: 1,
      tarjetasRojas: 0
    },
    {
      nombre: 'Valeria López',
      dorsal: 4,
      equipo: 'Valquirias',
      posicion: 'Defensa',
      goles: 0,
      tarjetasAmarillas: 3,
      tarjetasRojas: 1
    },
    {
      nombre: 'Camila Hernández',
      dorsal: 8,
      equipo: 'Good Vibes',
      posicion: 'Mediocampista',
      goles: 3,
      tarjetasAmarillas: 0,
      tarjetasRojas: 0
    },
    {
      nombre: 'Andrea Morales',
      dorsal: 1,
      equipo: 'Lobas México',
      posicion: 'Portera',
      goles: 0,
      tarjetasAmarillas: 1,
      tarjetasRojas: 0
    },
    {
      nombre: 'Fernanda Ruiz',
      dorsal: 9,
      equipo: 'Fénix F.C.',
      posicion: 'Delantera',
      goles: 5,
      tarjetasAmarillas: 2,
      tarjetasRojas: 0
    },
    {
      nombre: 'Daniela Castro',
      dorsal: 6,
      equipo: 'Queer Goals',
      posicion: 'Mediocampista',
      goles: 2,
      tarjetasAmarillas: 0,
      tarjetasRojas: 0
    }
  ];

  get equipos(): string[] {
    const unicos = new Set(this.jugadoras.map(j => j.equipo));
    return ['Todos', ...Array.from(unicos)];
  }

  get jugadorasFiltradas(): PerfilJugadora[] {
    return this.jugadoras.filter(j => {
      const coincideEquipo =
        this.equipoSeleccionado === 'Todos' || j.equipo === this.equipoSeleccionado;
      const coincideNombre = j.nombre
        .toLowerCase()
        .includes(this.busqueda.toLowerCase().trim());
      return coincideEquipo && coincideNombre;
    });
  }
}