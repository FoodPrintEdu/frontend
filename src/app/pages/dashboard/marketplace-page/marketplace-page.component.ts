import {Component, computed} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {
  MarketplaceCategoriesComponent
} from '../../../components/marketplace/marketplace-categories/marketplace-categories.component';
import {MarketplaceItemsComponent} from '../../../components/marketplace/marketplace-items/marketplace-items.component';
import {CartService} from '../../../service/cart.service';
import {MessageService} from 'primeng/api';
import {Sidebar} from 'primeng/sidebar';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {InputNumber} from 'primeng/inputnumber';
import {FormsModule} from '@angular/forms';
import {Divider} from 'primeng/divider';
import {ProgressBar} from 'primeng/progressbar';

@Component({
  selector: 'app-marketplace-page',
  imports: [
    ButtonModule,
    MarketplaceCategoriesComponent,
    MarketplaceItemsComponent,
    Sidebar,
    NgIf,
    NgForOf,
    CurrencyPipe,
    InputNumber,
    FormsModule,
    Divider,
    ProgressBar,
  ],
  providers: [MessageService],
  templateUrl: './marketplace-page.component.html',
  styleUrl: './marketplace-page.component.scss',
  standalone: true
})
export class MarketplacePageComponent {
  cartVisible: boolean = false;
  readonly freeShippingThresholdCents = 5000;
  constructor(private messageService: MessageService,
              protected cartService: CartService) {
  }

  placeOrder() {
    this.cartVisible = false;
    this.cartService.clearCart();
    this.messageService.add({severity: 'success', summary: 'Order placed successfully!'});
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
}
