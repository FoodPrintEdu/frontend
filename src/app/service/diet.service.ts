import {effect, Injectable} from '@angular/core';
import {DailyClientDietSummaryObject, DietRequest, DietResponse,} from '../types/dietTypes';
import {UserService} from './user.service';
import {BehaviorSubject} from 'rxjs';
import {ApiService} from './api.service';
import {ApiResponse} from '../types/ApiResponse';
import {ClientDiet} from '../types/ClientDiet';
import {Meal} from '../types/Meal';

@Injectable({
  providedIn: 'root',
})
export class DietService {
  private userId: string;
  private currentDietDataSubject = new BehaviorSubject<DietResponse | null>(
    null
  );
  private currentDailyDietSummarySubject =
    new BehaviorSubject<DailyClientDietSummaryObject[] | null>(null);

  public currentDailyDietSummary$ =
    this.currentDailyDietSummarySubject.asObservable();
  public currentDietData$ = this.currentDietDataSubject.asObservable();
  private isLoadingDietData = false;

  constructor(private apiService: ApiService, private userService: UserService) {
    const currentUser = this.userService.getCurrentUser();
    this.userId = currentUser?.id;

    effect(async () => {
      const user = this.userService.getCurrentUser();
      if (user && user.id) {
        this.userId = user.id;
        await this.loadDietData();
        await this.loadDailyDietSummary();
      } else {
        this.clearDietData();
      }
    });
  }

  getDietData(): Promise<ApiResponse<DietResponse>> {
    if (!this.userId) {
      throw new Error(
        'User ID not available. Please ensure user is logged in.'
      );
    }

    return this.apiService.get<ApiResponse<DietResponse>>(`/diet/api/v1/clients/${this.userId}`)
  }

  async loadDietData(): Promise<void> {
    if (this.isLoadingDietData || !this.userId) {
      return;
    }

    this.isLoadingDietData = true;
    try {
      const dietData = await this.getDietData();
      this.currentDietDataSubject.next(dietData.data);
      this.isLoadingDietData = false;
    } catch (error) {
      console.error('Failed to load diet data', error);
      this.currentDietDataSubject.next(null);
      this.isLoadingDietData = false;
    }

  }

  getCurrentDietData(): DietResponse | null {
    return this.currentDietDataSubject.value;
  }

  clearDietData(): void {
    this.currentDietDataSubject.next(null);
  }

  updateDietData(dietData: DietRequest): Promise<ApiResponse<DietResponse>> {
    if (!this.userId) {
      throw new Error(
        'Client ID not available. Please ensure user is logged in.'
      );
    }

    return this.apiService
        .put<ApiResponse<DietResponse>>(
          `/diet/api/v1/clients/${this.userId}/update-fitness-data`,
          dietData,
        );

  }

  getCurrentClientDiet(): Promise<ApiResponse<ClientDiet>> {
    if (!this.userId) {
      throw new Error(
        'Client ID not available. Please ensure user is logged in.'
      );
    }

    return this.apiService.get<ApiResponse<ClientDiet>>(
      `/diet/api/v1/client-diets/${this.userId}`)

  }

  getDailyDietSummary(): Promise<ApiResponse<DailyClientDietSummaryObject[]>> {
    if (!this.userId) {
      throw new Error(
        'Client ID not available. Please ensure user is logged in.'
      );
    }

    return this.apiService.get<ApiResponse<DailyClientDietSummaryObject[]>>(
      `/diet/api/v1/diet-stats/for-client/${this.userId}`,
    );
  }

  getMeals(): Promise<ApiResponse<Meal[]>> {
    if (!this.userId) {
      throw new Error(
        'Client ID not available. Please ensure user is logged in.'
      );
    }

    return this.apiService.get<ApiResponse<Meal[]>>(
      `/diet/api/v1/meals/for-client/${this.userId}`,
    );
  }


  async loadDailyDietSummary(): Promise<void> {
    if (!this.userId) {
      return;
    }
    try {
      const dailyDietData = await this.getDailyDietSummary();
      this.currentDailyDietSummarySubject.next(dailyDietData.data);
    } catch (err) {
      console.error('Failed to load daily diet summary', err);
      this.currentDailyDietSummarySubject.next(null);
    }
  }
}
