import { computed, effect, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import {
  SubscriptionCheckoutCompleteResponse,
  SubscriptionCheckoutResponse,
  SubscriptionPlan,
  UserSubscription
} from '../types/subscriptionTypes';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  userSubscription = signal<UserSubscription | null>(null);
  plans = signal<SubscriptionPlan[]>([]);
  isLoading = signal<boolean>(true);
  hasActiveSubscription = computed(() => !!this.userSubscription()?.active);

  constructor(
    private userService: UserService,
    private apiService: ApiService
  ) {
    effect(async () => {
      const user = this.userService.getCurrentUser();
      if (user && user.id) {
        await this.loadUserSubscriptionData();
      } else {
        this.clearUserSubscription();
      }
    });

    this.loadPlans();
  }


  async loadPlans() {
    try {
      const plans = await this.apiService.get<SubscriptionPlan[]>('/subscription/api/v1/plans');
      this.plans.set(plans);
    } catch (e) {
      console.error('Failed to load plans', e);
      this.plans.set([]);
    }
  }

  async loadUserSubscriptionData() {
    this.isLoading.set(true);
    try {
      const userSub = await this.apiService.get<UserSubscription>('/subscription/api/v1/me/plan');
      this.userSubscription.set(userSub);
    } catch (e) {
      this.userSubscription.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }

  async startCheckout(planId: string, userId: string, successUrl: string, cancelUrl: string): Promise<string | null> {
    const response = await this.apiService.post<SubscriptionCheckoutResponse>(
      '/subscription/api/v1/checkout/create',
      {
        plan_id: planId,
        user_id: userId,
        success_url: successUrl,
        cancel_url: cancelUrl
      }
    );
    return response?.checkout_url ?? null;
  }

  async completeCheckout(sessionId: string): Promise<void> {
    await this.apiService.post<SubscriptionCheckoutCompleteResponse>(
      '/subscription/api/v1/checkout/complete',
      { session_id: sessionId }
    );
    await this.loadUserSubscriptionData();
  }

  async cancelSubscription(userId: string): Promise<void> {
    await this.apiService.post('/subscription/api/v1/me/cancel', { user_id: userId });
    await this.loadUserSubscriptionData();
  }

  clearUserSubscription() {
    this.userSubscription.set(null);
    this.isLoading.set(false);
  }
}
