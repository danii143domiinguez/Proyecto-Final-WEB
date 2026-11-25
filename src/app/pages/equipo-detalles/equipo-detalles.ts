import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JugadorasService } from '../../services/jugadoras';

@Component({
  selector: 'app-equipo-detalles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './equipo-detalles.html',
  styleUrl: './equipo-detalles.css'
})
export class EquipoDetalles implements OnInit {
  slug = '';
  equipo: any = null;
  jugadoras: any[] = [];
  mostrarForm = false;

  nueva = {
    nombreCompleto: '',
    edad: 20,
    posicion: 'Medio',
    playera: 16
  };

  equipos = [
    { slug: 'queer-goals', prefijo: 'QG', numero: 'Equipo 01', nombre: 'Queer Goals', edicion: '4.ª Edición', descripcion: 'Página oficial del equipo Queer Goals en Mujeres Diversas México.', colorIndex: 1 },
    { slug: 'valquirias', prefijo: 'VA', numero: 'Equipo 02', nombre: 'Valquirias', edicion: '4.ª Edición', descripcion: 'Página oficial del equipo Valquirias en Mujeres Diversas México.', colorIndex: 2 },
    { slug: 'good-vibes', prefijo: 'GV', numero: 'Equipo 03', nombre: 'Good Vibes', edicion: '4.ª Edición', descripcion: 'Página oficial del equipo Good Vibes en Mujeres Diversas México.', colorIndex: 3 },
    { slug: 'all-stars-gv', prefijo: 'AS', numero: 'Equipo 04', nombre: 'All Stars GV', edicion: '4.ª Edición', descripcion: 'Página oficial del equipo All Stars GV en Mujeres Diversas México.', colorIndex: 4 },
    { slug: 'tbd-united', prefijo: 'TU', numero: 'Equipo 05', nombre: 'TBD United', edicion: '4.ª Edición', descripcion: 'Página oficial del equipo TBD United en Mujeres Diversas México.', colorIndex: 5 },
    { slug: 'unknown', prefijo: 'UN', numero: 'Equipo 06', nombre: 'Unknown', edicion: '4.ª Edición', descripcion: 'Página oficial del equipo Unknown en Mujeres Diversas México.', colorIndex: 6 },
    { slug: 'fc-lionesses', prefijo: 'LI', numero: 'Equipo 07', nombre: 'F.C. Lionesses', edicion: '4.ª Edición', descripcion: 'Página oficial del equipo F.C. Lionesses en Mujeres Diversas México.', colorIndex: 1 },
    { slug: 'bandidas-fc', prefijo: 'BF', numero: 'Equipo 08', nombre: 'Bandidas F.C.', edicion: '4.ª Edición', descripcion: 'Página oficial del equipo Bandidas F.C. en Mujeres Diversas México.', colorIndex: 2 },
    { slug: 'real-madrid', prefijo: 'RM', numero: 'Equipo 09', nombre: 'Real Madrid', edicion: '4.ª Edición', descripcion: 'Página oficial del equipo Real Madrid en Mujeres Diversas México.', colorIndex: 3 },
    { slug: 'fenix-fc', prefijo: 'FF', numero: 'Equipo 10', nombre: 'Fénix F.C.', edicion: '4.ª Edición', descripcion: 'Página oficial del equipo Fénix F.C. en Mujeres Diversas México.', colorIndex: 4 },
    { slug: 'lobas-mexico', prefijo: 'LM', numero: 'Equipo 11', nombre: 'Lobas México', edicion: '4.ª Edición', descripcion: 'Página oficial del equipo Lobas México en Mujeres Diversas México.', colorIndex: 5 }
  ];

  constructor(
    private route: ActivatedRoute,
    private servicio: JugadorasService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') || '';
      this.equipo = this.equipos.find(e => e.slug === this.slug);
      this.mostrarForm = false;

      if (this.equipo) {
        this.cargarJugadoras();
      }
    });
  }

  cargarJugadoras() {
    this.servicio.getJugadoras(this.slug).subscribe(data => {
      this.jugadoras = data;
      this.cdr.detectChanges();
    });
  }

  siguienteId() {
    if (!this.equipo) return '';
    const num = this.jugadoras.length + 1;
    return this.equipo.prefijo + (num < 10 ? '0' + num : num);
  }

  abrirForm() {
    this.nueva = {
      nombreCompleto: '',
      edad: 20,
      posicion: 'Medio',
      playera: this.jugadoras.length + 1
    };
    this.mostrarForm = true;
  }

  guardar() {
    if (!this.nueva.nombreCompleto) return;

    this.servicio.agregarJugadora(this.slug, this.nueva).subscribe(creada => {
      this.jugadoras.push(creada);
      this.mostrarForm = false;
      this.cdr.detectChanges();
    });
  }
}