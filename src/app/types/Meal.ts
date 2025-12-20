import {ClientDiet} from './ClientDiet';
import {Recipe} from './recipeTypes';

export interface Meal {
  id: number;
  clientDiet: ClientDiet;
  recipe: Recipe;
  numberOfServings: number;
  kcal: number;
  protein: number;
  carbs: number;
  fats: number;
  date: string;
}
