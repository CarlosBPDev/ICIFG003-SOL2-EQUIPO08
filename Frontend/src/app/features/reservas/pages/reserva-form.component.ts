import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MensajeComponent } from '../../../shared/components/mensaje/mensaje.component';
import { AuthService } from '../../../services/auth.service';
import { EstudianteService } from '../../../services/estudiante.service';
import { SalaService } from '../../../services/sala.service';
import { HorarioService } from '../../../services/horario.service';
import { ReservaService } from '../../../services/reserva.service';
import { EstudianteResponseDTO, SalaResponseDTO, HorarioDisponibleResponseDTO } from '../../../models';

function fechaNoAnteriorAHoy(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fecha = new Date(control.value + 'T00:00:00');
  if (fecha < hoy) return { fechaAnterior: true };
  const maxFecha = new Date(hoy);
  maxFecha.setMonth(maxFecha.getMonth() + 6);
  if (fecha > maxFecha) return { fechaExcedeMaximo: true };
  return null;
}

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MensajeComponent],
  templateUrl: './reserva-form.component.html',
  styleUrls: ['./reserva-form.component.css']
})
export class ReservaFormComponent implements OnInit {
  reservaForm: FormGroup;
  salas: SalaResponseDTO[] = [];
  horarios: HorarioDisponibleResponseDTO[] = [];
  estudiantesEncontrados: EstudianteResponseDTO[] = [];
  estudianteSeleccionado: EstudianteResponseDTO | null = null;
  buscandoEstudiantes = false;
  cargandoHorarios = false;
  submitting = false;
  errorConflicto = '';
  submitted = false;
  busquedaRealizada = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  private salaIdPreseleccionada: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private estudianteService: EstudianteService,
    private salaService: SalaService,
    private horarioService: HorarioService,
    private reservaService: ReservaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.reservaForm = this.fb.group({
      estudianteSearch: [''],
      fechaReserva: ['', [Validators.required, fechaNoAnteriorAHoy]],
      salaId: ['', Validators.required],
      horarioDisponibleId: ['', Validators.required],
      observacion: ['', [Validators.required, Validators.minLength(15)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['salaId']) {
        this.salaIdPreseleccionada = Number(params['salaId']);
      }
    });
    this.loadSalas();
    const user = this.authService.currentUser;
    if (user) {
      this.seleccionarEstudiante(user);
    }
  }

  loadSalas(): void {
    this.errorMsg = null;
    this.salaService.getSalas().subscribe({
      next: (data) => {
        this.salas = data;
        if (this.salaIdPreseleccionada) {
          this.reservaForm.get('salaId')?.setValue(this.salaIdPreseleccionada);
          this.onSalaChange();
        }
      },
      error: (err) => {
        console.error('Error al cargar salas:', err);
        this.errorMsg = err.error?.userMessage || 'No se pudieron cargar las salas. Verifica tu conexión.';
      }
    });
  }

  buscarEstudiante(): void {
    const termino = this.reservaForm.get('estudianteSearch')?.value?.trim();
    if (!termino) return;

    this.buscandoEstudiantes = true;
    this.busquedaRealizada = true;

    const query: { rut?: string; nombre?: string; apellido?: string } = {};
    if (/^[0-9]+-[0-9kK]{1}$/.test(termino)) {
      query.rut = termino;
    } else {
      const partes = termino.split(' ');
      query.nombre = partes[0];
      query.apellido = partes.slice(1).join(' ') || '';
    }

    this.estudianteService.buscarEstudiante(query).subscribe({
      next: (data) => {
        this.estudiantesEncontrados = data;
        this.buscandoEstudiantes = false;
      },
      error: (err) => {
        this.estudiantesEncontrados = [];
        this.buscandoEstudiantes = false;
        this.errorMsg = err.error?.userMessage || 'Error al buscar estudiantes. Verifica tu conexión.';
      }
    });
  }

  seleccionarEstudiante(est: EstudianteResponseDTO): void {
    this.estudianteSeleccionado = est;
    this.estudiantesEncontrados = [];
    this.reservaForm.get('estudianteSearch')?.setValue(est.rut + ' - ' + est.nombre + ' ' + est.apellido);
  }

  quitarEstudiante(): void {
    this.estudianteSeleccionado = null;
    this.reservaForm.get('estudianteSearch')?.setValue('');
    this.estudiantesEncontrados = [];
  }

  onSalaChange(): void {
    const salaId = this.reservaForm.get('salaId')?.value;
    this.reservaForm.get('horarioDisponibleId')?.setValue('');
    this.horarios = [];
    if (!salaId) return;

    this.cargandoHorarios = true;
    this.horarioService.getHorarios(salaId).subscribe({
      next: (data) => {
        this.horarios = data;
        this.cargandoHorarios = false;
      },
      error: () => {
        this.horarios = [];
        this.cargandoHorarios = false;
      }
    });
  }

  seleccionarHorario(id: number): void {
    this.reservaForm.get('horarioDisponibleId')?.setValue(id);
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorConflicto = '';
    this.errorMsg = null;

    if (this.reservaForm.invalid || !this.estudianteSeleccionado) return;

    const formValue = this.reservaForm.value;
    this.submitting = true;

    const params = {
      salaId: formValue.salaId,
      fecha: formValue.fechaReserva
    };

    if (this.estudianteSeleccionado.id === 0) {
      this.submitting = false;
      this.router.navigate(['/reservas'], { queryParams: params });
      return;
    }

    this.reservaService.crearReserva({
      fechaReserva: formValue.fechaReserva,
      observacion: formValue.observacion.trim(),
      estudianteId: this.estudianteSeleccionado.id,
      salaId: formValue.salaId,
      horarioDisponibleId: formValue.horarioDisponibleId,
      estadoReservaId: 1
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.successMsg = 'Reserva creada exitosamente. Redirigiendo...';
        setTimeout(() => {
          this.router.navigate(['/reservas'], { queryParams: params });
        }, 1500);
      },
      error: (err) => {
        this.submitting = false;
        const userMsg = err.error?.userMessage || err?.error?.message || err?.message || '';
        if (userMsg.toLowerCase().includes('conflicto') || userMsg.toLowerCase().includes('ya existe')) {
          this.errorConflicto = 'Ya existe una reserva confirmada para esta sala, horario y fecha. Por favor selecciona otro horario.';
        } else {
          this.errorMsg = err.error?.userMessage || userMsg || 'Ocurrió un error al crear la reserva. Intenta nuevamente.';
        }
      }
    });
  }

  get fechaInvalida(): boolean {
    const ctrl = this.reservaForm.get('fechaReserva');
    return !!(ctrl && (ctrl.touched || this.submitted) && ctrl.errors);
  }

  get obsInvalida(): boolean {
    const ctrl = this.reservaForm.get('observacion');
    return !!(ctrl && (ctrl.touched || this.submitted) && ctrl.errors);
  }

  get sinEstudiante(): boolean {
    return this.submitted && !this.estudianteSeleccionado;
  }

  get hoy(): string {
    return new Date().toISOString().split('T')[0];
  }
}
