import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalaCardComponent } from './sala-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SalaResponseDTO } from '../../../models';

describe('SalaCardComponent (DOM Testing)', () => {
  let component: SalaCardComponent;
  let fixture: ComponentFixture<SalaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaCardComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SalaCardComponent);
    component = fixture.componentInstance;
    
    // Mock data
    const mockSala: SalaResponseDTO = {
      id: 1,
      codigoSala: 'A1',
      nombreSala: 'Sala A1',
      capacidad: 10,
      piso: 1,
      descripcion: 'Sala de prueba',
      estado: 'disponible'
    };
    component.sala = mockSala;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the SVG icon in the DOM', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const svg = compiled.querySelector('svg.sala-icon-bg');
    expect(svg).toBeTruthy('SVG icon should be present in the DOM');
  });

  it('should display the correct room code in the DOM', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const codeSpan = compiled.querySelector('.sala-img-code');
    expect(codeSpan?.textContent).toContain('A1');
  });

  it('should have focus-visible accessibility classes on the card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('.sala-card');
    expect(card?.getAttribute('tabindex')).toBe('0');
  });

  it('should render the room capacity correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const details = compiled.querySelectorAll('.spec-item span');
    let hasCapacity = false;
    details.forEach(span => {
      if (span.textContent?.includes('10 personas')) {
        hasCapacity = true;
      }
    });
    expect(hasCapacity).toBeTrue();
  });
});
