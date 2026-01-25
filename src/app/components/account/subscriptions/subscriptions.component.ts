import {Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogModule} from 'primeng/dialog';
import {SubscriptionService} from '../../../service/subscription.service';
import {UserService} from '../../../service/user.service';
import {SubscriptionPlan} from '../../../types/subscriptionTypes';
import {ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonDirective],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss'
})
export class SubscriptionsComponent implements OnInit {

  isCheckoutLoading = false;
  isCancelLoading = false;
  isVerifyingPayment = false;
  errorMessage = signal<string | null>(null);
  showResultDialog = false;
  resultMessage = '';

  constructor(
    public subscriptionService: SubscriptionService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {

    this.route.queryParams.subscribe(async (params) => {
      const sessionId = params['session_id'];

      if (sessionId && !this.isVerifyingPayment) {
        await this.handleCheckoutComplete(sessionId);
      }
    });
  }

  getPlanName(planId: number): string {
    const plans = this.subscriptionService.plans();
    const match = plans.find((plan) => plan.id === planId);
    return match ? match.name : `Plan #${planId}`;
  }

  formatPrice(price: number, interval: string): string {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(price) + ` / ${interval}`;
  }

  async startCheckout(plan: SubscriptionPlan) {
    if (!plan.active) return;

    const userId = this.getUserId();
    if (!userId) {
      this.errorMessage.set('Unable to start checkout. Please sign in again.');
      return;
    }

    this.isCheckoutLoading = true;
    this.errorMessage.set(null);

    try {
      const { successUrl, cancelUrl } = this.buildRedirectUrls();

      const checkoutUrl = await this.subscriptionService.startCheckout(
        String(plan.id),
        userId,
        successUrl,
        cancelUrl
      );

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error', error);
      this.errorMessage.set('Checkout could not be started. Please try again.');
      this.isCheckoutLoading = false;
    }
  }

  private async handleCheckoutComplete(sessionId: string) {
    this.isVerifyingPayment = true;
    this.errorMessage.set(null);

    try {
      await this.subscriptionService.completeCheckout(sessionId);

      this.resultMessage = 'Payment successful! Your subscription is now active.';
      this.showResultDialog = true;

      this.clearUrlParams();
    } catch (error) {
      console.error('Payment verification failed', error);
      this.errorMessage.set('We could not verify your payment. Please contact support.');
    } finally {
      this.isVerifyingPayment = false;
    }
  }

  async cancelSubscription() {
    const userId = this.getUserId();
    if (!userId) return;

    this.isCancelLoading = true;
    this.errorMessage.set(null);

    try {
      await this.subscriptionService.cancelSubscription(userId);
      this.resultMessage = 'Your subscription has been cancelled.';
      this.showResultDialog = true;
    } catch (error) {
      console.error('Cancel subscription error', error);
      this.errorMessage.set('Unable to cancel the subscription right now.');
    } finally {
      this.isCancelLoading = false;
    }
  }


  private buildRedirectUrls() {

    const baseUrl = window.location.origin + this.router.createUrlTree(['.'], { relativeTo: this.route }).toString();
    return {
      successUrl: `${baseUrl}?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}?subscription=cancel`
    };
  }

  private clearUrlParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true
    });
  }

  private getUserId(): string | null {
    return this.userService.getCurrentUser()?.id ?? null;
  }
}
