import { CalcResult, UserData } from "@/types";
import { calculate } from "./calculator";

export interface Insight {
  label: string; // "야식만 줄이면"
  delta: string; // "68일 단축" or "B → A"
  icon: string;
}

/** 현재 루틴 기준으로 컨텍스트 판정 문장 */
export function getVerdictLine(dDay: number): string {
  if (dDay <= 0) return "이미 달성한거 아닌가요? 유지만 하세요 🏆";
  if (dDay <= 45) return "한 달 반이면 됩니다. Keep Going! 🔥";
  if (dDay <= 90) return "지금 루틴이면 세 달이면 가능해요 ☀️";
  if (dDay <= 120) return "네 달 뒤엔 달라진 모습 기대됩니다 🌊";
  if (dDay <= 180) return "반년뒤엔 확실히 달라질 수 있어요 💪";
  if (dDay <= 365) return "내년을 목표로 잡으세요 📅";
  if (dDay <= 730) return "지금 당장 습관을 바꾸지 않으면 내년도 똑같습니다 😤";
  return "솔직히 지금 루틴으론 2년은 걸려요. 첫 번째 변화가 필요해요 🫡";
}

const GRADE_ORDER = ['F', 'D', 'C', 'B', 'A', 'S'] as const;

function gradeImproved(from: string, to: string): boolean {
  return GRADE_ORDER.indexOf(to as typeof GRADE_ORDER[number]) >
         GRADE_ORDER.indexOf(from as typeof GRADE_ORDER[number]);
}

export function generateInsights(data: UserData, base: CalcResult): Insight[] {
  const results: Insight[] = [];
  const baseDday = base.dDay;
  const baseGrade = base.grade;

  // 1. 운동 +2단계
  const actLevel = data.activityLevel ?? 1;
  if (actLevel <= 7) {
    const r = calculate(data, { activityLevel: actLevel + 2 });
    if (!r.impossible && r.dDay < baseDday) {
      const diff = baseDday - r.dDay;
      const gradeChanged = gradeImproved(baseGrade, r.grade);
      results.push({
        icon: "🏋️",
        label: `운동 +2단계 올리면`,
        delta: gradeChanged
          ? `${diff}일 단축 + ${baseGrade}→${r.grade} 등급 업`
          : `${diff}일 단축`,
      });
    }
  }

  // 2. 식사량 -1단계 (야식·과식 줄이기)
  const mealLevel = data.mealLevel ?? 4;
  if (mealLevel > 1) {
    const r = calculate(data, { mealLevel: mealLevel - 1 });
    if (!r.impossible && r.dDay < baseDday) {
      const diff = baseDday - r.dDay;
      const gradeChanged = gradeImproved(baseGrade, r.grade);
      results.push({
        icon: "🍽️",
        label: `식사량 한 단계만 줄이면`,
        delta: gradeChanged
          ? `${diff}일 단축 + ${baseGrade}→${r.grade} 등급 업`
          : `${diff}일 단축`,
      });
    }
  }

  // 3. 단백질 개선
  const proteinLevel = data.proteinLevel ?? 0;
  if (proteinLevel < 3) {
    const nextProtein = (proteinLevel + 1) as 0 | 1 | 2 | 3;
    const r = calculate(data, { proteinLevel: nextProtein });
    if (!r.impossible && r.dDay < baseDday) {
      const diff = baseDday - r.dDay;
      const gradeChanged = gradeImproved(baseGrade, r.grade);
      results.push({
        icon: "🥩",
        label: `단백질 한 단계 더 챙기면`,
        delta: gradeChanged
          ? `${diff}일 단축 + ${baseGrade}→${r.grade} 등급 업`
          : `${diff}일 단축`,
      });
    }
  }

  // 4. 술 끊기 (alcoholLevel > 0 일 때만)
  const alcoholLevel = data.alcoholLevel ?? 0;
  if (alcoholLevel > 0) {
    const r = calculate({ ...data, alcoholLevel: 0 });
    if (!r.impossible && r.dDay < baseDday) {
      const diff = baseDday - r.dDay;
      const gradeChanged = gradeImproved(baseGrade, r.grade);
      results.push({
        icon: "🚫",
        label: `술 끊으면`,
        delta: gradeChanged
          ? `${diff}일 단축 + ${baseGrade}→${r.grade} 등급 업`
          : `${diff}일 단축`,
      });
    }
  }

  // 최대 3개, 효과 큰 순
  return results
    .sort((a, b) => {
      const numA = parseInt(a.delta);
      const numB = parseInt(b.delta);
      return numB - numA;
    })
    .slice(0, 3);
}

/** 달성 여부 기준 단계 판정 뱃지 텍스트 */
export function getGradeBadge(grade: CalcResult["grade"]): string {
  const map: Record<string, string> = {
    S: "몸짱 달성 🏆",
    A: "몸짱 가능성 높음",
    B: "몸짱 가능성 있음",
    C: "현재 루틴론 어려움",
    D: "루틴 전면 수정 필요",
  };
  return map[grade] ?? grade;
}
