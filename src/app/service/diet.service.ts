import {effect, Injectable} from '@angular/core';
import {DailyClientDietSummaryObject,} from '../types/dietTypes';
import {UserService} from './user.service';
import {BehaviorSubject, filter} from 'rxjs';
import {ApiService} from './api.service';
import {ApiResponse} from '../types/ApiResponse';
import {ClientDiet} from '../types/ClientDiet';
import {Meal} from '../types/Meal';
import {DietPlan} from '../types/DietPlan';
import {Client} from '../types/Client';
import {NotificationService} from './notification.service';
import {formatDate} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DietService {
  private userId: string;
  private currentClientSubject = new BehaviorSubject<Client | null>(null);
  public currentClient$ = this.currentClientSubject.asObservable().pipe(filter(Boolean));
  private currentDailyDietSummarySubject = new BehaviorSubject<DailyClientDietSummaryObject[] | null>(null);
  public currentDailyDietSummary$ = this.currentDailyDietSummarySubject.asObservable();
  private clientDietSubject = new BehaviorSubject<ClientDiet | null>(null);
  public clientDiet$ = this.clientDietSubject.asObservable();

  private isLoadingClientData = false;
  private readonly LAST_NOTIFIED_DATE_KEY = 'last-goal-notification-date';
  private lastNotifiedDate: string | null = null;
  private today = new Date();
  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    const currentUser = this.userService.getCurrentUser();
    this.userId = currentUser?.id;
    this.lastNotifiedDate = localStorage.getItem(this.LAST_NOTIFIED_DATE_KEY);

    effect(async () => {
      const user = this.userService.getCurrentUser();
      if (user && user.id) {
        this.userId = user.id;
        await this.loadClientData();
        await this.loadClientDietData();
        await this.loadDailyDietSummary();
      } else {
        this.clearClientData();
      }
    });
  }

  getClientData(): Promise<ApiResponse<Client>> {
    if (!this.userId) {
      throw new Error(
        'User ID not available. Please ensure user is logged in.'
      );
    }

    return this.apiService.get<ApiResponse<Client>>(`/diet/api/v1/clients/${this.userId}`)
  }

  async setDietPreferences(dietPlan: DietPlan): Promise<ClientDiet> {
    const r = await this.apiService
      .put<ApiResponse<Client>>(
        `/diet/api/v1/clients/${this.userId}/update-fitness-data`,
        dietPlan);
    this.currentClientSubject.next(r.data);
    await this.loadClientDietData();
    return this.clientDietSubject.value;
  }

  async loadClientData(): Promise<void> {
    if (this.isLoadingClientData || !this.userId) {
      return;
    }

    this.isLoadingClientData = true;
    try {
      const dietData = await this.getClientData();
      this.currentClientSubject.next(dietData.data);
      this.isLoadingClientData = false;
    } catch (error) {
      console.error('Failed to load diet data', error);
      this.currentClientSubject.next(null);
      this.isLoadingClientData = false;
    }

  }

  getCurrentClientData(): Client | null {
    return this.currentClientSubject.value;
  }

  clearClientData(): void {
    this.currentClientSubject.next(null);
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
      this.checkDailyGoalAchievement(dailyDietData.data);
    } catch (err) {
      console.error('Failed to load daily diet summary', err);
      this.currentDailyDietSummarySubject.next(null);
    }
  }

  private checkDailyGoalAchievement(summaryData: DailyClientDietSummaryObject[]): void {
    if (!summaryData || summaryData.length === 0) {
      return;
    }

    const todaysDateString = formatDate(this.today, 'yyyy-MM-dd', 'en-US');
    const todaysStats = summaryData?.find(
      (item) => item.date === todaysDateString
    );
    console.log("TODAY!", todaysStats);
    console.log("lastNotifiedDate", this.lastNotifiedDate);

    if (!todaysStats) {
      return;
    }

    console.log("Achieved", todaysStats.dailyKcalGoalAchieved);

    if (
      todaysStats.date === todaysDateString &&
      todaysStats.dailyKcalGoalAchieved &&
      this.lastNotifiedDate !== todaysDateString
    ) {
      const clientDiet = this.clientDietSubject.value;
      if (clientDiet) {
        this.notificationService.notifyDayCompletion(
          Math.round(todaysStats.totalKcal),
          Math.round(clientDiet.dailyKcalTarget)
        );
        this.lastNotifiedDate = todaysDateString;
        localStorage.setItem(this.LAST_NOTIFIED_DATE_KEY, todaysDateString);
      }
    }
  }

  private async loadClientDietData(): Promise<void> {
    if (!this.userId) {
      return;
    }
    try {
      const clientDiet = await this.getCurrentClientDiet();
      this.clientDietSubject.next(clientDiet.data);
    } catch (err) {
      console.error('Failed to load client diet', err);
      this.clientDietSubject.next(null);
    }
  }
}
