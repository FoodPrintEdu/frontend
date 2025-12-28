import {Component, signal} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {IftaLabelModule} from 'primeng/iftalabel';
import {PasswordModule} from 'primeng/password';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {InvalidFieldDirective} from '../../directives/invalid-field.directive';
import {LoginResponse} from '../../types/authTypes';
import {Router} from '@angular/router';
import {UserService} from '../../service/user.service';
import {DialogService} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-login-form',
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    InputGroupAddonModule,
    InputGroupModule,
    IftaLabelModule,
    PasswordModule,
    FormsModule,
    InvalidFieldDirective,
  ],
  providers: [DialogService],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  standalone: true
})
export class LoginFormComponent {
  private apiUrl = environment.API_URL;
  loginForm: FormGroup;
  errorMessage = signal('');


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userService: UserService
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
          responseType: 'json',
        }
      )
      .subscribe({
        next: (response) => {
          this.userService.setTokens(
            response.access_token,
            response.refresh_token,
            response.token_type
          );
          this.clearErrorMessage();
          this.userService.setUser().subscribe(user => {
            this.router.navigate(['/account']);
          });



        },
        error: (err) => {
          console.error('Login failed', err);
          this.errorMessage.set('Login failed. Please try again.');
        },
      });
  }

}
