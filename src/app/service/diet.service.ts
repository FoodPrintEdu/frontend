import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DietRequest, DietResponse } from '../types/dietTypes';
import { UserService } from './user.service';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DietService {
  private apiUrl = environment.apiUrl;
  private userId;
  private clientId: number | null = null;

  // Add diet data management
  private currentDietDataSubject = new BehaviorSubject<DietResponse | null>(
    null
  );
  public currentDietData$ = this.currentDietDataSubject.asObservable();
  private isLoadingDietData = false;

  constructor(private http: HttpClient, private userService: UserService) {
    this.userId = this.userService.getCurrentUserId();

    // Subscribe to user changes to load diet data when user loads
    this.userService.currentUser$.subscribe((user) => {
      if (user && user.id) {
        this.userId = user.id;
        this.loadDietData();
      } else {
        this.clearDietData();
      }
    });
  }

  setClientId() {
    // Try to get client ID from cached diet data first
    const cachedDietData = this.getCurrentDietData();
    if (cachedDietData?.data?.id) {
      this.clientId = cachedDietData.data.id;
      return;
    }

    // If not in cache, load diet data which will set the client ID
    if (!this.userId) {
      throw new Error(
        'User ID not available. Please ensure user is logged in.'
      );
    }

    this.loadDietData();
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
    // Prevent multiple simultaneous loading attempts
    if (this.isLoadingDietData || !this.userId) {
      return;
    }

    this.isLoadingDietData = true;
    this.getDietData().subscribe({
      next: (response) => {
        this.currentDietDataSubject.next(response);
        if (response.data?.id) {
          this.clientId = response.data.id;
        }
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
    this.clientId = null;
  }

  updateDietData(dietData: DietRequest): Observable<DietResponse> {
    if (!this.clientId) {
      throw new Error(
        'Client ID not available. Please ensure user is logged in.'
      );
    }

    return new Observable((observer) => {
      this.http
        .put<DietResponse>(
          `${this.apiUrl}/diet/api/v1/clients/${this.clientId}/update-fitness-data`,
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
}
