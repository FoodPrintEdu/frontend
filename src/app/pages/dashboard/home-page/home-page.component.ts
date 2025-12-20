import {Component, OnInit} from '@angular/core';
import {UserResponse} from '../../../types/userTypes';
import {UserService} from '../../../service/user.service';
import {NgIf} from '@angular/common';
import {CardsComponent} from '../../../components/home/cards/cards.component';
import {RecentActivityComponent} from '../../../components/home/recent-activity/recent-activity.component';
import {AchievementsComponent} from '../../../components/home/achievements/achievements.component';
import {WeightChartComponent} from '../../../components/home/weight-chart/weight-chart.component';
import {DietService} from '../../../service/diet.service';
import {ClientDiet} from '../../../types/ClientDiet';

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
export class HomePageComponent implements OnInit {
  user: UserResponse;
  clientDiet: ClientDiet

  constructor(protected userService: UserService,
              private dietService: DietService) {}

  async ngOnInit() {

    this.user = this.userService.getCurrentUser();
    if (this.user) {
      this.clientDiet = (await this.dietService.getCurrentClientDiet()).data;
    }


  }

}
