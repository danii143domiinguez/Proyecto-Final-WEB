import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquipoDetalles } from './equipo-detalles';

describe('EquipoDetalles', () => {
  let component: EquipoDetalles;
  let fixture: ComponentFixture<EquipoDetalles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipoDetalles],
    }).compileComponents();

    fixture = TestBed.createComponent(EquipoDetalles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
