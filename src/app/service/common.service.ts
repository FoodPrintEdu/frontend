import { Injectable } from '@angular/core';
import {DailyClientDietSummaryObject} from '../types/dietTypes';

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

}
