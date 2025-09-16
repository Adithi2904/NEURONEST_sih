
export enum Goal {
  WeightLoss = 'weight-loss',
  WeightGain = 'weight-gain',
  Maintenance = 'maintenance',
  Medical = 'medical-needs',
}

export enum HealthConcern {
  Diabetes = 'diabetes',
  PreDiabetes = 'pre-diabetes',
  HighCholesterol = 'high-cholesterol',
  Hypertension = 'hypertension',
  Anemia = 'anemia',
  VitaminD_Deficiency = 'vitamin-d-deficiency',
  VitaminB12_Deficiency = 'vitamin-b12-deficiency',
  PCOS = 'pcos',
}

export interface User {
  name: string;
  goal: Goal;
  healthConcerns: HealthConcern[];
  details: string; // For other preferences or conditions not listed
  height: number; // in cm
  weight: number; // in kg
}

export interface NutrientInfo {
  calories: number;
  protein: number;
  carbs: {
    total: number;
    fiber: number;
    sugar: number;
  };
  fat: {
    total: number;
    saturated: number;
  };
  vitamins: { name: string; amount: string }[];
  mealName: string;
  sodium: number;
}

export interface Meal {
  id: string;
  date: string; // ISO string
  description: string;
  nutrients: NutrientInfo;
}

export interface WaterLog {
  [date: string]: number; // date as YYYY-MM-DD, value as number of glasses
}
