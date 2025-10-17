import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../../service/user.service';
import { UserResponse } from '../../../types/userTypes';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-profile-information',
  imports: [ButtonModule, NgIf, AsyncPipe],
  templateUrl: './profile-information.component.html',
  styleUrl: './profile-information.component.scss',
})
export class ProfileInformationComponent {
  user$!: Observable<UserResponse>;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.user$ = this.userService.getUser();
  }
}
