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

export interface MealRequest {
  clientId: string;
  recipeId: number;
  numberOfServings: number;
}

export type MealResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
    clientDiet: {
      id: number;
      diet: {
        id: number;
        name: string;
        description: string;
        kcalCriteria: 'LOW' | 'NORMAL' | 'HIGH' | 'VERY_HIGH';
        proteinCriteria: 'NORMAL' | 'HIGH' | 'VERY_HIGH';
        type: 'STANDARD' | 'VEGETARIAN' | 'VEGAN';
      };
      client: {
        id: number;
        userId: string;
        sex: 'MALE' | 'FEMALE';
        age: number;
        weightInKg: number;
        heightInCm: number;
        activityLevel:
          | 'NO_ACTIVITY'
          | 'LOW_ACTIVITY'
          | 'MEDIUM_ACTIVITY'
          | 'HIGH_ACTIVITY'
          | 'ATHLETE_ACTIVITY';
        goal: 'CUT' | 'MAINTAIN' | 'MAINGAIN' | 'BULK';
        preferredDietType: 'STANDARD' | 'VEGETARIAN' | 'VEGAN';
        createdAt: string; // ISO date string
        updatedAt: string; // ISO date string
        fitnessDataPresent: boolean;
      };
      maintainKcal: number;
      dailyKcalTarget: number;
      dailyProteinTarget: number;
      archived: boolean;
      createdAt: string;
      updatedAt: string;
      archivedAt: string;
    };
    recipe: {
      id: number;
      name: string;
      cuisine: {
        id: number;
        name: string;
      };
      authorId: number;
      recipeIngredients: {
        id: number;
        recipeId: number;
        ingredientId: number;
        quantity: number;
        notes: string;
      }[];
      instructions: string;
      servings: number;
      time: number;
      difficulty: number;
      tags: string[];
      imgPath: string;
      createdAt: string;
      updatedAt: string;
      kcalPerServing: number;
      proteinPerServing: number;
      fatPerServing: number;
      carbsPerServing: number;
    };
    numberOfServings: number;
    kcal: number;
    protein: number;
    carbs: number;
    fats: number;
    date: string; // ISO date
  };
};
