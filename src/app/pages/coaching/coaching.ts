import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Especialista {
  nombre: string;
  iniciales: string;
  area: string;
  especialidad: string;
  descripcion: string;
  telefono: string;
  correo: string;
}

@Component({
  selector: 'app-coaching',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coaching.html',
  styleUrl: './coaching.css'
})
export class Coaching {
  busqueda = '';
  areaSeleccionada = 'Todas';

  especialistas: Especialista[] = [
    {
      nombre: 'Laura Méndez',
      iniciales: 'LM',
      area: 'Estrategia',
      especialidad: 'Entrenadora de Estrategia y Táctica',
      descripcion: 'Análisis de partidos, parados tácticos, transiciones ofensivas y lectura de juego en cancha.',
      telefono: '55 4128 9034',
      correo: 'laura.mendez@gmail.com'
    },
    {
      nombre: 'Carla Vázquez',
      iniciales: 'CV',
      area: 'Condición Física',
      especialidad: 'Preparadora Física',
      descripcion: 'Entrenamiento de resistencia aeróbica, velocidad, fuerza explosiva y prevención de fatiga.',
      telefono: '55 3892 1147',
      correo: 'carla.vazquez@outlook.com'
    },
    {
      nombre: 'Mariana Ortega',
      iniciales: 'MO',
      area: 'Recuperación',
      especialidad: 'Masajista Deportiva',
      descripcion: 'Masaje de descarga muscular, liberación miofascial y recuperación post-partido.',
      telefono: '55 6710 4429',
      correo: 'mariana.ortega@uvm.com'
    },
    {
      nombre: 'Diana Salazar',
      iniciales: 'DS',
      area: 'Recuperación',
      especialidad: 'Fisioterapeuta Deportiva',
      descripcion: 'Rehabilitación de lesiones de rodilla y tobillo, vendaje neuromuscular y movilidad articular.',
      telefono: '55 2945 8812',
      correo: 'diana.salazar@gmail.com'
    },
    {
      nombre: 'Paola Ríos',
      iniciales: 'PR',
      area: 'Condición Física',
      especialidad: 'Entrenadora de Porteras',
      descripcion: 'Técnica de atajadas, juego aéreo, reflejos, posicionamiento y salida con los pies.',
      telefono: '55 5103 7765',
      correo: 'paola.rios@gmail.com'
    },
    {
      nombre: 'Elena Navarro',
      iniciales: 'EN',
      area: 'Bienestar',
      especialidad: 'Nutrióloga Deportiva',
      descripcion: 'Planes de alimentación para rendimiento en torneo, hidratación y recuperación energética.',
      telefono: '55 7834 2290',
      correo: 'elena.navarro@gmail.com'
    }
  ];

  get areas(): string[] {
    const unicas = new Set(this.especialistas.map(e => e.area));
    return ['Todas', ...Array.from(unicas)];
  }

  get especialistasFiltrados(): Especialista[] {
    return this.especialistas.filter(e => {
      const coincideArea =
        this.areaSeleccionada === 'Todas' || e.area === this.areaSeleccionada;
      const termino = this.busqueda.toLowerCase().trim();
      const coincideBusqueda =
        e.nombre.toLowerCase().includes(termino) ||
        e.especialidad.toLowerCase().includes(termino);
      return coincideArea && coincideBusqueda;
    });
  }
}