import {effect, Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {UserService} from './user.service';
import {ApiResponse} from '../types/ApiResponse';
import {Offer} from '../types/Offer';

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

  getAvailableOffers(): Promise<ApiResponse<Offer[]>> {
    if (!this.userId) {
      throw new Error(
        'User ID not available. Please ensure user is logged in.'
      );
    }

    return this.apiService.get<ApiResponse<Offer[]>>('/market/api/v1/offers?status=active');
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

}
