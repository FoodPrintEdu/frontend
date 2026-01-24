import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {SubscriptionService} from '../service/subscription.service';

export const subscriptionGuard: CanActivateFn = async (route, state) => {
  const subService = inject(SubscriptionService)
  try {
    return subService.hasActiveSubscription();
  } catch (e) {
    return false;
  }

}

