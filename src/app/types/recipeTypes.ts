export interface Ingredient {
  id: number;
  name: string;
  category: string;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  imgPath: string;
  nutritionInfo: string[];
  createdAt: string;
  updatedAt: string;
  vegan: boolean;
  vegetarian: boolean;
}

export interface RecipeIngredient {
  id: number;
  ingredient: Ingredient;
  quantity: number;
  notes: string;
}

export interface Recipe {
  id: number;
  name: string;
  cuisineName: string;
  recipeIngredients: RecipeIngredient[];
  instructions: string;
  servings: number;
  time: number;
  difficulty: number;
  tags: string[];
  imgPath: string;
  authorId: number;
  proteinPerServing: number;
  fatPerServing: number;
  carbsPerServing: number;
  kcalPerServing: number;
}

export interface RecipeResponse {
  success: boolean;
  message: string;
  data: Recipe[];
}
