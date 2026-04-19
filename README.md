# 몸매체크 MomeCheck

**생활습관 기반 체지방 분석 · 목표 몸까지 D-Day 계산기**

> "내 생활습관으로 목표 몸까지 얼마나 걸릴까?" — 1분도 안 걸려요.

**서비스 URL:** https://momecheck.vercel.app

---

## 서비스 소개

MomeCheck는 별도 회원가입 없이, 몇 가지 질문에 답하면 현재 체지방률·TDEE·BMR을 추정하고 목표 체형까지의 예상 기간(D-Day)과 등급(S~F)을 알려주는 피트니스 시뮬레이터입니다.

남성(다크 테마)과 여성(화이트 테마)에 맞춘 UI/UX, 등급별 캐릭터 이미지, 생활습관 변화 시뮬레이터, 결과 공유 카드까지 포함되어 있습니다.

---

## 주요 기능

### 5단계 입력 플로우
| 단계 | 내용 |
|---|---|
| 기본 정보 | 성별, 연령대, 키, 체중 |
| 활동량 | 9단계 슬라이더 (화장실만 가는 수준 ~ 2분할 이상 관리) |
| 식습관 | 식사량 (7단계) · 단백질 섭취 · 음주 빈도 |
| 목표 | 배만 좀 들어갔으면 ~ 무대 올라가는 몸 (6단계) |
| 결과 | 등급 판정 + D-Day + 인사이트 + 시뮬레이터 |

### 계산 엔진 (`lib/calculator.ts`)
- **BMR**: Mifflin-St Jeor 공식
- **TDEE**: BMR × 활동 계수 (1.2 ~ 1.9, 9단계)
- **체지방률**: Deurenberg BMI 기반 + 활동량 보정
- **목표 체중**: 제지방량 기반 역산 (단순 차이 계산보다 정확)
- **감량 속도 6단계 보정**:
  1. 현재/목표 TDEE 평균으로 중간 시점 보정
  2. 대사 적응(Adaptive Thermogenesis) — 적자 규모에 따라 78~97% 효율
  3. 나이 페널티 — 30세 이후 10년당 2.5% 대사 감소
  4. 단백질 섭취 보너스 (TEF + 근손실 억제)
  5. 음주 페널티 (지방 산화 억제)
  6. 체중 대비 주당 최대 감량 상한 (BMI별 0.6~0.9%/주)

### 등급 시스템
| 등급 | D-Day 기준 | 설명 |
|---|---|---|
| S | 0일 | 이미 목표 달성 |
| A | ~90일 | 꽤 괜찮아요 |
| B | ~180일 | 관리는 해요 |
| C | ~365일 | 애매해요 |
| D | ~730일 | 아직 멀었어요 |
| F | 730일+ / 불가 | 지금부터가 시작 |

성별 × 등급별 캐릭터 이미지 12장 (`/grade-{S|A|B|C|D|F}-{m|f}.png`) 제공.

### 결과 화면 구성
1. **Hero 카드** — 등급 이미지 + 카피 + 목표/D-Day 배너
2. **변화 인사이트** — "이렇게만 바꿔도 X일 단축" (활동량/식단/단백질/음주 각각)
3. **식단·운동 추천 카드** — 체형·등급별 맞춤 텍스트
4. **생활습관 시뮬레이터** — 활동량/식사량/단백질 슬라이더를 바꾸면 D-Day 실시간 재계산
5. **추정 신체 스탯** — BMR, TDEE, 체지방률, 주당 감량 속도
6. **결과 공유 카드** — html2canvas로 이미지 저장/공유
7. **AI 업셀** — 개인 맞춤 상담 CTA
8. **크로스 프로모션** — 정책 지원금 서비스 링크
9. **Google AdSense** 배너

---

## 기술 스택

| 분류 | 내용 |
|---|---|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 애니메이션 | Framer Motion |
| 이미지 캡처 | html2canvas |
| 배포 | Vercel |
| 광고 | Google AdSense (`ca-pub-5992854033857462`) |

---

## 프로젝트 구조

```
momezing/
├── app/
│   ├── layout.tsx          # 메타데이터, OG, AdSense, Schema.org
│   ├── page.tsx            # 메인 스텝 라우터
│   ├── about/page.tsx      # 서비스 소개
│   ├── privacy/page.tsx    # 개인정보처리방침
│   ├── terms/page.tsx      # 이용약관
│   └── sitemap.ts          # 사이트맵 자동 생성
├── components/
│   ├── Intro.tsx           # 시작 화면
│   ├── StepBasic.tsx       # 기본 정보 입력
│   ├── StepActivity.tsx    # 활동량 입력
│   ├── StepDiet.tsx        # 식습관 입력
│   ├── StepGoal.tsx        # 목표 선택
│   ├── Result.tsx          # 결과 화면 (전체 구성)
│   ├── Simulator.tsx       # 슬라이더 시뮬레이터
│   ├── ShareCard.tsx       # 공유 이미지 카드
│   ├── RecoCard.tsx        # 식단/운동 추천
│   ├── AiUpsell.tsx        # AI 상담 CTA
│   ├── AdBanner.tsx        # Google AdSense 배너
│   ├── ChatBubble.tsx      # 말풍선 UI
│   └── CharacterIcon.tsx   # 캐릭터 아이콘
├── lib/
│   ├── calculator.ts       # 핵심 계산 엔진
│   ├── constants.ts        # 상수, 등급 메타, 옵션 텍스트
│   ├── insights.ts         # 변화 인사이트 생성
│   └── recommendations.ts  # 체형·등급별 추천 텍스트
└── public/
    ├── grade-{S|A|B|C|D|F}-{m|f}.png  # 등급×성별 캐릭터 12장
    ├── og-image.png
    └── logo.svg
```

---

## 로컬 개발

```bash
npm install
npm run dev
```

`http://localhost:3000`에서 확인.

---

## 배포

Vercel에 연결된 GitHub 레포지토리에 push하면 자동 배포됩니다.

```bash
npm run build   # 빌드 확인
```

---

## SEO / 메타

- OG 이미지, Twitter Card 설정 완료
- Schema.org `WebApplication` 구조화 데이터 포함
- Google Search Console 인증 완료
- 사이트맵 자동 생성 (`app/sitemap.ts`)
- Google AdSense 계정 연동 완료
