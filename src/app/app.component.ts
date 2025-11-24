import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {UserService} from './service/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent implements OnInit {
  constructor(private userService: UserService) {
  }

  ngOnInit() {
    if (this.userService.checkLoggedIn()) {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      this.userService.setUser(user);
    }
  }

  title = 'team_project';
}

// 1. Add registration form error info
// 2. Add http client to register user
// 3. Add registration form validation
// 4. Add registration form submit button
// 5. Add registration form success message
