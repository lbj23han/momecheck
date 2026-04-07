import { UserData, CalcResult, BodyType } from '@/types';

export interface FoodItem {
  name: string;
  amount: string;
  kcal: number;
  protein: number;
}

export interface DietPlan {
  title: string;
  kcalTarget: number;
  meals: { label: string; items: FoodItem[] }[];
  tip: string;
}

export interface ExercisePlan {
  title: string;
  schedule: string;
  items: string[];
  tip: string;
}

export interface RecommendationData {
  diet: DietPlan;
  exercise: ExercisePlan;
  warnings: string[];
  bodyTypeLabel: string;
  bodyTypeDesc: string;
}

// ─── 체형 라벨 ────────────────────────────────────────────────────────────────

const BODY_TYPE_META: Record<BodyType, { label: string; desc: string }> = {
  athletic:       { label: '운동형 💪',       desc: '근육량은 충분해요. 체지방 마무리 정리가 핵심.' },
  lean_fat:       { label: '마른비만형 😅',   desc: 'BMI는 정상인데 체지방이 높아요. 유산소보다 웨이트가 먼저.' },
  hidden_muscle:  { label: '숨은근육형 🫣',   desc: '체지방은 적지만 근육도 적어요. 근력 운동과 단백질이 핵심.' },
  high_fat:       { label: '고체지방형 🔴',   desc: '체지방이 높아요. 식단 개선만으로도 큰 변화가 가능해요.' },
  normal:         { label: '일반형 😐',       desc: '전형적인 생활체형이에요. 운동+식단 병행하면 빠르게 달라져요.' },
};

// ─── 식단 플랜 (칼로리 구간별) ────────────────────────────────────────────────

