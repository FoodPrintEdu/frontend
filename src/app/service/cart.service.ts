import {computed, Injectable, signal} from '@angular/core';
import {CartItem} from '../types/CartItem';
import {Offer} from '../types/Offer';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems = signal<CartItem[]>([]);

  totalItems = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));

  totalPriceCents = computed(() =>
    this.cartItems().reduce((acc, item) => acc + (item.quantity * item.offer.priceCents), 0)
  );

  addToCart(offer: Offer) {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.offer.id === offer.id);

    if (existingItem) {
      if (existingItem.quantity < offer.packCountRemaining) {
        this.updateQuantity(offer.id, existingItem.quantity + 1);
      }
    } else {
      this.cartItems.update(items => [...items, { offer, quantity: 1 }]);
    }
  }

  removeFromCart(offerId: string) {
    this.cartItems.update(items => items.filter(item => item.offer.id !== offerId));
  }

  updateQuantity(offerId: string, quantity: number) {
    this.cartItems.update(items =>
      items.map(item => {
        if (item.offer.id === offerId) {
          const max = item.offer.packCountRemaining;
          return { ...item, quantity: Math.min(Math.max(1, quantity), max) };
        }
        return item;
      })
    );
  }

  clearCart() {
    this.cartItems.set([]);
  }
}
