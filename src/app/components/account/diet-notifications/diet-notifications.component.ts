import { Component } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-diet-notifications',
  imports: [ToggleSwitchModule, FormsModule],
  templateUrl: './diet-notifications.component.html',
  styleUrl: './diet-notifications.component.scss',
})
export class DietNotificationsComponent {
  checked1: boolean = false;
  checked2: boolean = true;
  checked3: boolean = false;
}
