import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactoService } from '../../../services/contacto.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  contactoForm: FormGroup;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  constructor(private fb: FormBuilder, private contactoService: ContactoService) {
    this.contactoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  enviar() {
    if (this.contactoForm.invalid) {
      this.contactoForm.markAllAsTouched();
      return;
    }

    this.contactoService.enviarMensaje(this.contactoForm.value).subscribe({
      next: () => {
        this.mensajeExito = '¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.';
        this.mensajeError = null;
        this.contactoForm.reset();
      },
      error: () => {
        this.mensajeError = 'Ocurrió un error al enviar el mensaje. Inténtalo más tarde.';
        this.mensajeExito = null;
      }
    });
  }
}