function getDietPlan(
  gender: string,
  tdee: number,
  calDeficit: number,
  goalLevel: number,
): DietPlan {
  const isMale = gender === 'male';
  const target = Math.max(1200, tdee - Math.min(700, calDeficit * 0.9));
  const targetRound = Math.round(target / 50) * 50;

  // 고목표(바디프로필급) 정밀 식단
  if (goalLevel >= 4) {
    return {
      title: `하루 ${targetRound.toLocaleString()}kcal · 고단백 정밀 식단`,
      kcalTarget: targetRound,
      meals: [
        {
          label: '아침',
          items: isMale ? [
            { name: '오트밀', amount: '80g', kcal: 300, protein: 10 },
            { name: '삶은달걀', amount: '3개', kcal: 210, protein: 18 },
            { name: '프로틴 쉐이크', amount: '1스쿱', kcal: 120, protein: 25 },
          ] : [
            { name: '오트밀', amount: '50g', kcal: 190, protein: 6 },
            { name: '삶은달걀', amount: '2개', kcal: 140, protein: 12 },
            { name: '그릭요거트', amount: '100g', kcal: 100, protein: 10 },
          ],
        },
        {
          label: '점심',
          items: isMale ? [
            { name: '현미밥', amount: '150g', kcal: 220, protein: 4 },
            { name: '닭가슴살 훈제', amount: '2팩', kcal: 220, protein: 46 },
            { name: '쌈채소 + 된장', amount: '1인분', kcal: 40, protein: 2 },
          ] : [
            { name: '현미밥', amount: '100g', kcal: 150, protein: 3 },
            { name: '닭가슴살 훈제', amount: '1팩', kcal: 110, protein: 23 },
            { name: '두부 반모', amount: '150g', kcal: 120, protein: 10 },
          ],
        },
        {
          label: '저녁',
          items: isMale ? [
            { name: '고구마', amount: '200g', kcal: 180, protein: 3 },
            { name: '참치캔', amount: '1캔', kcal: 130, protein: 28 },
            { name: '브로콜리', amount: '200g', kcal: 60, protein: 5 },
          ] : [
            { name: '고구마', amount: '150g', kcal: 135, protein: 2 },
            { name: '참치캔', amount: '1캔', kcal: 130, protein: 28 },
            { name: '방울토마토 + 샐러드', amount: '1그릇', kcal: 50, protein: 2 },
          ],
        },
        {
          label: '간식',
          items: isMale ? [
            { name: '바나나', amount: '1개', kcal: 90, protein: 1 },
            { name: '프로틴바 또는 쉐이크', amount: '1개', kcal: 150, protein: 20 },
          ] : [
            { name: '그릭요거트', amount: '150g', kcal: 140, protein: 14 },
            { name: '아몬드', amount: '15알', kcal: 90, protein: 3 },
          ],
        },
      ],
      tip: isMale
        ? '단백질 체중 × 2g 목표. 운동 후 30분 내 단백질 섭취가 핵심이에요.'
        : '단백질 체중 × 1.6g 목표. 야채는 양껏, 탄수화물은 운동 전후에 집중하세요.',
    };
  }

  // 일반 감량 식단
  return {
    title: `하루 ${targetRound.toLocaleString()}kcal · 균형 감량 식단`,
    kcalTarget: targetRound,
    meals: [
      {
        label: '아침',
        items: isMale ? [
          { name: '햇반', amount: '1개 (210g)', kcal: 340, protein: 5 },
          { name: '달걀프라이', amount: '2개', kcal: 180, protein: 12 },
          { name: '방울토마토', amount: '한 줌', kcal: 25, protein: 1 },
        ] : [
          { name: '오트밀', amount: '50g', kcal: 190, protein: 6 },
          { name: '달걀', amount: '1개', kcal: 70, protein: 6 },
          { name: '그릭요거트', amount: '100g', kcal: 100, protein: 10 },
        ],
      },
      {
        label: '점심',
        items: isMale ? [
          { name: '햇반', amount: '1개 (210g)', kcal: 340, protein: 5 },
          { name: '닭가슴살 훈제', amount: '1팩', kcal: 110, protein: 23 },
          { name: '나물 반찬', amount: '2가지', kcal: 80, protein: 3 },
        ] : [
          { name: '잡곡밥', amount: '100g', kcal: 150, protein: 3 },
          { name: '생선구이 or 두부', amount: '1인분', kcal: 150, protein: 15 },
          { name: '채소 반찬', amount: '2가지', kcal: 60, protein: 2 },
        ],
      },
      {
        label: '저녁',
        items: isMale ? [
          { name: '고구마', amount: '1개 (150g)', kcal: 135, protein: 2 },
          { name: '참치캔', amount: '1캔', kcal: 130, protein: 28 },
          { name: '계란', amount: '2개', kcal: 140, protein: 12 },
        ] : [
          { name: '고구마', amount: '100g', kcal: 90, protein: 1 },
          { name: '닭가슴살 or 참치캔', amount: '1팩/1캔', kcal: 110, protein: 23 },
          { name: '채소 샐러드', amount: '1그릇', kcal: 50, protein: 2 },
        ],
      },
      {
        label: '간식',
        items: isMale ? [
          { name: '바나나', amount: '1개', kcal: 90, protein: 1 },
          { name: '견과류', amount: '한 줌', kcal: 100, protein: 3 },
        ] : [
          { name: '그릭요거트', amount: '100g', kcal: 100, protein: 10 },
          { name: '과일', amount: '적당량', kcal: 80, protein: 1 },
        ],
      },
    ],
    tip: isMale
      ? '야식이 최대 적이에요. 저녁 8시 이후 식사를 끊는 것만으로도 큰 차이가 납니다.'
      : '폭식 유발 요인을 파악하세요. 배고프지 않은 폭식은 90%가 스트레스입니다.',
  };
}

// ─── 운동 플랜 ────────────────────────────────────────────────────────────────

