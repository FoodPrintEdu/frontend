import {ClientDiet} from './ClientDiet';

export type DietResponse = {
  success: boolean;
  message: string;
  data: {
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
};

export type DietRequest = {
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
};

export type DailyClientDietSummaryObject = {

  id: number;
  clientDiet: ClientDiet,
  date: string; // YYYY-MM-DD
  totalKcal: number;
  totalProtein: number;
  totalFats: number;
  totalCarbs: number;
  dailyKcalGoalAchieved: boolean;
  dailyProteinGoalAchieved: boolean;

};
