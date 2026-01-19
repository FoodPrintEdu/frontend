import {effect, Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {UserService} from './user.service';
import {ApiResponse} from '../types/ApiResponse';
import {Ingredient} from '../types/recipeTypes';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

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

  getAvailableIngredients(): Promise<ApiResponse<Ingredient[]>> {
    if (!this.userId) {
      throw new Error(
        'User ID not available. Please ensure user is logged in.'
      );
    }

    return this.apiService.get<ApiResponse<Ingredient[]>>('/diet/api/v1/ingredients');
  }

}
