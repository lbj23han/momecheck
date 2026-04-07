import { Gender, Grade } from '@/types';

export const AGE_VALUES: Record<string, number> = {
  '10s': 17, '20s': 25, '30s': 35, '40s': 45, '50s+': 55,
};

export const ACTIVITY_COEFFICIENTS: Record<number, number> = {
  1: 1.2, 2: 1.3, 3: 1.375, 4: 1.4, 5: 1.5,
  6: 1.55, 7: 1.65, 8: 1.75, 9: 1.9,
};

export const MALE_INTAKE: Record<number, number> = {
  1: 1300, 2: 1500, 3: 1700, 4: 2000, 5: 2400, 6: 2800, 7: 3200,
};
export const FEMALE_INTAKE: Record<number, number> = {
  1: 1000, 2: 1200, 3: 1400, 4: 1700, 5: 2000, 6: 2300, 7: 2700,
};

export const MALE_TARGET_BF: Record<number, number> = {
  1: 20, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8,
};
export const FEMALE_TARGET_BF: Record<number, number> = {
  1: 28, 2: 25, 3: 22, 4: 18, 5: 16, 6: 12,
};

export const PROTEIN_BONUS: Record<number, number> = {
  0: -0.05, 1: 0, 2: 0.05, 3: 0.1,
};
export const ALCOHOL_PENALTY: Record<number, number> = {
  0: 0, 1: -0.05, 2: -0.1, 3: -0.15,
};

// ─── Grade Meta ──────────────────────────────────────────────────────────────

export const GRADE_META: Record<Grade, {
  color: string;
  bgGlow: string;
  label: string;
  copy: string;
  feedback: string;
}> = {
  S: {
    color: '#FFD700',
    bgGlow: 'rgba(255,215,0,0.12)',
    label: '이미 몸짱',
    copy: '이미 몸짱 아니세요? 🏆',
    feedback: '현재 체형, 남들이 부러워하는 수준이에요. 유지만 잘 해도 충분합니다.',
  },
  A: {
    color: '#00C9A7',
    bgGlow: 'rgba(0,201,167,0.12)',
    label: '꽤 괜찮아요',
    copy: '솔직히 꽤 괜찮아요 💪',
    feedback: '조금만 더 밀어붙이면 완성형이에요. 마무리가 중요한 시점.',
  },
  B: {
    color: '#4FC3F7',
    bgGlow: 'rgba(79,195,247,0.10)',
    label: '관리는 해요',
    copy: '관리하는 티는 나요 🔵',
    feedback: '기본기는 갖췄어요. 루틴을 조금만 타이트하게 잡으면 결과가 달라집니다.',
  },
  C: {
    color: '#FFB74D',
    bgGlow: 'rgba(255,183,77,0.10)',
    label: '애매해요',
    copy: '애매해서 아쉬워요 😬',
    feedback: '한 발짝만 더 나가면 확실히 달라지는 구간이에요. 지금이 분기점.',
  },
  D: {
    color: '#EF5350',
    bgGlow: 'rgba(239,83,80,0.10)',
    label: '아직 멀었어요',
    copy: '이건 아니에요... 😤',
    feedback: '솔직히 지금 루틴으론 어렵습니다. 딱 한 가지만이라도 바꿔보세요.',
  },
  F: {
    color: '#9E9E9E',
    bgGlow: 'rgba(158,158,158,0.08)',
    label: '지금이 시작점',
    copy: '지금부터가 진짜 시작이에요 🫡',
    feedback: '목표가 높거나 현재 루틴이 너무 부족해요. 작은 것 하나씩 바꾸는 게 먼저예요.',
  },
};

/** 등급 이미지 경로: /grade-A-m.png 또는 /grade-A-f.png */
export function gradeImageSrc(grade: Grade, gender: 'male' | 'female'): string {
  return `/grade-${grade}-${gender === 'male' ? 'm' : 'f'}.png`;
}

// ─── Activity / Meal / Protein Options ────────────────────────────────────────

