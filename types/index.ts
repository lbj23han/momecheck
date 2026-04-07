export type Gender = 'male' | 'female';
export type AgeGroup = '10s' | '20s' | '30s' | '40s' | '50s+';
export type ProteinLevel = 0 | 1 | 2 | 3; // 0=거의안챙김, 1=가끔, 2=의식적, 3=철저히
export type AlcoholLevel = 0 | 1 | 2 | 3; // 0=거의없음, 1=주1~2, 2=주3~4, 3=매일

export interface UserData {
  gender: Gender | null;
  ageGroup: AgeGroup | null;
  height: number | null; // cm
  weight: number | null; // kg
  activityLevel: number | null; // 1~9
  mealLevel: number | null; // 1~7
  proteinLevel: ProteinLevel | null;
  alcoholLevel: AlcoholLevel | null;
  goalLevel: number | null; // 1~6
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
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  impossible: boolean;
}

export type Step = 'intro' | 'basic' | 'activity' | 'diet' | 'goal' | 'result';
