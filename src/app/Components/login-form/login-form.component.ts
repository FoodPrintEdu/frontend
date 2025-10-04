import { Component, inject, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IftaLabelModule } from 'primeng/iftalabel';
import { PasswordModule } from 'primeng/password';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { InvalidFieldDirective } from '../../directives/invalid-field.directive';
import { LoginResponse } from '../../types/auth/authTypes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  imports: [
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    InputGroupAddonModule,
    InputGroupModule,
    IftaLabelModule,
    PasswordModule,
    FormsModule,
    InvalidFieldDirective,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  private apiUrl = environment.apiUrl;
  loginForm: FormGroup;
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  private setErrorMessage(msg: string) {
    this.errorMessage.set(msg);
  }

  private clearErrorMessage() {
    this.errorMessage.set('');
  }

  checkField(dirty: boolean, invalid: boolean, name: string) {
    console.log(dirty, invalid, name);
    if (dirty && invalid) {
      this.setErrorMessage(`Please fill out ${name} correctly.`);
    } else {
      this.clearErrorMessage();
    }
  }
  onSubmit() {
    const userRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.http
      .post<LoginResponse>(
        `${this.apiUrl}/user/api/v1/auth/login`,
        userRequest,
        {
          headers: { 'Content-Type': 'application/json' },
          responseType: 'json', // 👈 change to 'text' if your backend returns plain text
        }
      )
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          localStorage.setItem('token_type', response.token_type);

          this.clearErrorMessage();

          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Login failed', err);
          this.errorMessage.set('Login failed. Please try again.');
        },
      });
  }
}