export const ACTIVITY_OPTIONS: Record<Gender, string[]> = {
  male: [
    '화장실 갈 때만 일어남',
    '출퇴근이 유일한 이동, 집에선 눕는 게 취미',
    '주말엔 침대에서 핸드폰만 봄',
    '홈트 유튜브 틀어놓고 보기만 함',
    '홈트 하루 10~20분, 꾸준하진 않음',
    '헬스장 등록은 했는데 주 1~2회',
    '주 3회, 한 번 가면 1시간은 함',
    '주 5회 이상, 3대 운동 숫자 올리는 중',
    '쉬는 날이 더 불안함, 2분할 이상 관리 중',
  ],
  female: [
    '하루 종일 앉아있음, 몸 쓸 일 없음',
    '출퇴근 걷는 게 전부',
    '주말 카페 가는 게 외출의 전부',
    '유튜브 홈트 보다가 끄는 편',
    '홈트 하루 10~20분, 띄엄띄엄',
    '필라테스·요가 주 1~2회',
    '헬스장 주 3회, 유산소 위주',
    '웨이트 + 유산소 병행, 주 5회',
    '운동 빠지면 하루가 이상함, 루틴 철저히 관리',
  ],
};

export const ACTIVITY_REACTIONS: string[] = [
  '…화장실은 가시죠? 😂',
  '출퇴근도 운동이죠 뭐 😅',
  '주말 휴식도 중요하죠',
  '보는 것도 반은 한 거예요 👀',
  '홈트라도 하시는구나 👍',
  '등록이 어렵지 가는 건 쉬워요 💪',
  '꽤 진지하시네요 🔥',
  '3대 숫자가 어떻게 되세요? 😏',
  '이미 몸짱 아닌가요? 🏆',
];

export const MEAL_OPTIONS: Record<Gender, string[]> = {
  male: [
    '밥 먹는 게 귀찮음, 대충 때움',
    '한 끼는 꼭 굶거나 거름',
    '세끼 챙기지만 양은 적음',
    '그냥 보통, 잘 모르겠음',
    '고기 나오면 리필함',
    '회식하면 항상 마지막까지 먹음',
    '야식 없으면 잠 못 잠',
  ],
  female: [
    '조금만 먹어도 배부름, 잔반 많음',
    '다이어트 중, 의식적으로 줄이는 중',
    '먹고 싶은 거 참는 편',
    '그냥 보통, 과식은 잘 안함',
    '잘 먹는다는 말 들음',
    '스트레스 받으면 폭식하는 편',
    '먹는 게 최대 행복, 참는 게 더 힘듦',
  ],
};

export const PROTEIN_OPTIONS = ['거의 안챙김', '가끔 먹음', '의식적으로 챙김', '철저히 관리'];
export const ALCOHOL_OPTIONS = ['거의 없음', '주 1~2회', '주 3~4회', '거의 매일'];

export const GOAL_OPTIONS: Record<Gender, string[]> = {
  male: [
    '배만 좀 들어갔으면',
    '셔츠 핏 나오는 몸',
    '수영장에서 눈치 안보이는 몸',
    '바디프로필 찍을 수 있는 몸',
    '식스팩 선명하게',
    '무대 올라가는 몸',
  ],
  female: [
    '그냥 좀 가벼워지고 싶음',
    '슬림한 라인 잡기',
    '탄탄하고 건강한 몸',
    '바디프로필 찍을 수 있는 몸',
    '복근 라인 보이게',
    '무대 올라가는 몸',
  ],
};

// Legacy (used in ShareCard, Simulator)
export const GRADE_COMMENTS: Record<string, string> = {
  S: '이미 몸짱아닌가요? 🏆',
  A: '조금만 더요. 진짜로 💪',
  B: '하반기엔 달라진 모습 기대해도 됩니다 🔥',
  C: '내년 여름을 노리세요 📅',
  D: '지금 당장 바꾸지 않으면 내후년도 똑같습니다 😤',
  F: '지금부터가 진짜 시작이에요. 한 가지만 바꿔보세요 🫡',
};
