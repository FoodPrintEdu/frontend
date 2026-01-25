import {Component, computed, Input} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {UserService} from '../../../service/user.service';
import {NgIf} from '@angular/common';
import {DailyClientDietSummaryObject} from '../../../types/dietTypes';
import {CommonService} from '../../../service/common.service';
import {Meal} from '../../../types/Meal';
import {ClientDiet} from '../../../types/ClientDiet';
import {SubscriptionService} from '../../../service/subscription.service';

@Component({
  selector: 'app-profile-information',
  imports: [ButtonModule, NgIf],
  templateUrl: './profile-information.component.html',
  styleUrl: './profile-information.component.scss',
  standalone: true
})
export class ProfileInformationComponent {
  @Input() currentDiet: ClientDiet;
  @Input() dailyClientDietSummary: DailyClientDietSummaryObject[];
  @Input() meals: Meal[];

  constructor(protected userService: UserService, private commonService: CommonService,
              protected subscriptionService: SubscriptionService) {
  }

  subLabel = computed(() => {
    const sub = this.subscriptionService.userSubscription();
    if (!sub || !sub.active) {
      return 'Free Tier';
    }

    const plans = this.subscriptionService.plans();
    const currentPlan = plans.find(p => p.id === sub.plan_id);

    return currentPlan ? currentPlan.name : 'Premium Member';
  });


  getCurrentDayStreak() {
    return this.commonService.calculateDietStreak(this.dailyClientDietSummary);
  }

  getTotalPoints() {
    return this.commonService.calculateTotalPoints(this.dailyClientDietSummary);
  }

  getPreparedRecipesCount() {
    return this.commonService.getNumberOfUniqueRecipes(this.meals);
  }

  getDietLabel(): string {
    const type = this.currentDiet?.diet.type;
    if (!type) {
      return '';
    }
    const lower = type.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
}
