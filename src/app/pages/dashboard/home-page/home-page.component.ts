import {Component, OnInit} from '@angular/core';
import {UserResponse} from '../../../types/userTypes';
import {UserService} from '../../../service/user.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {CardsComponent} from '../../../components/home/cards/cards.component';
import {RecentActivityComponent} from '../../../components/home/recent-activity/recent-activity.component';
import {AchievementsComponent} from '../../../components/home/achievements/achievements.component';

@Component({
  selector: 'app-home-page',
  imports: [
    AsyncPipe,
    NgIf,
    CardsComponent,
    RecentActivityComponent,
    AchievementsComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  standalone: true
})
export class HomePageComponent implements OnInit {
  user!: UserResponse;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.user = this.userService.getUser();
  }
}
