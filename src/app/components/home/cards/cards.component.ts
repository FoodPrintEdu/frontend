import {formatDate, NgIf, NgOptimizedImage} from '@angular/common';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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
export class CardsComponent implements OnChanges {
  protected readonly Math = Math;

  @Input() clientDiet: ClientDiet;
  @Input() clientMeals: Meal[];
  @Input() dailyClientDietSummary: DailyClientDietSummaryObject[];

  today = new Date();
  todaysDateString = formatDate(this.today, 'yyyy-MM-dd', 'en-US');

  currentKcal: number = 0;
  targetKcal: number = 0;
  isGoalAchieved: boolean = false;
  areCaloriesExceeded: boolean = false;
  progressValue: number = 0;

  proteinCriteriaToStringMap: Map<string, string> = new Map([
    ['NORMAL', 'balanced'], ['HIGH', 'high'], ['VERY_HIGH', 'abundant'], ['LOW', 'moderate'],
  ]);
  kcalCriteriaToStringMap: Map<string, string> = new Map([
    ['NORMAL', 'balanced'], ['HIGH', 'high'], ['VERY_HIGH', 'abundant'], ['LOW', 'low'],
  ]);

  constructor(private commonService: CommonService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dailyClientDietSummary'] || changes['clientDiet']) {
      this.calculateTodaysStats();
    }
  }

  private calculateTodaysStats() {
    this.targetKcal = this.clientDiet?.dailyKcalTarget || 0;

    const todaysStats = this.dailyClientDietSummary?.find(
      (item) => item.date === this.todaysDateString
    );

    if (todaysStats) {
      this.currentKcal = Math.round(todaysStats.totalKcal);
      this.isGoalAchieved = todaysStats.dailyKcalGoalAchieved;
    } else {
      this.currentKcal = 0;
      this.isGoalAchieved = false;
    }

    this.areCaloriesExceeded = this.currentKcal > this.targetKcal;

    this.progressValue = this.targetKcal > 0
      ? (this.currentKcal / this.targetKcal) * 100
      : 0;
  }

  get isOverconsumption(): boolean {
    return this.areCaloriesExceeded && !this.isGoalAchieved;
  }

  getDietDescription(diet?: Diet) {
    if(!diet) return '';
    return `Healthy, ${this.kcalCriteriaToStringMap.get(diet.kcalCriteria)} in calories & ${this.proteinCriteriaToStringMap.get(diet.proteinCriteria)} in protein`
  }

  getStreakNumberString() {
    const streak = this.commonService.calculateDietStreak(this.dailyClientDietSummary);
    return streak === 1 ? `${streak} day` : `${streak} days`;
  }

  getStreakNumber() {
    return this.commonService.calculateDietStreak(this.dailyClientDietSummary);
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
