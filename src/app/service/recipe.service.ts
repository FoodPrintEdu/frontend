import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, from, of } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import {
  MealRequest,
  MealResponse,
  RecipeResponse,
} from '../types/recipeTypes';
import { UserService } from './user.service';
import { SyncService } from './sync.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = environment.API_URL;
  private readonly CACHE_KEY = 'recipes_cache';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private syncService: SyncService
  ) {}

  getRecipesForClient(): Observable<RecipeResponse> {
    const currentUser = this.userService.getCurrentUser();

    if (!currentUser?.id) {
      return throwError(
        () =>
          new Error('User ID not available. Please ensure user is logged in.')
      );
    }

    const clientId = currentUser.id;
    console.log('Making recipes API call for clientId:', clientId);

    if (!this.syncService.isOnline()) {
      console.log('Offline - fetching recipes from cache');
      return from(this.syncService.getOfflineData(this.CACHE_KEY)).pipe(
        switchMap(cachedData => {
          if (cachedData) {
            return of(cachedData);
          } else {
            return throwError(() => new Error('No connection and no data in cache'));
          }
        })
      );
    }

    return this.http.get<RecipeResponse>(
      `${this.apiUrl}/diet/api/v1/recipes/for-client/${clientId}`,
      {
        headers: {
          Authorization: `${this.userService.TokenType} ${this.userService.Token}`,
        },
      }
    ).pipe(
      tap(async (response) => {
        await this.syncService.saveOfflineData(this.CACHE_KEY, 'recipes', response);
        console.log('Saved recipes to cache');
      }),
      catchError((error) => {
        console.error('Error fetching recipes from API, trying cache:', error);
        return from(this.syncService.getOfflineData(this.CACHE_KEY)).pipe(
          switchMap(cachedData => {
            if (cachedData) {
              console.log('Returned recipes from cache');
              return of(cachedData);
            }
            return throwError(() => error);
          })
        );
      })
    );
  }

  cookRecipe(
    recipeId: number,
    numberOfServings: number
  ): Observable<MealResponse> {
    const currentUser = this.userService.getCurrentUser();

    if (!currentUser?.id) {
      return throwError(
        () =>
          new Error('User ID not available. Please ensure user is logged in.')
      );
    }

    const mealRequest: MealRequest = {
      clientId: currentUser.id,
      recipeId,
      numberOfServings,
    };

    console.log('Making meal log API call for:', mealRequest);

    return this.http.post<MealResponse>(
      `${this.apiUrl}/diet/api/v1/meals`,
      mealRequest,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${this.userService.TokenType} ${this.userService.Token}`,
        },
      }
    );
  }
}
