import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {
  MealRequest,
  MealResponse,
  RecipeResponse,
} from '../types/recipeTypes';
import { UserService } from './user.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private userService: UserService) {}

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

    return this.http.get<RecipeResponse>(
      `${this.apiUrl}/diet/api/v1/recipes/for-client/${clientId}`,
      {
        headers: {
          Authorization: `${this.userService.TokenType} ${this.userService.Token}`,
        },
      }
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
