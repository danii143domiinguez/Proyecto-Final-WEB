import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JugadorasService } from '../../services/jugadoras';

interface JugadoraItem {
  numero: string;
  nombre: string;
  playera: number;
  posicion: string;
}

interface AlineacionRow {
  slot: number;
  nombre: string;
  playera: number | null;
  posicion: string;
}

interface CambioRow {
  equipo: 'local' | 'visitante';
  sale: string;
  entra: string;
  minuto: number;
}

interface GolRow {
  equipo: 'local' | 'visitante';
  jugadora: string;
  minuto: number;
}

interface TarjetaRow {
  equipo: 'local' | 'visitante';
  jugadora: string;
  tipo: 'Amarilla' | 'Roja';
  minuto: number;
}

interface IncidenciaRow {
  equipo: 'local' | 'visitante' | 'general';
  tipo: 'Falta' | 'Incidencia';
  jugadora: string;
  minuto: number;
  descripcion: string;
}

interface Partido {
  id: string;
  jornada: number;
  fase: 'Round Robin' | 'Semifinal' | 'Final';
  categoria: string;
  fecha: string;
  hora: string;
  localSlug: string;
  visitanteSlug: string;
  arbitro: string;
  asistente: string;
  estado: 'Programado' | 'Finalizado';
  alineacionLocal: AlineacionRow[];
  alineacionVisitante: AlineacionRow[];
  cambios: CambioRow[];
  goles: GolRow[];
  tarjetas: TarjetaRow[];
  incidencias: IncidenciaRow[];
  penalesLocal: number | null;
  penalesVisitante: number | null;
  firmaLocal: string;
  firmaVisitante: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-administracion',
  styleUrl: './administracion.css',
  templateUrl: './administracion.html',
})
export class Administracion implements OnInit {
  private readonly SESION_KEY = 'lfmdm_admin_ok';
  private readonly STORAGE_KEY = 'lfmdm_partidos_v1';
  private readonly CLAVE_PROVISIONAL = 'LFMDM2026';

  // Acceso provisional académico
  autenticado = false;
  clave = '';
  errorLogin = '';

  // Catálogo de equipos (mismos slugs que equipos / jugadoras.php)
  equipos = [
    { slug: 'queer-goals', nombre: 'Queer Goals' },
    { slug: 'valquirias', nombre: 'Valquirias' },
    { slug: 'good-vibes', nombre: 'Good Vibes' },
    { slug: 'all-stars-gv', nombre: 'All Stars GV' },
    { slug: 'tbd-united', nombre: 'TBD United' },
    { slug: 'unknown', nombre: 'Unknown' },
    { slug: 'fc-lionesses', nombre: 'F.C. Lionesses' },
    { slug: 'bandidas-fc', nombre: 'Bandidas F.C.' },
    { slug: 'real-madrid', nombre: 'Real Madrid' },
    { slug: 'fenix-fc', nombre: 'Fénix F.C.' },
    { slug: 'lobas-mexico', nombre: 'Lobas México' },
  ];

  // Plantillas cargadas desde backend/jugadoras.php cuando está activo
  rosters: Record<string, JugadoraItem[]> = {};
  partidos: Partido[] = [];
  partidoActual: Partido | null = null;

  errores: string[] = [];
  mensaje = '';

  // Formularios auxiliares de eventos en cédula
  nuevoCambio: CambioRow = { equipo: 'local', sale: '', entra: '', minuto: 20 };
  nuevoGol: GolRow = { equipo: 'local', jugadora: '', minuto: 10 };
  nuevaTarjeta: TarjetaRow = { equipo: 'local', jugadora: '', tipo: 'Amarilla', minuto: 15 };
  nuevaIncidencia: IncidenciaRow = {
    equipo: 'local',
    tipo: 'Falta',
    jugadora: '',
    minuto: 18,
    descripcion: '',
  };

  constructor(private jugadorasService: JugadorasService) { }

