import {Component, computed, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {MarketplaceItemsComponent} from '../../../components/marketplace/marketplace-items/marketplace-items.component';
import {CartService} from '../../../service/cart.service';
import {MessageService} from 'primeng/api';
import {Sidebar} from 'primeng/sidebar';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {InputNumber} from 'primeng/inputnumber';
import {FormsModule} from '@angular/forms';
import {Divider} from 'primeng/divider';
import {ProgressBar} from 'primeng/progressbar';
import {MarketplaceService} from '../../../service/marketplace.service';
import {Offer} from '../../../types/Offer';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastModule} from 'primeng/toast';
import {MarketplaceCheckoutItem} from '../../../types/marketplaceCheckoutTypes';
import {MarketplaceOrder} from '../../../types/marketplaceOrderTypes';
import {InputTextModule} from 'primeng/inputtext';
import {Ingredient} from '../../../types/recipeTypes';
import {IngredientService} from '../../../service/ingredient.service';

@Component({
  selector: 'app-marketplace-page',
  imports: [
    ButtonModule,
    MarketplaceItemsComponent,
    Sidebar,
    NgIf,
    NgForOf,
    CurrencyPipe,
    DatePipe,
    NgClass,
    InputNumber,
    InputTextModule,
    FormsModule,
    Divider,
    ProgressBar,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './marketplace-page.component.html',
  styleUrl: './marketplace-page.component.scss',
  standalone: true
})
export class MarketplacePageComponent implements OnInit {
  cartVisible: boolean = false;
  offers: Offer[] = [];
  readonly freeShippingThresholdCents = 5000;
  isCheckoutLoading = false;
  ordersVisible = false;
  ordersLoading = false;
  ordersLoaded = false;
  orders: MarketplaceOrder[] = [];
  ingredients: Ingredient[] = [];
  filteredIngredients: Ingredient[] = [];
  ingredientQuery = '';
  selectedIngredient: Ingredient | null = null;

  constructor(private messageService: MessageService,
              protected cartService: CartService,
              private marketplaceService: MarketplaceService,
              private ingredientService: IngredientService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  async startCheckout() {
    if (this.cartService.cartItems().length === 0 || this.isCheckoutLoading) {
      return;
    }

    this.isCheckoutLoading = true;

    try {
      const items: MarketplaceCheckoutItem[] = this.cartService.cartItems().map((item) => ({
        offer_id: item.offer.id,
        qty: item.quantity
      }));

      if (items.some((item) => !item.offer_id)) {
        throw new Error('Missing offer id for checkout');
      }

      const {successUrl, cancelUrl} = this.buildRedirectUrls();
      const response = await this.marketplaceService.createCheckout(items, successUrl, cancelUrl);
      const checkout = response?.data;

      if (!checkout?.checkout_url) {
        throw new Error('Checkout URL missing');
      }

      localStorage.setItem('marketCheckoutOrderId', checkout.order_id);
      localStorage.setItem('marketCheckoutSessionId', checkout.session_id);
      window.location.href = checkout.checkout_url;
    } catch (error) {
      console.error('Checkout failed', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Checkout failed',
        detail: 'Please try again in a moment.'
      });
    } finally {
      this.isCheckoutLoading = false;
    }
  }

  shippingProgress = computed(() => {
    const current = this.cartService.totalPriceCents();
    if (current >= this.freeShippingThresholdCents) return 100;
    return (current / this.freeShippingThresholdCents) * 100;
  });

  shippingMessage = computed(() => {
    const remaining = this.freeShippingThresholdCents - this.cartService.totalPriceCents();
    if (remaining <= 0) return 'You have unlocked Free Shipping!';
    return `Add ${(remaining / 100).toFixed(2)} PLN for Free Shipping`;
  });

  async ngOnInit(): Promise<void> {

    try {
      this.offers = (await this.marketplaceService.getAvailableOffers()).data;
    } catch (e) {
      this.offers = [];
    }

    try {
      this.ingredients = (await this.ingredientService.getAvailableIngredients()).data;
    } catch (e) {
      this.ingredients = [];
    }
    await this.applySearchFromQuery();
    await this.handleCheckoutReturn();

  }

  private async handleCheckoutReturn() {
    const status = this.route.snapshot.queryParamMap.get('market_checkout');
    if (!status) {
      return;
    }

    if (status === 'success') {
      const orderId = localStorage.getItem('marketCheckoutOrderId');
      const sessionId = localStorage.getItem('marketCheckoutSessionId');

      if (!orderId || !sessionId) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Checkout incomplete',
          detail: 'Missing checkout session information.'
        });
      } else {
        try {
          await this.marketplaceService.completeCheckout(orderId, sessionId);
          this.cartService.clearCart();
          try {
            await this.refreshOffers();
          } catch (e) {
            this.offers = this.offers ?? [];
          }
          await this.refreshOrdersIfVisible();
          this.messageService.add({
            severity: 'success',
            summary: 'Payment confirmed',
            detail: 'Your order has been placed.'
          });
        } catch (error) {
          console.error('Checkout completion failed', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Payment verification failed',
            detail: 'Please contact support if you were charged.'
          });
        }
      }
    } else if (status === 'cancel') {
      this.messageService.add({
        severity: 'info',
        summary: 'Checkout cancelled',
        detail: 'You can try again anytime.'
      });
    }

    localStorage.removeItem('marketCheckoutOrderId');
    localStorage.removeItem('marketCheckoutSessionId');

    this.router.navigate([], {
      queryParams: {market_checkout: null},
      queryParamsHandling: 'merge'
    });
  }

  private buildRedirectUrls() {
    const successPath = this.router.serializeUrl(
      this.router.createUrlTree(['/marketplace'], {
        queryParams: {market_checkout: 'success'}
      })
    );
    const cancelPath = this.router.serializeUrl(
      this.router.createUrlTree(['/marketplace'], {
        queryParams: {market_checkout: 'cancel'}
      })
    );

    return {
      successUrl: `${window.location.origin}${successPath}`,
      cancelUrl: `${window.location.origin}${cancelPath}`
    };
  }

  onIngredientQueryChange(value: string) {
    this.ingredientQuery = value;
    this.selectedIngredient = null;

    const query = value.trim().toLowerCase();
    if (!query) {
      this.filteredIngredients = [];
      return;
    }

    this.filteredIngredients = this.ingredients
      .filter((ingredient) => ingredient.name.toLowerCase().includes(query))
      .slice(0, 8);
  }

  async selectIngredient(ingredient: Ingredient) {
    this.selectedIngredient = ingredient;
    this.ingredientQuery = ingredient.name;
    this.filteredIngredients = [];
    await this.refreshOffers();
  }

  async clearIngredientFilter() {
    this.selectedIngredient = null;
    this.ingredientQuery = '';
    this.filteredIngredients = [];
    await this.refreshOffers();
  }

  async toggleOrders() {
    this.ordersVisible = !this.ordersVisible;
    if (this.ordersVisible) {
      await this.loadOrders();
    }
  }

  private async loadOrders(force = false) {
    if (this.ordersLoading || (this.ordersLoaded && !force)) {
      return;
    }

    this.ordersLoading = true;
    try {
      const response = await this.marketplaceService.getOrders();
      this.orders = response?.data ?? [];
      this.ordersLoaded = true;
    } catch (error) {
      console.error('Failed to load orders', error);
      this.orders = [];
    } finally {
      this.ordersLoading = false;
    }
  }

  private async refreshOrdersIfVisible() {
    if (!this.ordersVisible) {
      return;
    }
    await this.loadOrders(true);
  }

  private async refreshOffers() {
    try {
      if (this.selectedIngredient?.id) {
        this.offers = (await this.marketplaceService.getAvailableOffers({
          dietIngredientId: this.selectedIngredient.id
        })).data;
      } else if (this.ingredientQuery) {
        this.offers = (await this.marketplaceService.getAvailableOffers({
          dietIngredientName: this.ingredientQuery
        })).data;
      } else {
        this.offers = (await this.marketplaceService.getAvailableOffers()).data;
      }
    } catch (e) {
      this.offers = [];
    }
  }

  private async applySearchFromQuery() {
    const ingredientIdParam = this.route.snapshot.queryParamMap.get('ingredient_id');
    const ingredientNameParam = this.route.snapshot.queryParamMap.get('ingredient_name');

    if (ingredientIdParam) {
      const ingredientId = Number(ingredientIdParam);
      const match = this.ingredients.find((ingredient) => ingredient.id === ingredientId);
      if (match) {
        this.selectedIngredient = match;
        this.ingredientQuery = match.name;
        await this.refreshOffers();
        return;
      }
    }

    if (ingredientNameParam) {
      this.selectedIngredient = null;
      this.ingredientQuery = ingredientNameParam;
      await this.refreshOffers();
    }
  }
}
