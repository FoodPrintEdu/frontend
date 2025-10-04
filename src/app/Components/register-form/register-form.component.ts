import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InvalidFieldDirective } from '../../directives/invalid-field.directive';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  imports: [
    InputTextModule,
    FormsModule,
    InputGroupAddonModule,
    InputGroupModule,
    IftaLabelModule,
    PasswordModule,
    ReactiveFormsModule,
    InvalidFieldDirective,
    NgClass,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent {
  private apiUrl = environment.apiUrl;
  registerForm: FormGroup;
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
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
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: 'user',
    };

    this.http
      .post(`${this.apiUrl}/user/api/v1/auth/register`, userRequest, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'json', // 👈 change to 'text' if your backend returns plain text
      })
      .subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.clearErrorMessage();

          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration failed', err);
          this.errorMessage.set('Registration failed. Please try again.');
        },
      });
  }
}
