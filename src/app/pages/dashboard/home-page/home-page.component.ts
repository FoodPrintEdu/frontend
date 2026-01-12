import {Component, OnInit} from '@angular/core';
import {UserResponse} from '../../../types/userTypes';
import {UserService} from '../../../service/user.service';
import {NgIf} from '@angular/common';
import {CardsComponent} from '../../../components/home/cards/cards.component';
import {AchievementsComponent} from '../../../components/home/achievements/achievements.component';
import {WeightChartComponent} from '../../../components/home/weight-chart/weight-chart.component';
import {DietService} from '../../../service/diet.service';
import {ClientDiet} from '../../../types/ClientDiet';
import {combineLatest, filter, from, Subscription} from 'rxjs';
import {Meal} from '../../../types/Meal';
import {DailyClientDietSummaryObject} from '../../../types/dietTypes';

@Component({
  selector: 'app-home-page',
  imports: [
    NgIf,
    CardsComponent,
    AchievementsComponent,
    WeightChartComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  standalone: true
})
export class HomePageComponent implements OnInit {
  user: UserResponse;
  clientDiet: ClientDiet;
  clientMeals: Meal[];
  clientDailySummary: DailyClientDietSummaryObject[];
  subscription: Subscription;

  constructor(protected userService: UserService,
              private dietService: DietService) {}

  async ngOnInit() {
    this.user = this.userService.getCurrentUser();
    if (this.user) {
      this.subscription = combineLatest({
        diet: this.dietService.clientDiet$.pipe(filter(d => !!d)),
        summary: this.dietService.currentDailyDietSummary$,
        meals: from(this.dietService.getMeals())
      })
        .subscribe(({ diet, summary, meals }) => {
          this.clientDiet = diet;
          this.clientDailySummary = summary;
          this.clientMeals = meals.data;
        });
    }
  }
}
