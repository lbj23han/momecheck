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

  if (activityLevel >= 7 && bodyFatPct < (isMale ? 18 : 24)) return 'athletic';
  if (bmi <= 25 && bodyFatPct > (isMale ? 25 : 33)) return 'lean_fat';
  if (bodyFatPct < (isMale ? 15 : 22) && muscleMass < (isMale ? 28 : 18)) return 'hidden_muscle';
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

/** 체중 기반 BMR 계산 (Mifflin-St Jeor) */
function calcBmr(gender: string, w: number, h: number, age: number): number {
  return gender === 'male'
    ? 10 * w + 6.25 * h - 5 * age + 5
    : 10 * w + 6.25 * h - 5 * age - 161;
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

  // ── BMR / TDEE ──────────────────────────────────────────────────────────────
  const bmr = calcBmr(gender!, w, h, age);
  const actCoef = ACTIVITY_COEFFICIENTS[activityLevel];
  const tdee = bmr * actCoef;

  // ── 섭취 칼로리 추정 ─────────────────────────────────────────────────────────
  const intakeMap = gender === 'male' ? MALE_INTAKE : FEMALE_INTAKE;
  const estimatedIntake = intakeMap[mealLevel];

  // ── 체지방률 (Deurenberg BMI 기반 + 활동량 보정) ──────────────────────────────
  const bmi = w / ((h / 100) ** 2);
  const rawBf = gender === 'male'
    ? 1.20 * bmi + 0.23 * age - 16.2
    : 1.20 * bmi + 0.23 * age - 5.4;

  // 활동량이 높을수록 근육량 많아 체지방률 낮아짐
  const activityBfCorrection: Record<number, number> = {
    1: 0, 2: 0, 3: -1, 4: -1.5, 5: -2.5, 6: -3.5, 7: -5, 8: -7, 9: -9,
  };
  const bodyFatPct = Math.max(3, rawBf + (activityBfCorrection[activityLevel] ?? 0));

  // ── 제지방 / 골격근 ─────────────────────────────────────────────────────────
  const fatFreeMass = w * (1 - bodyFatPct / 100);
  const muscleMass = fatFreeMass * 0.5;

  // ── 체형 판단 ───────────────────────────────────────────────────────────────
  const bodyType = detectBodyType(gender!, bmi, bodyFatPct, muscleMass, activityLevel);

  // ── 목표 체지방률 및 감량 필요량 ──────────────────────────────────────────────
  const targetBfMap = gender === 'male' ? MALE_TARGET_BF : FEMALE_TARGET_BF;
  const targetBodyFatPct = targetBfMap[goalLevel!];

  // 정확한 목표 체중 = 제지방 / (1 - 목표체지방율)
  // 이 방식이 단순 차이 계산보다 정확 (특히 체지방이 높을수록 차이 커짐)
  const targetTotalWeight = fatFreeMass / (1 - targetBodyFatPct / 100);
  const weightToLose = Math.max(0, w - targetTotalWeight);

  // ── 비현실적 목표 체크 ──────────────────────────────────────────────────────
  const unrealisticGoal = weightToLose > 25 || (targetBodyFatPct < 10 && gender === 'female');

  // ── 이미 달성 ───────────────────────────────────────────────────────────────
  if (weightToLose <= 0) {
    return {
      bmr, tdee, estimatedIntake, bodyFatPct, muscleMass,
      targetBodyFatPct, weightToLose: 0, weeklyLossRate: 0,
      dDay: 0, grade: 'S', impossible: false, bodyType, unrealisticGoal,
    };
  }

  // ── 1단계: 칼로리 적자 (현재 체중 기준) ──────────────────────────────────────
  const calDeficit = tdee - estimatedIntake;

  // ── 달성 불가 체크 ──────────────────────────────────────────────────────────
  if (calDeficit <= 0 && goalLevel! >= 3) {
    return {
      bmr, tdee, estimatedIntake, bodyFatPct, muscleMass,
      targetBodyFatPct, weightToLose, weeklyLossRate: 0,
      dDay: 9999, grade: 'F', impossible: true, bodyType, unrealisticGoal,
    };
  }

  // ── 2단계: TDEE 감소 보정 (체중 감소에 따른 TDEE 하락 반영) ────────────────────
  // 목표 체중에서의 BMR/TDEE를 계산해 평균을 사용
  // 감량 중반부터 칼로리 적자가 줄어드는 현실을 반영
  const finalBmr = calcBmr(gender!, targetTotalWeight, h, age);
  const finalTdee = finalBmr * actCoef;
  const avgTdee = (tdee + finalTdee) / 2;
  const avgDeficit = Math.max(0, avgTdee - estimatedIntake);

  // ── 3단계: 대사 적응 (Adaptive Thermogenesis) ──────────────────────────────
  // 칼로리 적자가 클수록 신체가 기초대사를 줄여 저항함 (연구 기반 10~22% 감소)
  let adaptationFactor: number;
  if (avgDeficit > 700) adaptationFactor = 0.78;
  else if (avgDeficit > 500) adaptationFactor = 0.83;
  else if (avgDeficit > 300) adaptationFactor = 0.88;
  else if (avgDeficit > 150) adaptationFactor = 0.93;
  else adaptationFactor = 0.97;

  const effectiveDeficit = avgDeficit * adaptationFactor;

  // ── 4단계: 나이 페널티 (30세 이후 대사 감소) ────────────────────────────────
  // 30세 이후 매 10년마다 약 2.5% 대사 감소
  const agePenaltyFactor = age > 30 ? 1 - (age - 30) * 0.0025 : 1.0;

  // ── 5단계: 단백질 / 음주 보정 ──────────────────────────────────────────────
  // 단백질: 근육 손실 억제 + TEF(열효과) 증가 → 실질 감량 속도 향상
  // 음주: 간이 알코올 대사 우선 처리 → 지방 산화 억제
  const proteinBonus = PROTEIN_BONUS[proteinLevel];
  const alcoholPenalty = ALCOHOL_PENALTY[alcoholLevel];

  // ── 6단계: 체중 기반 최대 주당 감량 상한 ──────────────────────────────────────
  // 현실적으로 체중의 0.7~0.8%/주 이상 빠지기 어려움 (근손실 없이)
  // BMI 높을수록 초반 감량 여유 있음
  const maxByWeightPct = bmi > 35 ? 0.009 : bmi > 30 ? 0.008 : bmi > 25 ? 0.007 : 0.006;
  const weeklyMax = w * maxByWeightPct;

  // ── 최종 주당 감량 속도 ─────────────────────────────────────────────────────
  const baseRate = effectiveDeficit / 7700;
  const weeklyLossRate = Math.min(weeklyMax, Math.max(0.05,
    (baseRate + proteinBonus + alcoholPenalty) * agePenaltyFactor
  ));

  // ── D-Day ────────────────────────────────────────────────────────────────────
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
