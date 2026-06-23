import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { LoggerService } from './services/logger.service';
import { MenuComponent } from './shared/components/menu/menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterModule, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'S2_ATW';

  constructor(
    public authService: AuthService,
    private router: Router,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.logger.info('Aplicacion S2_ATW inicializada');
  }

  logout(): void {
    this.logger.info('Cerrando sesion desde AppComponent');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
