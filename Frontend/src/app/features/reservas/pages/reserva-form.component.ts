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
import { LoggerService } from '../../../services/logger.service';
import { EstudianteResponseDTO, SalaResponseDTO, HorarioDisponibleResponseDTO } from '../../../models';

function fechaNoAnteriorAHoy(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fecha = new Date(control.value + 'T00:00:00');
  return fecha >= hoy ? null : { fechaAnterior: true };
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

  private salaIdPreseleccionada: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private estudianteService: EstudianteService,
    private salaService: SalaService,
    private horarioService: HorarioService,
    private reservaService: ReservaService,
    private logger: LoggerService,
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
    this.logger.info('Componente de formulario de reserva inicializado');
    this.route.queryParams.subscribe(params => {
      if (params['salaId']) {
        this.salaIdPreseleccionada = Number(params['salaId']);
        this.logger.info('Sala preseleccionada ID: {}', params['salaId']);
      }
    });
    this.loadSalas();
    const user = this.authService.currentUser;
    if (user) {
      this.seleccionarEstudiante(user);
    }
  }

  loadSalas(): void {
    this.salaService.getSalas().subscribe({
      next: (data) => {
        this.salas = data;
        if (this.salaIdPreseleccionada) {
          this.reservaForm.get('salaId')?.setValue(this.salaIdPreseleccionada);
          this.onSalaChange();
        }
      },
      error: (err) => { console.error('Error al cargar salas:', err); }
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
        this.logger.info('Estudiantes encontrados en busqueda: {}', data.length);
        this.estudiantesEncontrados = data;
        this.buscandoEstudiantes = false;
      },
      error: (err) => {
        this.logger.error('Error al buscar estudiantes: {}', err.message);
        this.estudiantesEncontrados = [];
        this.buscandoEstudiantes = false;
      }
    });
  }

  seleccionarEstudiante(est: EstudianteResponseDTO): void {
    this.logger.info('Estudiante seleccionado: {} {} (ID: {})', est.nombre, est.apellido, est.id);
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

    if (this.reservaForm.invalid || !this.estudianteSeleccionado) {
      this.logger.warn('Formulario de reserva invalido');
      return;
    }

    this.logger.info('Enviando formulario de reserva');

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
      next: (response) => {
        this.logger.info('Reserva creada exitosamente, redirigiendo a /reservas');
        this.submitting = false;
        this.router.navigate(['/reservas'], { queryParams: params });
      },
      error: (err) => {
        this.submitting = false;
        const mensaje = err?.error?.message || err?.message || '';
        this.logger.error('Error al crear reserva: {}', mensaje);
        if (mensaje.toLowerCase().includes('conflicto') || mensaje.toLowerCase().includes('ya existe')) {
          this.errorConflicto = 'Ya existe una reserva confirmada para esta sala, horario y fecha. Por favor selecciona otro horario.';
        } else {
          this.errorConflicto = mensaje || 'Ocurrió un error al crear la reserva. Intenta nuevamente.';
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
}
