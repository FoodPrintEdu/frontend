import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-login-page',
  imports: [LoginFormComponent, NgOptimizedImage, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  standalone: true
})
export class LoginPageComponent {
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    if (this.userService.checkLoggedIn()) {
      this.router.navigate(['/']);
    }
  }
}
