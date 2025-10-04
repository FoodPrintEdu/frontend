import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'team_project';
}

// 1. Add registration form error info
// 2. Add http client to register user
// 3. Add registration form validation
// 4. Add registration form submit button
// 5. Add registration form success message
