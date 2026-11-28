import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Administracion } from './administracion';

describe('Administracion', () => {
  let component: Administracion;
  let fixture: ComponentFixture<Administracion>;

  beforeEach(async () => {
    sessionStorage.clear();
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Administracion],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(Administracion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.autenticado).toBe(false);
  });

  it('should validate provisional admin login and logout', () => {
    component.clave = 'INCORRECTA';
    component.ingresar();
    expect(component.autenticado).toBe(false);

    component.clave = 'LFMDM2026';
    component.ingresar();
    expect(component.autenticado).toBe(true);

    component.cerrarSesion();
    expect(component.autenticado).toBe(false);
  });
});
