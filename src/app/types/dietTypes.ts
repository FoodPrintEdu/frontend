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

export type DailyClientDietSummaryResponse = {
  success: boolean;
  message: string;
  data: Array<{
    id: number;
    clientDiet: {
      id: number;
      diet: {
        id: number;
        name: string;
        description: string;
        kcalCriteria: 'LOW' | 'NORMAL' | 'HIGH';
        proteinCriteria: 'LOW' | 'NORMAL' | 'HIGH';
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
        createdAt: string; // ISO timestamp
        updatedAt: string; // ISO timestamp
        fitnessDataPresent: boolean;
      };
      maintainKcal: number;
      dailyKcalTarget: number;
      dailyProteinTarget: number;
      archived: boolean;
      createdAt: string; // ISO timestamp
      updatedAt: string; // ISO timestamp
      archivedAt: string; // ISO timestamp
    };
    date: string; // YYYY-MM-DD
    totalKcal: number;
    totalProtein: number;
    totalFats: number;
    totalCarbs: number;
    dailyKcalGoalAchieved: boolean;
    dailyProteinGoalAchieved: boolean;
  }>;
};
