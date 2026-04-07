'use client';

import { motion } from 'framer-motion';

interface Props {
  isMale: boolean;
}

export default function AiUpsell({ isMale }: Props) {
  const point = isMale ? '#FFD700' : '#FF6B6B';
  const bg = isMale ? 'bg-zinc-900' : 'bg-white';
  const border = isMale ? 'border-zinc-700' : 'border-pink-100';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`rounded-2xl p-5 border ${bg} ${border} relative overflow-hidden`}
    >
      {/* 배경 그라데이션 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 80% 0%, ${point}15 0%, transparent 60%)` }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🤖</span>
          <span className={`text-[10px] font-black tracking-widest ${isMale ? 'text-zinc-500' : 'text-zinc-400'}`}>
            AI 바디코치
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
            style={{ background: `${point}25`, color: point }}>
            COMING SOON
          </span>
        </div>

        <div className={`text-sm font-black mb-1 ${isMale ? 'text-white' : 'text-zinc-800'}`}>
          심화 분석이 필요하신가요?
        </div>
        <div className={`text-xs mb-4 leading-relaxed ${isMale ? 'text-zinc-400' : 'text-zinc-500'}`}>
          지금 결과는 기본 추정이에요. AI 바디코치는 더 정밀하게 분석해줘요.
        </div>

        <div className="space-y-2 mb-4">
          {[
            '주차별 목표 체중 & 칼로리 플랜',
            '정체기 예측 & 대응 전략',
            '맞춤 식단 · 보충제 피드백',
            '목표별 상세 운동 루틴',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[10px]" style={{ color: point }}>✓</span>
              <span className={`text-xs ${isMale ? 'text-zinc-300' : 'text-zinc-600'}`}>{item}</span>
            </div>
          ))}
        </div>

        <button
          disabled
          className={`w-full py-3 rounded-xl text-sm font-black transition-all ${
            isMale
              ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
              : 'bg-pink-50 text-pink-300 cursor-not-allowed border border-pink-100'
          }`}
        >
          오픈 알림 받기 (준비 중)
        </button>
      </div>
    </motion.div>
  );
}
