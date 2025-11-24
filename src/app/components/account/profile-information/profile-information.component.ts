import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../../service/user.service';
import { UserResponse } from '../../../types/userTypes';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-information',
  imports: [ButtonModule, NgIf, AsyncPipe],
  templateUrl: './profile-information.component.html',
  styleUrl: './profile-information.component.scss',
  standalone: true
})
export class ProfileInformationComponent {
  user!: UserResponse;

  constructor(private userService: UserService, private router: Router) {}

  navigateToCompleteProfile() {
    this.router.navigate(['/complete-form']);
  }

  ngOnInit() {
    this.user = this.userService.getUser();
  }
}
