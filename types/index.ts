export type Gender = 'male' | 'female';
export type AgeGroup = '10s' | '20s' | '30s' | '40s' | '50s+';
export type ProteinLevel = 0 | 1 | 2 | 3;
export type AlcoholLevel = 0 | 1 | 2 | 3;
export type Grade = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
export type BodyType = 'athletic' | 'lean_fat' | 'hidden_muscle' | 'high_fat' | 'normal';

export interface UserData {
  gender: Gender | null;
  ageGroup: AgeGroup | null;
  height: number | null;
  weight: number | null;
  activityLevel: number | null; // 1~9
  mealLevel: number | null;     // 1~7
  proteinLevel: ProteinLevel | null;
  alcoholLevel: AlcoholLevel | null;
  goalLevel: number | null;     // 1~6
}

export interface CalcResult {
  bmr: number;
  tdee: number;
  estimatedIntake: number;
  bodyFatPct: number;
  muscleMass: number;
  targetBodyFatPct: number;
  weightToLose: number;
  weeklyLossRate: number;
  dDay: number;
  grade: Grade;
  impossible: boolean;
  bodyType: BodyType;
  unrealisticGoal: boolean;
}

export type Step = 'intro' | 'basic' | 'activity' | 'diet' | 'goal' | 'result';
