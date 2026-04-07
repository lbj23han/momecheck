import {
  AGE_VALUES, ACTIVITY_COEFFICIENTS, MALE_INTAKE, FEMALE_INTAKE,
  MALE_TARGET_BF, FEMALE_TARGET_BF, PROTEIN_BONUS, ALCOHOL_PENALTY,
} from './constants';
import { UserData, CalcResult } from '@/types';

export function calculate(data: UserData, overrides?: {
  activityLevel?: number;
  mealLevel?: number;
  proteinLevel?: number;
}): CalcResult {
  const {
    gender, ageGroup, height, weight, goalLevel,
  } = data;

  const activityLevel = overrides?.activityLevel ?? data.activityLevel!;
  const mealLevel = overrides?.mealLevel ?? data.mealLevel!;
  const proteinLevel = overrides?.proteinLevel ?? data.proteinLevel!;
  const alcoholLevel = data.alcoholLevel!;

  const age = AGE_VALUES[ageGroup!];
  const h = height!;
  const w = weight!;

  // BMR (Mifflin-St Jeor)
  const bmr = gender === 'male'
    ? 10 * w + 6.25 * h - 5 * age + 5
    : 10 * w + 6.25 * h - 5 * age - 161;

  // TDEE
  const actCoef = ACTIVITY_COEFFICIENTS[activityLevel];
  const tdee = bmr * actCoef;

  // 섭취 추정
  const intakeMap = gender === 'male' ? MALE_INTAKE : FEMALE_INTAKE;
  const estimatedIntake = intakeMap[mealLevel];

  // 체지방률 (Deurenberg BMI 공식 + 활동량 보정)
  // BMI 공식은 근육량 많은 사람에게 과대추정됨 → 활동량으로 보정
  const bmi = w / ((h / 100) ** 2);
  const rawBf = gender === 'male'
    ? 1.20 * bmi + 0.23 * age - 16.2
    : 1.20 * bmi + 0.23 * age - 5.4;
  const activityBfCorrection: Record<number, number> = {
    1: 0, 2: 0, 3: -1, 4: -1.5, 5: -2.5, 6: -3.5, 7: -5, 8: -7, 9: -9,
  };
  const bodyFatPct = rawBf + (activityBfCorrection[activityLevel] ?? 0);

  // 골격근량
  const leanMass = w * (1 - bodyFatPct / 100);
  const muscleMass = leanMass * 0.5;

  // 목표 체지방률
  const targetBfMap = gender === 'male' ? MALE_TARGET_BF : FEMALE_TARGET_BF;
  const targetBodyFatPct = targetBfMap[goalLevel!];

  // 감량 필요량
  const weightToLose = Math.max(0, w * (bodyFatPct - targetBodyFatPct) / 100);

  // 이미 달성
  if (weightToLose <= 0) {
    return {
      bmr, tdee, estimatedIntake, bodyFatPct, muscleMass,
      targetBodyFatPct, weightToLose: 0, weeklyLossRate: 0,
      dDay: 0, grade: 'S', impossible: false,
    };
  }

  // 칼로리 적자
  const calDeficit = tdee - estimatedIntake;

  // 달성 불가 체크
  if (calDeficit <= 0 && goalLevel! >= 3) {
    return {
      bmr, tdee, estimatedIntake, bodyFatPct, muscleMass,
      targetBodyFatPct, weightToLose, weeklyLossRate: 0,
      dDay: 9999, grade: 'D', impossible: true,
    };
  }

  // 주당 감량 속도
  const baseRate = calDeficit / 7700;
  const proteinBonus = PROTEIN_BONUS[proteinLevel];
  const alcoholPenalty = ALCOHOL_PENALTY[alcoholLevel];
  const weeklyLossRate = Math.min(1.0, Math.max(0.1, baseRate + proteinBonus + alcoholPenalty));

  // D-day
  const weeks = weightToLose / weeklyLossRate;
  const dDay = Math.round(weeks * 7);

  // 등급
  let grade: CalcResult['grade'];
  if (dDay <= 0) grade = 'S';
  else if (dDay <= 90) grade = 'A';
  else if (dDay <= 180) grade = 'B';
  else if (dDay <= 365) grade = 'C';
  else grade = 'D';

  return {
    bmr, tdee, estimatedIntake, bodyFatPct: Math.max(0, bodyFatPct),
    muscleMass, targetBodyFatPct, weightToLose, weeklyLossRate,
    dDay, grade, impossible: false,
  };
}