  ngOnInit(): void {
    this.autenticado = this.leerSesion();
    this.partidos = this.cargarPartidos();
  }

  // --- Acceso ---
  ingresar(): void {
    this.errorLogin = '';
    if (this.clave.trim() !== this.CLAVE_PROVISIONAL) {
      this.errorLogin = 'Clave administrativa incorrecta.';
      return;
    }
    this.autenticado = true;
    this.clave = '';
    try {
      sessionStorage.setItem(this.SESION_KEY, '1');
    } catch { }
  }

  cerrarSesion(): void {
    this.autenticado = false;
    this.partidoActual = null;
    try {
      sessionStorage.removeItem(this.SESION_KEY);
    } catch { }
  }

  // --- Partidos ---
  nuevoPartido(): void {
    const hoy = new Date();
    const diff = (7 - hoy.getDay()) % 7;
    const dom = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + diff);
    const fecha = `${dom.getFullYear()}-${String(dom.getMonth() + 1).padStart(2, '0')}-${String(dom.getDate()).padStart(2, '0')}`;

    this.partidoActual = {
      id: `p_${Date.now()}`,
      jornada: 1,
      fase: 'Round Robin',
      categoria: 'Libre Femenil',
      fecha,
      hora: '09:00',
      localSlug: 'queer-goals',
      visitanteSlug: 'valquirias',
      arbitro: '',
      asistente: '',
      estado: 'Programado',
      alineacionLocal: this.crearSlots(),
      alineacionVisitante: this.crearSlots(),
      cambios: [],
      goles: [],
      tarjetas: [],
      incidencias: [],
      penalesLocal: null,
      penalesVisitante: null,
      firmaLocal: '',
      firmaVisitante: '',
    };
    this.errores = [];
    this.mensaje = '';
    this.cargarRoster(this.partidoActual.localSlug);
    this.cargarRoster(this.partidoActual.visitanteSlug);
  }

  abrirCedula(partido: Partido): void {
    this.partidoActual = JSON.parse(JSON.stringify(partido));
    this.errores = [];
    this.mensaje = '';
    if (this.partidoActual) {
      this.cargarRoster(this.partidoActual.localSlug);
      this.cargarRoster(this.partidoActual.visitanteSlug);
    }
  }

  volverALista(): void {
    this.partidoActual = null;
    this.errores = [];
    this.mensaje = '';
  }

  eliminarPartido(id: string): void {
    this.partidos = this.partidos.filter((p) => p.id !== id);
    this.guardarStorage();
  }

  alCambiarEquipo(lado: 'local' | 'visitante'): void {
    if (!this.partidoActual) return;
    const slug = lado === 'local' ? this.partidoActual.localSlug : this.partidoActual.visitanteSlug;
    if (lado === 'local') {
      this.partidoActual.alineacionLocal = this.crearSlots();
    } else {
      this.partidoActual.alineacionVisitante = this.crearSlots();
    }
    this.partidoActual.cambios = this.partidoActual.cambios.filter((c) => c.equipo !== lado);
    this.partidoActual.goles = this.partidoActual.goles.filter((g) => g.equipo !== lado);
    this.partidoActual.tarjetas = this.partidoActual.tarjetas.filter((t) => t.equipo !== lado);
    this.partidoActual.incidencias = this.partidoActual.incidencias.filter((i) => i.equipo !== lado);
    this.cargarRoster(slug);
  }

  alSeleccionarTitular(lado: 'local' | 'visitante', row: AlineacionRow): void {
    const jug = this.rosterDe(lado).find((j) => j.nombre === row.nombre);
    if (jug) {
      row.playera = jug.playera;
      row.posicion = jug.posicion;
    }
  }

  // --- Eventos de la cédula ---
  agregarCambio(): void {
    if (!this.partidoActual) return;
    if (!this.nuevoCambio.sale.trim() || !this.nuevoCambio.entra.trim()) {
      this.errores = ['Cambio: indica quién sale y quién entra.'];
      return;
    }
    if (this.nuevoCambio.sale.trim() === this.nuevoCambio.entra.trim()) {
      this.errores = ['Cambio: no puede entrar y salir la misma jugadora.'];
      return;
    }
    if (!this.minutoValido(this.nuevoCambio.minuto)) {
      this.errores = ['Cambio: minuto inválido (1 a 45).'];
      return;
    }
    this.errores = [];
    this.partidoActual.cambios.push({ ...this.nuevoCambio });
    this.nuevoCambio.sale = '';
    this.nuevoCambio.entra = '';
  }

  agregarGol(): void {
    if (!this.partidoActual) return;
    if (!this.nuevoGol.jugadora.trim()) {
      this.errores = ['Gol: indica la jugadora que anotó.'];
      return;
    }
    if (!this.minutoValido(this.nuevoGol.minuto)) {
      this.errores = ['Gol: minuto inválido (1 a 45).'];
      return;
    }
    this.errores = [];
    this.partidoActual.goles.push({ ...this.nuevoGol });
    this.nuevoGol.jugadora = '';
  }

  agregarTarjeta(): void {
    if (!this.partidoActual) return;
    if (!this.nuevaTarjeta.jugadora.trim()) {
      this.errores = ['Tarjeta: indica la jugadora sancionada.'];
      return;
    }
    if (!this.minutoValido(this.nuevaTarjeta.minuto)) {
      this.errores = ['Tarjeta: minuto inválido (1 a 45).'];
      return;
    }
    this.errores = [];
    this.partidoActual.tarjetas.push({ ...this.nuevaTarjeta });
    this.nuevaTarjeta.jugadora = '';
  }

  agregarIncidencia(): void {
    if (!this.partidoActual) return;
    if (!this.nuevaIncidencia.descripcion.trim()) {
      this.errores = ['Incidencia: escribe una descripción.'];
      return;
    }
    if (!this.minutoValido(this.nuevaIncidencia.minuto)) {
      this.errores = ['Incidencia: minuto inválido (1 a 45).'];
      return;
    }
    this.errores = [];
    this.partidoActual.incidencias.push({ ...this.nuevaIncidencia });
    this.nuevaIncidencia.jugadora = '';
    this.nuevaIncidencia.descripcion = '';
  }

  guardarCedula(): void {
    if (!this.partidoActual) return;
    const p = this.partidoActual;
    const errs: string[] = [];

    if (!p.categoria.trim() || !p.fecha || !p.hora) {
      errs.push('Categoría, fecha y hora son obligatorias.');
    }
    if (!p.localSlug || !p.visitanteSlug || p.localSlug === p.visitanteSlug) {
      errs.push('Selecciona dos equipos distintos.');
    }
    if (!p.arbitro.trim()) {
      errs.push('El nombre del árbitro es obligatorio.');
    }

    const gLocal = this.golesEquipo(p, 'local');
    const gVisitante = this.golesEquipo(p, 'visitante');
    if (p.estado === 'Finalizado' && gLocal === gVisitante) {
      if (
        p.penalesLocal === null ||
        p.penalesVisitante === null ||
        p.penalesLocal === p.penalesVisitante
      ) {
        errs.push(
          'No se permiten empates definitivos: captura un ganador en la tanda de penales.'
        );
      }
    }

    this.errores = errs;
    if (errs.length > 0) return;

    const clon: Partido = JSON.parse(JSON.stringify(p));
    const idx = this.partidos.findIndex((x) => x.id === clon.id);
    if (idx >= 0) {
      this.partidos[idx] = clon;
    } else {
      this.partidos.unshift(clon);
    }
    this.guardarStorage();
    this.mensaje = 'Cédula guardada localmente en el navegador.';
  }

  // --- Helpers de consulta ---
  nombreEquipo(slug: string): string {
    return this.equipos.find((e) => e.slug === slug)?.nombre ?? slug;
  }

  rosterDe(lado: 'local' | 'visitante'): JugadoraItem[] {
    if (!this.partidoActual) return [];
    const slug = lado === 'local' ? this.partidoActual.localSlug : this.partidoActual.visitanteSlug;
    return this.rosters[slug] ?? [];
  }

  golesEquipo(p: Partido, lado: 'local' | 'visitante'): number {
    return p.goles.filter((g) => g.equipo === lado).length;
  }

  contarJugadora(p: Partido, lado: 'local' | 'visitante', nombre: string, tipo: 'TA' | 'TR' | 'G'): number {
    if (!nombre) return 0;
    if (tipo === 'G') {
      return p.goles.filter((g) => g.equipo === lado && g.jugadora === nombre).length;
    }
    const target = tipo === 'TA' ? 'Amarilla' : 'Roja';
    return p.tarjetas.filter((t) => t.equipo === lado && t.jugadora === nombre && t.tipo === target).length;
  }

  esDomingo(fechaISO: string): boolean {
    const [y, m, d] = fechaISO.split('-').map(Number);
    if (!y || !m || !d) return true;
    return new Date(y, m - 1, d).getDay() === 0;
  }

  tablaPosiciones() {
    const mapa = new Map<string, { nombre: string; pj: number; pg: number; pp: number; gf: number; gc: number; pts: number }>();
    for (const eq of this.equipos) {
      mapa.set(eq.slug, { nombre: eq.nombre, pj: 0, pg: 0, pp: 0, gf: 0, gc: 0, pts: 0 });
    }
    for (const p of this.partidos) {
      if (p.estado !== 'Finalizado' || p.fase !== 'Round Robin') continue;
      const loc = mapa.get(p.localSlug);
      const vis = mapa.get(p.visitanteSlug);
      if (!loc || !vis) continue;
      const gl = this.golesEquipo(p, 'local');
      const gv = this.golesEquipo(p, 'visitante');
      loc.pj++; vis.pj++;
      loc.gf += gl; loc.gc += gv;
      vis.gf += gv; vis.gc += gl;
      const ganaLocal = gl > gv || (gl === gv && (p.penalesLocal ?? 0) > (p.penalesVisitante ?? 0));
      if (ganaLocal) {
        loc.pg++; loc.pts += 3; vis.pp++;
      } else {
        vis.pg++; vis.pts += 3; loc.pp++;
      }
    }
    return Array.from(mapa.values())
      .filter((t) => t.pj > 0)
      .sort((a, b) => b.pts - a.pts || b.gf - b.gc - (a.gf - a.gc));
  }

  private cargarRoster(slug: string): void {
    if (!slug || this.rosters[slug]) return;
    this.jugadorasService.getJugadoras(slug).subscribe({
      next: (rows) => {
        this.rosters[slug] = (rows || []).map((r) => ({
          numero: String(r['Numero'] ?? ''),
          nombre: String(r['Nombre Completo'] ?? ''),
          playera: Number(r['Playera'] ?? 0),
          posicion: String(r['Posicion'] ?? ''),
        }));
      },
      error: () => {
        this.rosters[slug] = [];
      },
    });
  }

  private crearSlots(): AlineacionRow[] {
    return Array.from({ length: 7 }, (_, i) => ({
      slot: i + 1,
      nombre: '',
      playera: null,
      posicion: i === 0 ? 'Portera' : '',
    }));
  }

  private minutoValido(m: number): boolean {
    const n = Number(m);
    return Number.isFinite(n) && n >= 1 && n <= 45;
  }

  private leerSesion(): boolean {
    try {
      return typeof sessionStorage !== 'undefined' && sessionStorage.getItem(this.SESION_KEY) === '1';
    } catch {
      return false;
    }
  }

  private cargarPartidos(): Partido[] {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(this.STORAGE_KEY) : null;
      return raw ? (JSON.parse(raw) as Partido[]) : [];
    } catch {
      return [];
    }
  }

  private guardarStorage(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.partidos));
      }
    } catch { }
  }
}
