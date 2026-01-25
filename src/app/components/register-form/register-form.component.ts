import {NgClass} from '@angular/common';
import {Component, signal} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {IftaLabelModule} from 'primeng/iftalabel';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {InvalidFieldDirective} from '../../directives/invalid-field.directive';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Checkbox} from 'primeng/checkbox';
import {tap, throwError} from 'rxjs';
import {LoginResponse} from '../../types/authTypes';
import {UserService} from '../../service/user.service';
import {catchError, switchMap} from 'rxjs/operators';

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
    Checkbox,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
  standalone: true
})
export class RegisterFormComponent {
  private apiUrl = environment.API_URL;
  registerForm: FormGroup;
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      marketplaceAccess: [false, Validators.required],
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
      role: this.registerForm.value.marketplaceAccess ? 'entrepreneur' : 'user',
    };

    const loginRequest = {
      email: userRequest.email,
      password: userRequest.password
    };

    this.http.post(`${this.apiUrl}/user/api/v1/auth/register`, userRequest)
      .pipe(
        tap(() => console.log('Registration successful, attempting auto-login...')),
        switchMap(() => {
          return this.http.post<LoginResponse>(
            `${this.apiUrl}/user/api/v1/auth/login`,
            loginRequest
          );
        }),
        tap((response) => {
          console.log('Auto-login successful');
          this.userService.setTokens(
            response.access_token,
            response.refresh_token,
            response.token_type
          );
        }),
        switchMap(() => {
          return this.userService.setUser();
        }),
        catchError((error) => {
          console.error('Error during registration flow:', error);
          if (error.url?.includes('register')) {
            return throwError(() => new Error('Registration failed: Email might be taken.'));
          } else if (error.url?.includes('login')) {
            this.router.navigate(['/login']);
            return throwError(() => new Error('Registration successful, but auto-login failed. Please log in manually.'));
          }
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (user) => {
          this.clearErrorMessage();
          console.log('Flow complete, user loaded:', user);
          this.router.navigate(['/']);
        },
        error: (err) => {
          const message = err.message || 'Something went wrong. Please try again.';
          this.errorMessage.set(message);
        }
      });
  }
}
