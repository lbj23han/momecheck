import {
  AGE_VALUES, ACTIVITY_COEFFICIENTS, MALE_INTAKE, FEMALE_INTAKE,
  MALE_TARGET_BF, FEMALE_TARGET_BF, PROTEIN_BONUS, ALCOHOL_PENALTY,
} from './constants';
import { UserData, CalcResult, BodyType, Grade } from '@/types';

function detectBodyType(
  gender: string,
  bmi: number,
  bodyFatPct: number,
  muscleMass: number,
  activityLevel: number,
): BodyType {
  const isMale = gender === 'male';

  // 운동형: 높은 활동량 + 낮은 체지방
  if (activityLevel >= 7 && bodyFatPct < (isMale ? 18 : 24)) return 'athletic';

  // 마른비만: BMI 정상(≤25)인데 체지방 높음
  if (bmi <= 25 && bodyFatPct > (isMale ? 25 : 33)) return 'lean_fat';

  // 숨은근육형: 체지방 낮은데 근육량도 적음(가벼운 체중)
  if (bodyFatPct < (isMale ? 15 : 22) && muscleMass < (isMale ? 28 : 18)) return 'hidden_muscle';

  // 고체지방형: 체지방 높고 BMI도 높음
  if (bmi > 27 && bodyFatPct > (isMale ? 28 : 35)) return 'high_fat';

  return 'normal';
}

function calcGrade(dDay: number): Grade {
  if (dDay <= 0) return 'S';
  if (dDay <= 90) return 'A';
  if (dDay <= 180) return 'B';
  if (dDay <= 365) return 'C';
  if (dDay <= 730) return 'D';
  return 'F';
}

export function calculate(data: UserData, overrides?: {
  activityLevel?: number;
  mealLevel?: number;
  proteinLevel?: number;
}): CalcResult {
  const { gender, ageGroup, height, weight, goalLevel } = data;

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

  // 체지방률 (Deurenberg BMI + 활동량 보정)
  const bmi = w / ((h / 100) ** 2);
  const rawBf = gender === 'male'
    ? 1.20 * bmi + 0.23 * age - 16.2
    : 1.20 * bmi + 0.23 * age - 5.4;

  const activityBfCorrection: Record<number, number> = {
    1: 0, 2: 0, 3: -1, 4: -1.5, 5: -2.5, 6: -3.5, 7: -5, 8: -7, 9: -9,
  };
  const bodyFatPct = Math.max(3, rawBf + (activityBfCorrection[activityLevel] ?? 0));

  // 골격근량
  const leanMass = w * (1 - bodyFatPct / 100);
  const muscleMass = leanMass * 0.5;

  // 체형 판단
  const bodyType = detectBodyType(gender!, bmi, bodyFatPct, muscleMass, activityLevel);

  // 목표 체지방률
  const targetBfMap = gender === 'male' ? MALE_TARGET_BF : FEMALE_TARGET_BF;
  const targetBodyFatPct = targetBfMap[goalLevel!];

  // 감량 필요량
  const weightToLose = Math.max(0, w * (bodyFatPct - targetBodyFatPct) / 100);

  // 비현실적 목표 체크
  const unrealisticGoal = weightToLose > 25 || (targetBodyFatPct < 10 && gender === 'female');

  // 이미 달성
  if (weightToLose <= 0) {
    return {
      bmr, tdee, estimatedIntake, bodyFatPct, muscleMass,
      targetBodyFatPct, weightToLose: 0, weeklyLossRate: 0,
      dDay: 0, grade: 'S', impossible: false, bodyType, unrealisticGoal,
    };
  }

  // 칼로리 적자
  const calDeficit = tdee - estimatedIntake;

  // 달성 불가 체크 (F등급)
  if (calDeficit <= 0 && goalLevel! >= 3) {
    return {
      bmr, tdee, estimatedIntake, bodyFatPct, muscleMass,
      targetBodyFatPct, weightToLose, weeklyLossRate: 0,
      dDay: 9999, grade: 'F', impossible: true, bodyType, unrealisticGoal,
    };
  }

  // 주당 감량 속도 기본값
  const baseRate = calDeficit / 7700;
  const proteinBonus = PROTEIN_BONUS[proteinLevel];
  const alcoholPenalty = ALCOHOL_PENALTY[alcoholLevel];

  // 고체지방 초반 가속: 체지방 30%(남)/35%(여) 초과 시 주당 +0.1kg
  const highFatBonus = (
    (gender === 'male' && bodyFatPct > 30) ||
    (gender === 'female' && bodyFatPct > 35)
  ) ? 0.1 : 0;

  // 고강도 운동 경험자 보수 보정: 정체기 반영
  const experiencePenalty = activityLevel >= 7 ? -0.05 : 0;

  const weeklyLossRate = Math.min(1.2, Math.max(0.1,
    baseRate + proteinBonus + alcoholPenalty + highFatBonus + experiencePenalty
  ));

  // D-day
  const weeks = weightToLose / weeklyLossRate;
  const dDay = Math.round(weeks * 7);

  const grade = calcGrade(dDay);

  return {
    bmr, tdee, estimatedIntake,
    bodyFatPct: Math.max(0, bodyFatPct),
    muscleMass, targetBodyFatPct, weightToLose,
    weeklyLossRate, dDay, grade,
    impossible: false, bodyType, unrealisticGoal,
  };
}
