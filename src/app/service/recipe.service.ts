import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { RecipeResponse } from '../types/recipeTypes';
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
}
