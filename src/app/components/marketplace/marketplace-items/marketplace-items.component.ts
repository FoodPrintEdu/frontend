import {Component, Input} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {Offer} from '../../../types/Offer';
import {CartService} from '../../../service/cart.service';
import {MessageService} from 'primeng/api';
import {Card} from 'primeng/card';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {Tag} from 'primeng/tag';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-marketplace-items',
  imports: [ButtonModule, Card, CurrencyPipe, Tag, Toast, NgForOf, NgIf],
  templateUrl: './marketplace-items.component.html',
  styleUrl: './marketplace-items.component.scss',
  standalone: true
})
export class MarketplaceItemsComponent {
  @Input() offers!: Offer[];

  constructor(private cartService: CartService, private messageService: MessageService) {}

  addItem(offer: Offer) {
    this.cartService.addToCart(offer);
    this.messageService.add({severity: 'success', summary: 'Added to cart', detail: offer.diet_ingredient_name});
  }
}
