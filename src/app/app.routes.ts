import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Registros } from './pages/registros/registros';
import { Perfiles } from './pages/perfiles/perfiles';
import { Administracion } from './pages/administracion/administracion';
import { Coaching } from './pages/coaching/coaching';
import { Equipos } from './pages/equipos/equipos';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'registros', component: Registros },
  { path: 'perfiles', component: Perfiles },
  { path: 'administracion', component: Administracion },
  { path: 'coaching', component: Coaching },
  { path: 'equipos', component: Equipos },
  { path: '**', redirectTo: 'inicio' }
];