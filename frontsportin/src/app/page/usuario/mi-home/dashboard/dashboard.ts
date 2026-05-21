import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../../../component/shared/dashboard/dashboard';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardComponent],
  template: `
    <div class="user-dashboard-wrapper">
      <app-dashboard></app-dashboard>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .user-dashboard-wrapper {
      width: 100%;
      height: 100%;
    }
  `]
})
export class UsuarioDashboardPage {}
