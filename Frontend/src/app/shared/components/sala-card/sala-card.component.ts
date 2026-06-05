import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sala-card',
  templateUrl: './sala-card.component.html',
  styleUrls: ['./sala-card.component.css']
})
export class SalaCardComponent {
  @Input() sala: any;

  constructor(private router: Router) {}

  reservar() {
    this.router.navigate(['/reserva', this.sala.id]);
  }
}
