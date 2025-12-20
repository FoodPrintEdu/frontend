import {Component} from '@angular/core';
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
  private dailyClientDietSummary: DailyClientDietSummaryObject[];
  private clientMeals: Meal[];

  constructor(private dietService: DietService,
              private commonService: CommonService) {}

  async ngOnInit() {


    this.dailyClientDietSummary = (await this.dietService.getDailyDietSummary()).data;
    this.clientMeals = (await this.dietService.getMeals()).data;


  }

  getStreakNumber() {
    return this.commonService.calculateDietStreak(this.dailyClientDietSummary);
  }

  getNumberOfUniqueRecipes() {

    if (!this.clientMeals || this.clientMeals.length === 0) {
      return 0;
    }

    let usedIds = [];
    let uniqueNumber = 0;
    for (const meal of this.clientMeals) {
      if (!usedIds.includes(meal.recipe.id)) {
        usedIds.push(meal.recipe.id);
        uniqueNumber++;
      }
    }
    return uniqueNumber;
  }


  getStreakAchievementCompletionPercent(numberOfDaysToAchieve: number) {
    return Math.round((this.getStreakNumber() / numberOfDaysToAchieve) * 100);
  }

  getRecipeAchievementCompletionPercent(numberOfRecipesToPrepare: number) {
    return Math.round((this.getNumberOfUniqueRecipes() / numberOfRecipesToPrepare) * 100);
  }
}
