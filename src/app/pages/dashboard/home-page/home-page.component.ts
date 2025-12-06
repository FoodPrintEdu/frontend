import {Component} from '@angular/core';
import {UserResponse} from '../../../types/userTypes';
import {UserService} from '../../../service/user.service';
import {NgIf} from '@angular/common';
import {CardsComponent} from '../../../components/home/cards/cards.component';
import {RecentActivityComponent} from '../../../components/home/recent-activity/recent-activity.component';
import {AchievementsComponent} from '../../../components/home/achievements/achievements.component';
import {WeightChartComponent} from '../../../components/home/weight-chart/weight-chart.component';

@Component({
  selector: 'app-home-page',
  imports: [
    NgIf,
    CardsComponent,
    RecentActivityComponent,
    AchievementsComponent,
    WeightChartComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  standalone: true
})
export class HomePageComponent {
  user!: UserResponse;

  constructor(protected userService: UserService) {}

}
