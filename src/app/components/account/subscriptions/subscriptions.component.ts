import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogModule} from 'primeng/dialog';
import {ApiService} from '../../../service/api.service';
import {UserService} from '../../../service/user.service';
import {
  SubscriptionCheckoutResponse,
  SubscriptionPlan,
  UserSubscription
} from '../../../types/subscriptionTypes';

@Component({
  selector: 'app-subscriptions',
  imports: [CommonModule, DialogModule],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss',
  standalone: true
})
export class SubscriptionsComponent implements OnInit {
  plans: SubscriptionPlan[] = [];
  activeSubscription: UserSubscription | null = null;
  isLoading = true;
  isCheckoutLoading = false;
  isCancelLoading = false;
  errorMessage: string | null = null;
  showResultDialog = false;
  resultMessage = '';

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.checkCheckoutResult();
    await this.loadData();
  }

  getPlanName(planId: number) {
    const match = this.plans.find((plan) => plan.id === planId);
    return match ? match.name : `Plan #${planId}`;
  }

  formatPrice(price: number, interval: string) {
    const currency = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
    return `${currency} / ${interval}`;
  }

  async startCheckout(plan: SubscriptionPlan) {
    if (!plan.active) {
      return;
    }

    const userId = this.getUserId();
    if (!userId) {
      this.errorMessage = 'Unable to start checkout. Please sign in again.';
      return;
    }

    this.isCheckoutLoading = true;
    this.errorMessage = null;

    try {
      const {successUrl, cancelUrl} = this.buildRedirectUrls();
      const response = await this.apiService.post<SubscriptionCheckoutResponse>(
        '/subscription/api/v1/checkout/create',
        {
          plan_id: String(plan.id),
          user_id: userId,
          success_url: successUrl,
          cancel_url: cancelUrl
        }
      );

      if (response?.checkout_url) {
        window.location.href = response.checkout_url;
      } else {
        this.errorMessage = 'Checkout could not be started. Please try again.';
      }
    } catch (error) {
      console.error('Checkout error', error);
      this.errorMessage = 'Checkout could not be started. Please try again.';
    } finally {
      this.isCheckoutLoading = false;
    }
  }

  async cancelSubscription() {
    const userId = this.getUserId();
    if (!userId) {
      this.errorMessage = 'Unable to cancel subscription. Please sign in again.';
      return;
    }

    this.isCancelLoading = true;
    this.errorMessage = null;

    try {
      await this.apiService.post('/subscription/api/v1/me/cancel', {
        user_id: userId
      });
      this.resultMessage = 'Your subscription has been cancelled.';
      this.showResultDialog = true;
      await this.loadData();
    } catch (error) {
      console.error('Cancel subscription error', error);
      this.errorMessage = 'Unable to cancel the subscription right now.';
    } finally {
      this.isCancelLoading = false;
    }
  }

  private async loadData() {
    this.isLoading = true;
    this.errorMessage = null;

    const plansPromise = this.apiService.get<SubscriptionPlan[]>(
      '/subscription/api/v1/plans'
    );
    const subscriptionPromise = this.apiService.get<UserSubscription>(
      '/subscription/api/v1/me/plan'
    );

    try {
      this.plans = await plansPromise;
    } catch (error) {
      console.error('Failed to load subscription plans', error);
      this.errorMessage = 'Subscription plans are unavailable right now.';
    }

    try {
      const subscription = await subscriptionPromise;
      this.activeSubscription = subscription?.active ? subscription : null;
    } catch (error) {
      this.activeSubscription = null;
    } finally {
      this.isLoading = false;
    }
  }

  private checkCheckoutResult() {
    const status = this.route.snapshot.queryParamMap.get('subscription');
    if (!status) {
      return;
    }

    if (status === 'success') {
      this.resultMessage = 'Your subscription has been activated.';
    } else if (status === 'cancel') {
      this.resultMessage = 'Checkout was cancelled. You can try again anytime.';
    } else {
      return;
    }

    this.showResultDialog = true;
    this.router.navigate([], {
      queryParams: {
        subscription: null
      },
      queryParamsHandling: 'merge'
    });
  }

  private buildRedirectUrls() {
    const successPath = this.router.serializeUrl(
      this.router.createUrlTree(['/account'], {
        queryParams: {subscription: 'success'}
      })
    );
    const cancelPath = this.router.serializeUrl(
      this.router.createUrlTree(['/account'], {
        queryParams: {subscription: 'cancel'}
      })
    );

    return {
      successUrl: `${window.location.origin}${successPath}`,
      cancelUrl: `${window.location.origin}${cancelPath}`
    };
  }

  private getUserId(): string | null {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser?.id) {
      return currentUser.id;
    }

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      return null;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      return parsedUser?.id ?? null;
    } catch (error) {
      return null;
    }
  }
}
