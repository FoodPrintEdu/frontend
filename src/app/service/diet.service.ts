import { HttpClient } from '@angular/common/http';
import { Injectable, effect } from '@angular/core';
import {
  DailyClientDietSummaryResponse,
  DietRequest,
  DietResponse,
} from '../types/dietTypes';
import { UserService } from './user.service';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DietService {
  private apiUrl = environment.apiUrl;
  private userId: string;

  private currentDietDataSubject = new BehaviorSubject<DietResponse | null>(
    null
  );
  private currentDailyDietSummarySubject =
    new BehaviorSubject<DailyClientDietSummaryResponse | null>(null);

  public currentDailyDietSummary$ =
    this.currentDailyDietSummarySubject.asObservable();
  public currentDietData$ = this.currentDietDataSubject.asObservable();
  private isLoadingDietData = false;

  constructor(private http: HttpClient, private userService: UserService) {
    const currentUser = this.userService.getCurrentUser();
    this.userId = currentUser?.id;

    effect(() => {
      const user = this.userService.getCurrentUser();
      if (user && user.id) {
        this.userId = user.id;
        this.loadDietData();
        this.loadDailyDietSummary();
      } else {
        this.clearDietData();
      }
    });
  }

  getDietData(): Observable<DietResponse> {
    if (!this.userId) {
      throw new Error(
        'User ID not available. Please ensure user is logged in.'
      );
    }

    return this.http.get<DietResponse>(
      `${this.apiUrl}/diet/api/v1/clients/${this.userId}`,
      {
        headers: {
          Authorization: `${this.userService.TokenType} ${this.userService.Token}`,
        },
      }
    );
  }

  loadDietData(): void {
    if (this.isLoadingDietData || !this.userId) {
      return;
    }

    this.isLoadingDietData = true;
    this.getDietData().subscribe({
      next: (response) => {
        this.currentDietDataSubject.next(response);
        this.isLoadingDietData = false;
      },
      error: (err) => {
        console.error('Failed to load diet data', err);
        this.currentDietDataSubject.next(null);
        this.isLoadingDietData = false;
      },
    });
  }

  getCurrentDietData(): DietResponse | null {
    return this.currentDietDataSubject.value;
  }

  clearDietData(): void {
    this.currentDietDataSubject.next(null);
  }

  updateDietData(dietData: DietRequest): Observable<DietResponse> {
    if (!this.userId) {
      throw new Error(
        'Client ID not available. Please ensure user is logged in.'
      );
    }

    return new Observable((observer) => {
      this.http
        .put<DietResponse>(
          `${this.apiUrl}/diet/api/v1/clients/${this.userId}/update-fitness-data`,
          dietData,
          {
            headers: {
              'Content-Type': 'application/json',
              // Authorization: `${this.userService.TokenType} ${this.userService.Token}`,
            },
          }
        )
        .subscribe({
          next: (response) => {
            this.currentDietDataSubject.next(response);
            observer.next(response);
            observer.complete();
          },
          error: (err) => {
            observer.error(err);
          },
        });
    });
  }

  getDailyDietSummary(): Observable<DailyClientDietSummaryResponse> {
    if (!this.userId) {
      throw new Error(
        'Client ID not available. Please ensure user is logged in.'
      );
    }

    return this.http.get<DailyClientDietSummaryResponse>(
      `${this.apiUrl}/diet/api/v1/diet-stats/for-client/${this.userId}`,
      {
        headers: {
          Authorization: `${this.userService.TokenType} ${this.userService.Token}`,
        },
      }
    );
  }

  loadDailyDietSummary(): void {
    if (!this.userId) {
      return;
    }

    this.getDailyDietSummary().subscribe({
      next: (response) => {
        this.currentDailyDietSummarySubject.next(response);
      },
      error: (err) => {
        console.error('Failed to load daily diet summary', err);
        this.currentDailyDietSummarySubject.next(null);
      },
    });
  }
}
