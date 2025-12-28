import {NgIf, NgOptimizedImage} from '@angular/common';
import {Component, Input} from '@angular/core';
import {ProgressBarModule} from 'primeng/progressbar';
import {ToastModule} from 'primeng/toast';
import {ClientDiet} from '../../../types/ClientDiet';
import {Diet} from '../../../types/Diet';
import {DailyClientDietSummaryObject} from '../../../types/dietTypes';
import {Meal} from '../../../types/Meal';
import {CommonService} from '../../../service/common.service';

@Component({
  selector: 'app-cards',
  imports: [ProgressBarModule, ToastModule, NgOptimizedImage, NgIf],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
  standalone: true
})
export class CardsComponent {
  protected readonly Math = Math;
  @Input() clientDiet: ClientDiet;
  @Input() clientMeals: Meal[];
  @Input() dailyClientDietSummary: DailyClientDietSummaryObject[];
  today = new Date();
  todaysDateString = `${this.today.getFullYear()}-${this.today.getMonth() + 1}-${this.today.getDate()}`;
  proteinCriteriaToStringMap: Map<string, string> = new Map([
    ['NORMAL', 'balanced'],
    ['HIGH', 'high'],
    ['VERY_HIGH', 'abundant'],
    ['LOW', 'moderate'],

  ]);
  kcalCriteriaToStringMap: Map<string, string> = new Map([
    ['NORMAL', 'balanced'],
    ['HIGH', 'high'],
    ['VERY_HIGH', 'abundant'],
    ['LOW', 'low'],

  ]);


  constructor(private commonService: CommonService) {
  }

  getDietDescription(diet?: Diet) {
    return `Healthy, ${this.kcalCriteriaToStringMap.get(diet.kcalCriteria)} in calories & ${this.proteinCriteriaToStringMap.get(diet.proteinCriteria)} in protein`
  }

  getStreakNumber() {
    return this.commonService.calculateDietStreak(this.dailyClientDietSummary);
  }

  getTodaysCalories() {
    if (!this.dailyClientDietSummary || this.dailyClientDietSummary.length === 0) {
      return 0;
    }

    const todayStats = this.dailyClientDietSummary.find(
      (item) => item.date === this.todaysDateString
    );
    if (!todayStats) {
      return 0;
    }
    return Math.round(todayStats.totalKcal);
  }

  getTodaysMealNumber() {

    if (!this.clientMeals || this.clientMeals.length === 0) {
      return 0;
    }
    const todayMeals = this.clientMeals.filter(
      (item) => item.date === this.todaysDateString
    );

    return todayMeals ? todayMeals.length : 0;

  }


}
