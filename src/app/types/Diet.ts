export interface Diet {
  id: number;
  name: string;
  description: string;
  kcalCriteria: 'LOW' | 'NORMAL' | 'HIGH';
  proteinCriteria: 'LOW' | 'NORMAL' | 'HIGH';
  type: 'STANDARD' | 'VEGETARIAN' | 'VEGAN';
}
