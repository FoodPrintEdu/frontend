import { Injectable } from '@angular/core';
import {DailyClientDietSummaryObject} from '../types/dietTypes';
import {Meal} from '../types/Meal';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }


  calculateDietStreak(dailyData: DailyClientDietSummaryObject[]) {

    if (!dailyData || dailyData.length === 0) {
      return 0;
    }
    let streakNumber = 0;
    for (const dayData of dailyData.reverse()) {
      if (dayData.dailyKcalGoalAchieved) {
        streakNumber++;
      } else {
        break;
      }
    }
    return streakNumber;

  }

  calculateTotalPoints(dailyData: DailyClientDietSummaryObject[]) {
    if (!dailyData || dailyData.length === 0) {
      return 0;
    }
    let points = 0;
    let streakMultiplier = 0;
    for (const dayData of dailyData.reverse()) {
      if (dayData.dailyKcalGoalAchieved) {
        streakMultiplier++;
        points += 10 * streakMultiplier;
      } else {
        streakMultiplier = 0;
      }
    }
    return points;

  }

  getNumberOfUniqueRecipes(meals: Meal[]) {

    if (!meals || meals.length === 0) {
      return 0;
    }

    let usedIds = [];
    let uniqueNumber = 0;
    for (const meal of meals) {
      if (!usedIds.includes(meal.recipe.id)) {
        usedIds.push(meal.recipe.id);
        uniqueNumber++;
      }
    }
    return uniqueNumber;
  }

}
