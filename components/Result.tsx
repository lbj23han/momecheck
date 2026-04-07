'use client';

import { motion } from 'framer-motion';
import { CalcResult, UserData } from '@/types';
import { GRADE_COMMENTS, GOAL_OPTIONS } from '@/lib/constants';
import { getVerdictLine, generateInsights, getGradeBadge } from '@/lib/insights';
import Simulator from './Simulator';
import ShareCard from './ShareCard';

interface Props {
  result: CalcResult;
  data: UserData;
  onReset: () => void;
}

const GRADE_COLORS: Record<string, string> = {
  S: '#FFD700', A: '#00C9A7', B: '#4FC3F7', C: '#FFB74D', D: '#EF5350',
};

function StatRow({ label, value, isMale }: { label: string; value: string; isMale: boolean }) {
  return (
    <div className={`flex justify-between items-center py-2 border-b ${isMale ? 'border-zinc-700' : 'border-pink-100'}`}>
      <span className={`text-xs ${isMale ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</span>
      <span className={`text-xs font-bold ${isMale ? 'text-zinc-200' : 'text-zinc-700'}`}>{value}</span>
    </div>
  );
}

export default function Result({ result, data, onReset }: Props) {
  const isMale = data.gender === 'male';
  const gradeColor = GRADE_COLORS[result.grade];
  const point = isMale ? '#FFD700' : '#FF6B6B';
  const goalText = GOAL_OPTIONS[data.gender!][(data.goalLevel ?? 1) - 1];
  const verdictLine = getVerdictLine(result.dDay);
  const insights = generateInsights(data, result);

  return (
    <div className="flex flex-col min-h-[100dvh] overflow-y-auto px-4 pt-6 pb-12 space-y-4">

      {/* ① 판정 히어로 카드 - 제일 먼저 */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 relative overflow-hidden ${isMale ? 'bg-zinc-900' : 'bg-white border border-pink-100'}`}
        style={{ boxShadow: `0 0 40px ${gradeColor}22` }}>

        {/* 배경 광채 */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 80% 20%, ${gradeColor}15 0%, transparent 70%)` }} />

        <div className={`text-[10px] font-bold tracking-widest mb-3 ${isMale ? 'text-zinc-600' : 'text-zinc-400'}`}>
          생활습관 기반 시뮬레이션 · 추정 결과
        </div>

        {/* 등급 + 뱃지 */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className={`text-xs mb-1 font-semibold ${isMale ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {getGradeBadge(result.grade)}
            </div>
            <div className="text-7xl font-black leading-none" style={{ color: gradeColor }}>
              {result.grade}
            </div>
          </div>
          <div className="text-right mt-1">
            <div className={`text-xs mb-1 ${isMale ? 'text-zinc-500' : 'text-zinc-400'}`}>목표: {goalText}</div>
            {result.impossible ? (
              <div className={`text-sm font-bold ${isMale ? 'text-zinc-400' : 'text-zinc-500'}`}>
                지금 루틴으론<br />달성 어려워요
              </div>
            ) : (
              <div className="text-3xl font-black" style={{ color: gradeColor }}>
                {result.dDay <= 0 ? '달성! 🎉' : `D-${result.dDay.toLocaleString()}`}
              </div>
            )}
          </div>
        </div>

        {/* 판정 문장 */}
        <div className={`mt-3 text-sm font-bold ${isMale ? 'text-white' : 'text-zinc-800'}`}>
          {verdictLine}
        </div>
        <div className={`mt-1 text-xs ${isMale ? 'text-zinc-400' : 'text-zinc-500'}`}>
          {GRADE_COMMENTS[result.grade]}
        </div>
      </motion.div>

      {/* ② 변화 인사이트 카드 */}
      {insights.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`rounded-2xl p-5 ${isMale ? 'bg-zinc-800' : 'bg-pink-50'}`}>
          <div className={`text-xs font-black uppercase tracking-wider mb-3 ${isMale ? 'text-zinc-500' : 'text-pink-400'}`}>
            이렇게만 바꿔도
          </div>
          <div className="space-y-2.5">
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
                <span className="text-xs font-black" style={{ color: point }}>{ins.delta}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ③ 현재 스탯 (두 번째로 밀림) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
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
          * BMI 기반 추정값 + 활동량 보정. 실제 체성분과 다를 수 있어요.
        </div>
      </motion.div>

      {/* ④ 시뮬레이터 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Simulator data={data} baseResult={result} isMale={isMale} />
      </motion.div>

      {/* ⑤ 공유 카드 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <ShareCard result={result} data={data} isMale={isMale} insights={insights} />
      </motion.div>

      {/* ⑥ 재방문 장치 */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className={`rounded-2xl p-5 ${isMale ? 'bg-zinc-800' : 'bg-pink-50'}`}>
        <div className={`text-sm font-black mb-1 ${isMale ? 'text-white' : 'text-zinc-800'}`}>
          2주 뒤 다시 재도전 💪
        </div>
        <div className={`text-xs mb-4 ${isMale ? 'text-zinc-400' : 'text-zinc-500'}`}>
          습관이 달라졌다면 결과도 달라져요. 체중·운동량 업데이트하고 재측정해보세요.
        </div>
        <button
          onClick={onReset}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
            isMale
              ? 'bg-zinc-700 text-zinc-200 active:bg-zinc-600'
              : 'bg-white border border-pink-200 text-pink-600 active:bg-pink-50'
          }`}
        >
          처음부터 다시 계산하기 →
        </button>
      </motion.div>

    </div>
  );
}
