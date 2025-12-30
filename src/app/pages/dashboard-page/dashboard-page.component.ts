import { Component } from '@angular/core';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-dashboard-page',
  imports: [SideMenuComponent, RouterOutlet],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  standalone: true
})
export class DashboardPageComponent {}
