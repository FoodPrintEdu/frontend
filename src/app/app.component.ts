import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginFormComponent } from './Components/login-form/login-form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'team_project';
}
