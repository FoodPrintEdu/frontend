import {Component, Input} from '@angular/core';
import {DietService} from '../../../service/diet.service';
import {DailyClientDietSummaryObject} from '../../../types/dietTypes';
import {CommonService} from '../../../service/common.service';
import {Meal} from '../../../types/Meal';

@Component({
  selector: 'app-achievements',
  imports: [],
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss'],
  standalone: true
})
export class AchievementsComponent {
  @Input() dailyClientDietSummary: DailyClientDietSummaryObject[];
  @Input() clientMeals: Meal[];

  constructor(private commonService: CommonService) {}

  getStreakNumber() {
    return this.commonService.calculateDietStreak(this.dailyClientDietSummary);
  }

  getNumberOfUniqueRecipes() {
    return this.commonService.getNumberOfUniqueRecipes(this.clientMeals);
  }


  getStreakAchievementCompletionPercent(numberOfDaysToAchieve: number) {
    return Math.round((this.getStreakNumber() / numberOfDaysToAchieve) * 100);
  }

  getRecipeAchievementCompletionPercent(numberOfRecipesToPrepare: number) {
    return Math.round((this.getNumberOfUniqueRecipes() / numberOfRecipesToPrepare) * 100);
  }
}
