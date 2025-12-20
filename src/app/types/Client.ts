export interface Client {
  id: number;
  userId: number;
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
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  fitnessDataPresent: boolean;
}
