'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CalcResult, UserData } from '@/types';
import { GRADE_META, GOAL_OPTIONS, gradeImageSrc } from '@/lib/constants';
import { getVerdictLine, generateInsights, getGradeBadge } from '@/lib/insights';
import { getRecommendation } from '@/lib/recommendations';
import Simulator from './Simulator';
import ShareCard from './ShareCard';
import AdBanner from './AdBanner';
import RecoCard from './RecoCard';
import AiUpsell from './AiUpsell';

interface Props {
  result: CalcResult;
  data: UserData;
  onReset: () => void;
}

/** D-Day를 "약 3개월" 같은 자연어로 변환 */
function humanDday(dDay: number): string {
  if (dDay <= 0) return '이미 달성!';
  if (dDay < 14) return `약 ${dDay}일`;
  if (dDay < 60) return `약 ${Math.round(dDay / 7)}주`;
  if (dDay < 365) return `약 ${Math.round(dDay / 30)}개월`;
  const years = Math.floor(dDay / 365);
  const months = Math.round((dDay % 365) / 30);
  return months > 0 ? `약 ${years}년 ${months}개월` : `약 ${years}년`;
}

function StatRow({ label, value, isMale }: { label: string; value: string; isMale: boolean }) {
  return (
    <div className={`flex justify-between items-center py-2 border-b last:border-b-0 ${isMale ? 'border-zinc-700' : 'border-pink-100'}`}>
      <span className={`text-xs ${isMale ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</span>
      <span className={`text-xs font-bold ${isMale ? 'text-zinc-200' : 'text-zinc-700'}`}>{value}</span>
    </div>
  );
}

export default function Result({ result, data, onReset }: Props) {
  const isMale = data.gender === 'male';
  const meta = GRADE_META[result.grade];
  const goalText = GOAL_OPTIONS[data.gender!][(data.goalLevel ?? 1) - 1];
  const verdictLine = getVerdictLine(result.dDay);
  const insights = generateInsights(data, result);
  const reco = getRecommendation(data, result);

  return (
    <div className="flex flex-col min-h-[100dvh] overflow-y-auto px-4 pt-6 pb-12 space-y-4">

      {/* ① HERO 카드 ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl overflow-hidden relative ${isMale ? 'bg-zinc-900' : 'bg-white border border-pink-100'}`}
        style={{ boxShadow: `0 0 48px ${meta.bgGlow}` }}
      >
        {/* 배경 광채 */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 75% 30%, ${meta.color}18 0%, transparent 65%)` }} />

        {/* 결과 라벨 */}
        <div className={`relative px-5 pt-4 pb-1 text-sm font-black tracking-widest ${isMale ? 'text-zinc-400' : 'text-zinc-500'}`}>
          결과
        </div>

        {/* 등급 이미지 */}
        <div className="relative w-full h-[344px]">
          <Image
            src={gradeImageSrc(result.grade, data.gender!)}
            alt={`${result.grade}등급 캐릭터`}
            fill
            priority
            className="object-contain"
          />
        </div>

        <div className="relative px-5 pt-4">
          {/* 등급 + 카피 */}
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: meta.color }}>
                {getGradeBadge(result.grade)}
              </div>
              <div className="text-7xl font-black leading-none" style={{ color: meta.color }}>
                {result.grade}
              </div>
            </div>
            <div className={`text-[10px] font-bold tracking-widest pb-1 ${isMale ? 'text-zinc-600' : 'text-zinc-400'}`}>
              생활습관 기반 추정 결과
            </div>
          </div>

          <div className={`text-base font-black leading-snug mb-1 ${isMale ? 'text-white' : 'text-zinc-800'}`}>
            {meta.copy}
          </div>
          <div className={`text-xs leading-relaxed mb-4 ${isMale ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {meta.feedback}
          </div>

          {/* 목표 + D-Day 배너 */}
          <div className={`flex items-center justify-between rounded-xl px-4 py-3 mb-5 ${isMale ? 'bg-zinc-800' : 'bg-pink-50'}`}>
            <div>
              <div className={`text-[10px] mb-0.5 ${isMale ? 'text-zinc-500' : 'text-zinc-400'}`}>목표</div>
              <div className={`text-xs font-bold ${isMale ? 'text-zinc-300' : 'text-zinc-600'}`}>{goalText}</div>
            </div>
            <div className="text-right">
              {result.impossible ? (
                <div className={`text-sm font-bold ${isMale ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  지금 루틴으론 어려워요
                </div>
              ) : (
                <>
                  <div className={`text-[10px] mb-0.5 ${isMale ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    예상 기간
                  </div>
                  <div className="text-xl font-black" style={{ color: meta.color }}>
                    {humanDday(result.dDay)}
                  </div>
                  <div className={`text-[10px] ${isMale ? 'text-zinc-600' : 'text-zinc-400'}`}>
                    D-{result.dDay > 0 ? result.dDay.toLocaleString() : '0'}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 판정 문장 */}
          <div className={`pb-5 text-sm font-semibold ${isMale ? 'text-zinc-300' : 'text-zinc-600'}`}>
            {verdictLine}
          </div>
        </div>

        {/* 비현실적 목표 경고 */}
        {result.unrealisticGoal && (
          <div className="px-5 pb-4">
            <div className="text-[11px] rounded-xl px-3 py-2 bg-orange-500/10 text-orange-400">
              ⚠️ 목표가 다소 공격적이에요. 건강하게 가려면 1~2단계 낮춰도 충분합니다.
            </div>
          </div>
        )}
      </motion.div>

      {/* ② 변화 인사이트 ─────────────────────────────────────────────────────── */}
      {insights.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`rounded-2xl p-5 ${isMale ? 'bg-zinc-800' : 'bg-pink-50'}`}>
          <div className={`text-xs font-black uppercase tracking-wider mb-3 ${isMale ? 'text-zinc-500' : 'text-pink-400'}`}>
            이렇게만 바꿔도
          </div>
          <div className="space-y-2">
            {insights.map((ins, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }}
                className={`flex items-center justify-between rounded-xl px-4 py-3 ${isMale ? 'bg-zinc-700' : 'bg-white border border-pink-100'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{ins.icon}</span>
                  <span className={`text-xs ${isMale ? 'text-zinc-300' : 'text-zinc-600'}`}>{ins.label}</span>
                </div>
                <span className="text-xs font-black" style={{ color: meta.color }}>{ins.delta}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ③ 추천 카드 (식단 / 운동 / 주의) ─────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <RecoCard reco={reco} isMale={isMale} />
      </motion.div>

      {/* ④ 시뮬레이터 ────────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Simulator data={data} baseResult={result} isMale={isMale} />
      </motion.div>

      {/* ⑤ 현재 스탯 (숫자) ──────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className={`rounded-2xl p-5 ${isMale ? 'bg-zinc-800' : 'bg-pink-50'}`}>
        <div className={`text-xs font-black uppercase tracking-wider mb-3 ${isMale ? 'text-zinc-500' : 'text-pink-400'}`}>
          추정 신체 스탯
        </div>
        <StatRow label="추정 체지방률" value={`${result.bodyFatPct.toFixed(1)}%`} isMale={isMale} />
        <StatRow label="목표 체지방률" value={`${result.targetBodyFatPct}%`} isMale={isMale} />
        <StatRow label="감량 필요량" value={`약 ${result.weightToLose.toFixed(1)}kg`} isMale={isMale} />
        <StatRow label="주당 예상 감량" value={`${result.weeklyLossRate.toFixed(2)}kg`} isMale={isMale} />
        <StatRow label="기초대사량 (BMR)" value={`${Math.round(result.bmr)} kcal`} isMale={isMale} />
        <StatRow label="하루 소비칼로리 (TDEE)" value={`${Math.round(result.tdee)} kcal`} isMale={isMale} />
        <div className={`text-[10px] mt-3 ${isMale ? 'text-zinc-600' : 'text-zinc-400'}`}>
          * BMI 기반 추정값 + 활동량 보정. 참고용 결과예요.
        </div>
      </motion.div>

      {/* ⑥ 공유 카드 ─────────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <ShareCard result={result} data={data} isMale={isMale} insights={insights} />
      </motion.div>

      {/* ⑦ AI 업셀 카드 ──────────────────────────────────────────────────────── */}
      <AiUpsell isMale={isMale} />

      {/* ⑧ 재방문 / 재시작 ────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        className={`rounded-2xl p-5 ${isMale ? 'bg-zinc-800' : 'bg-pink-50'}`}>
        <div className={`text-sm font-black mb-1 ${isMale ? 'text-white' : 'text-zinc-800'}`}>
          2주 뒤 다시 체크해봐요 💪
        </div>
        <div className={`text-xs mb-4 ${isMale ? 'text-zinc-400' : 'text-zinc-500'}`}>
          체중·운동량이 달라졌다면 결과도 달라져요. 2주 후 재측정해서 변화를 확인해보세요.
        </div>
        <button
          onClick={onReset}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
            isMale
              ? 'bg-zinc-700 text-zinc-200 hover:bg-zinc-600'
              : 'bg-white border border-pink-200 text-pink-600 hover:bg-pink-50'
          }`}
        >
          처음부터 다시 계산하기 →
        </button>
      </motion.div>

      {/* ⑨ 정책 지원금 크로스 프로모션 */}
      <motion.a
        href="https://findmymoney.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`flex items-center justify-between rounded-2xl px-5 py-4 transition-all active:scale-95 ${
          isMale
            ? 'bg-zinc-800 hover:bg-zinc-700'
            : 'bg-pink-50 border border-pink-100 hover:bg-pink-100'
        }`}
      >
        <div>
          <div className={`text-[10px] mb-0.5 ${isMale ? 'text-zinc-500' : 'text-zinc-400'}`}>혹시 궁금하시다면</div>
          <div className={`text-sm font-bold ${isMale ? 'text-zinc-200' : 'text-zinc-700'}`}>나에게 맞는 정책 지원금이 있을까요?</div>
        </div>
        <span className={`text-lg ${isMale ? 'text-zinc-500' : 'text-pink-300'}`}>→</span>
      </motion.a>

      {/* ⑩ 광고 배너 */}
      <AdBanner className="rounded-xl" />

      {/* ⑪ 푸터 */}
      <div className="pt-4 pb-2 flex flex-wrap gap-3 justify-center text-[11px] text-zinc-600">
        <Link href="/about" className="hover:text-zinc-400">서비스 소개</Link>
        <span>·</span>
        <Link href="/privacy" className="hover:text-zinc-400">개인정보처리방침</Link>
        <span>·</span>
        <Link href="/terms" className="hover:text-zinc-400">이용약관</Link>
      </div>

    </div>
  );
}