function getExercisePlan(activityLevel: number, goalLevel: number, isMale: boolean): ExercisePlan {
  if (activityLevel <= 2) {
    return {
      title: '🚶 걷기부터 시작',
      schedule: '주 5일 · 하루 30분',
      items: [
        '하루 30분 빠른 걷기 (6~7km/h)',
        '엘리베이터 대신 계단 이용',
        '식후 10~15분 가볍게 걷기',
        '주말 1회 1시간 걷기',
      ],
      tip: '지금 단계에서는 유산소가 먼저입니다. 먼저 움직이는 습관부터 만드세요.',
    };
  }

  if (activityLevel <= 4) {
    return {
      title: '🏃 기초 체력 루틴',
      schedule: '주 4일 · 하루 45분',
      items: [
        '유산소 20분 (러닝머신 or 실외)',
        '스쿼트 3세트 × 15회',
        '플랭크 3세트 × 30초',
        '팔굽혀펴기 3세트 × 10회',
        '스트레칭 10분',
      ],
      tip: '근력 운동과 유산소를 반반 섞으세요. 근육이 붙으면 기초대사량이 올라가요.',
    };
  }

  if (activityLevel <= 6) {
    return {
      title: `🏋️ ${isMale ? '웨이트' : '근력+유산소'} 병행 루틴`,
      schedule: '주 4~5일',
      items: [
        isMale ? '월·수·금: 웨이트 (상체/하체/전신 순환)' : '월·수·금: 웨이트 + 코어',
        '화·목: 유산소 30~40분 (사이클 or 달리기)',
        '주 1회 이상: 스트레칭/폼롤러 회복',
        '운동 전: 가벼운 동적 스트레칭 5분',
        goalLevel >= 3 ? '운동 후: 프로틴 or 닭가슴살 바로 먹기' : '수분 보충 충분히',
      ],
      tip: '지금 단계에서 가장 중요한 건 꾸준함입니다. 강도보다 빈도가 먼저예요.',
    };
  }

  // 고강도
  return {
    title: `💥 ${isMale ? '3분할 웨이트' : '복합 운동'} 루틴`,
    schedule: '주 5~6일',
    items: [
      isMale ? '월: 가슴+삼두, 화: 등+이두' : '월: 하체+코어, 화: 상체+어깨',
      isMale ? '수: 어깨+복근, 목: 하체, 금: 전신' : '수: 휴식 or 유산소, 목: 전신 서킷',
      '매일 운동 후 유산소 15~20분 선택',
      '주 2회 고강도 인터벌(HIIT) 15분',
      goalLevel >= 4 ? '칼로리 사이클링 고려 (고탄+저탄 교대)' : '일관된 식단 유지',
    ],
    tip: isMale
      ? '3대 운동(벤치·스쿼트·데드) 기준 숫자 관리가 가장 확실한 지표예요.'
      : '웨이트가 두렵다면 빈 봉으로 자세부터 잡는 게 장기적으로 이득이에요.',
  };
}

// ─── 경고 메시지 ──────────────────────────────────────────────────────────────

function getWarnings(data: UserData, result: CalcResult): string[] {
  const warns: string[] = [];

  if (result.unrealisticGoal) {
    warns.push('⚠️ 목표가 다소 공격적이에요. 건강을 유지하면서 가려면 1~2단계 낮춰도 충분해요.');
  }

  if (result.bodyType === 'lean_fat') {
    warns.push('🫣 마른비만 패턴이에요. 체중보다 체지방률에 집중하세요. 유산소보다 웨이트가 먼저예요.');
  }

  if (result.bodyType === 'hidden_muscle') {
    warns.push('💡 체지방은 적지만 근육량이 부족한 패턴이에요. 단백질 섭취와 근력운동이 핵심입니다.');
  }

  if ((data.alcoholLevel ?? 0) >= 2) {
    warns.push('🍺 음주 빈도가 감량의 발목을 잡고 있어요. 주 1회 이하로 줄이면 결과가 빠르게 달라져요.');
  }

  if ((data.proteinLevel ?? 0) === 0 && (data.goalLevel ?? 1) >= 3) {
    warns.push('🥩 목표 대비 단백질 섭취가 너무 적어요. 근육 보존이 안 되면 체중만 빠지고 체형은 안 달라져요.');
  }

  const isMale = data.gender === 'male';
  if (result.estimatedIntake < (isMale ? 1400 : 1100)) {
    warns.push('🚨 현재 식사량이 너무 적어요. 과도한 절식은 근손실과 요요를 부릅니다.');
  }

  return warns;
}

// ─── 메인 export ──────────────────────────────────────────────────────────────

export function getRecommendation(data: UserData, result: CalcResult): RecommendationData {
  const isMale = data.gender === 'male';
  const calDeficit = result.tdee - result.estimatedIntake;

  const diet = getDietPlan(data.gender!, result.tdee, calDeficit, data.goalLevel ?? 1);
  const exercise = getExercisePlan(data.activityLevel ?? 1, data.goalLevel ?? 1, isMale);
  const warnings = getWarnings(data, result);
  const { label: bodyTypeLabel, desc: bodyTypeDesc } = BODY_TYPE_META[result.bodyType];

  return { diet, exercise, warnings, bodyTypeLabel, bodyTypeDesc };
}
