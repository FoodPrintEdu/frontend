import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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
export class MarketplaceItemsComponent implements OnInit, OnChanges{
  @Input() userId: string;
  @Input() offers: Offer[] = [];
  displayedOffers: Offer[]

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['offers']) {
      this.displayedOffers = this.offers.filter(offer => offer.seller_user_id !== this.userId);
    }
  }

  ngOnInit(): void {
    this.displayedOffers = this.offers.filter(offer => offer.seller_user_id !== this.userId);
    console.log("DISPLAYED OFFERS", this.displayedOffers);
    console.log(this.userId);
  }

  constructor(private cartService: CartService, private messageService: MessageService) {}

  addItem(offer: Offer) {
    this.cartService.addToCart(offer);
    this.messageService.add({severity: 'success', summary: 'Added to cart', detail: offer.diet_ingredient_name});
  }


}
