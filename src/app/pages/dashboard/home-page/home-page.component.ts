import { Component } from '@angular/core';
import { UserResponse } from '../../../types/userTypes';
import { Observable } from 'rxjs';
import { UserService } from '../../../service/user.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { CardsComponent } from '../../../components/home/cards/cards.component';

@Component({
  selector: 'app-home-page',
  imports: [AsyncPipe, NgIf, CardsComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  user$!: Observable<UserResponse>;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.user$ = this.userService.getUser();
  }
}
