import {effect, Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {UserService} from './user.service';
import {ApiResponse} from '../types/ApiResponse';
import {Offer} from '../types/Offer';
import {MarketplaceCheckoutItem, MarketplaceCheckoutResponseData} from '../types/marketplaceCheckoutTypes';
import {MarketplaceOrder} from '../types/marketplaceOrderTypes';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  private userId: string;

  constructor(private apiService: ApiService, private userService: UserService) {
    const currentUser = this.userService.getCurrentUser();
    this.userId = currentUser?.id;

    effect(async () => {
      const user = this.userService.getCurrentUser();
      if (user && user.id) {
        this.userId = user.id;
      }
    });
  }

  getAvailableOffers(filter?: { dietIngredientId?: number; dietIngredientName?: string }): Promise<ApiResponse<Offer[]>> {
    if (!this.userId) {
      throw new Error(
        'User ID not available. Please ensure user is logged in.'
      );
    }

    const queryParts = ['status=active'];
    if (filter?.dietIngredientId) {
      queryParts.push(`diet_ingredient_id=${filter.dietIngredientId}`);
    } else if (filter?.dietIngredientName) {
      queryParts.push(`diet_ingredient_name=${encodeURIComponent(filter.dietIngredientName)}`);
    }

    return this.apiService.get<ApiResponse<Offer[]>>(`/market/api/v1/offers?${queryParts.join('&')}`);
  }

  createOffer(newOffer: Offer): Promise<ApiResponse<Offer>> {
    if (!this.userId) {
      throw new Error(
        'User ID not available. Please ensure user is logged in.'
      );
    }

    return this.apiService.post<ApiResponse<Offer>>('/market/api/v1/offers', newOffer);
  }

  editOffer(offer: Offer): Promise<ApiResponse<Offer>> {
    if (!this.userId) {
      throw new Error(
        'User ID not available. Please ensure user is logged in.'
      );
    }

    return this.apiService.put<ApiResponse<Offer>>(`/market/api/v1/offers/${offer.id}`, offer);
  }

  archiveOffer(offer: Offer): Promise<ApiResponse<Offer>> {
    if (!this.userId) {
      throw new Error(
        'User ID not available. Please ensure user is logged in.'
      );
    }

    return this.apiService.post<ApiResponse<Offer>>(`/market/api/v1/offers/${offer.id}/archive`, null);
  }

  createCheckout(items: MarketplaceCheckoutItem[], successUrl: string, cancelUrl: string) {
    return this.apiService.post<ApiResponse<MarketplaceCheckoutResponseData>>('/market/api/v1/checkout', {
      items,
      success_url: successUrl,
      cancel_url: cancelUrl
    });
  }

  completeCheckout(orderId: string, sessionId: string) {
    return this.apiService.post('/market/api/v1/checkout/complete', {
      order_id: orderId,
      session_id: sessionId
    });
  }

  getOrders() {
    return this.apiService.get<ApiResponse<MarketplaceOrder[]>>('/market/api/v1/orders');
  }

}
