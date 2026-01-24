import {Component, computed, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {MarketplaceItemsComponent} from '../../../components/marketplace/marketplace-items/marketplace-items.component';
import {CartService} from '../../../service/cart.service';
import {MessageService} from 'primeng/api';
import {Sidebar} from 'primeng/sidebar';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {InputNumber} from 'primeng/inputnumber';
import {FormsModule} from '@angular/forms';
import {Divider} from 'primeng/divider';
import {ProgressBar} from 'primeng/progressbar';
import {MarketplaceService} from '../../../service/marketplace.service';
import {Offer} from '../../../types/Offer';

@Component({
  selector: 'app-marketplace-page',
  imports: [
    ButtonModule,
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
export class MarketplacePageComponent implements OnInit {
  cartVisible: boolean = false;
  offers: Offer[];
  readonly freeShippingThresholdCents = 5000;
  constructor(private messageService: MessageService,
              protected cartService: CartService,
              private marketplaceService: MarketplaceService) {
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

  async ngOnInit(): Promise<void> {

    try {
      this.offers = (await this.marketplaceService.getAvailableOffers()).data;
    } catch (e) {
      this.offers = [];
    }


  }
}
