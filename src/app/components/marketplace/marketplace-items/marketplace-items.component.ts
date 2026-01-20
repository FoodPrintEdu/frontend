import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {Offer} from '../../../types/Offer';
import {CartService} from '../../../service/cart.service';
import {MessageService} from 'primeng/api';
import {Card} from 'primeng/card';
import {CurrencyPipe, NgForOf} from '@angular/common';
import {Tag} from 'primeng/tag';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-marketplace-items',
  imports: [ButtonModule, Card, CurrencyPipe, Tag, Toast, NgForOf],
  templateUrl: './marketplace-items.component.html',
  styleUrl: './marketplace-items.component.scss',
  standalone: true
})
export class MarketplaceItemsComponent {
  // todo demock
  offers: Offer[] = [
    { id: '1', dietIngredientId: 1, dietIngredientName: 'Organic Quinoa', priceCents: 1250, currency: 'PLN', packSizeG: 500, packCountRemaining: 15, packCountTotal: 100, status: 'active'},
    { id: '2', dietIngredientId: 2, dietIngredientName: 'Tofu Extra Firm', priceCents: 400, currency: 'PLN', packSizeG: 300, packCountRemaining: 5, packCountTotal: 100, status: 'active' },
    { id: '3', dietIngredientId: 3, dietIngredientName: 'Chia Seeds', priceCents: 890, currency: 'PLN', packSizeG: 250, packCountRemaining: 20, packCountTotal: 100, status: 'active' },
    { id: '4', dietIngredientId: 4, dietIngredientName: 'Almond Flour', priceCents: 1500, currency: 'PLN', packSizeG: 400, packCountRemaining: 0, packCountTotal: 100, status: 'active' },
    { id: '5', dietIngredientId: 5, dietIngredientName: 'Dried Lentils', priceCents: 350, currency: 'PLN', packSizeG: 1000, packCountRemaining: 50, packCountTotal: 100, status: 'active' },
  ];

  constructor(private cartService: CartService, private messageService: MessageService) {}

  addItem(offer: Offer) {
    this.cartService.addToCart(offer);
    this.messageService.add({severity: 'success', summary: 'Added to cart', detail: offer.dietIngredientName});
  }
}
