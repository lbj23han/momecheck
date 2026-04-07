'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserData, CalcResult } from '@/types';
import { calculate } from '@/lib/calculator';
import { GRADE_COMMENTS, ACTIVITY_OPTIONS, MEAL_OPTIONS, PROTEIN_OPTIONS } from '@/lib/constants';

interface Props {
  data: UserData;
  baseResult: CalcResult;
  isMale: boolean;
}

const STEP_ICONS: Record<string, string> = {
  '운동량': '🏋️',
  '식사량': '🍽️',
  '단백질': '🥩',
};

function StepControl({
  label,
  options,
  value,
  onChange,
  isMale,
}: {
  label: string;
  options: string[];
  value: number; // 0-based index
  onChange: (v: number) => void;
  isMale: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const bg = isMale ? 'bg-zinc-700' : 'bg-white border border-pink-100';
  const textColor = isMale ? 'text-white' : 'text-zinc-800';
  const labelColor = isMale ? 'text-zinc-400' : 'text-zinc-500';
  const btnEnabled = isMale
    ? 'bg-zinc-600 text-white active:bg-zinc-500'
    : 'bg-pink-100 text-pink-600 active:bg-pink-200';
  const btnDisabled = isMale ? 'bg-zinc-800 text-zinc-600 cursor-default' : 'bg-gray-50 text-gray-300 cursor-default';
  const dropdownBg = isMale ? 'bg-zinc-800 border border-zinc-600' : 'bg-white border border-pink-200';
  const dropdownItem = isMale ? 'hover:bg-zinc-700 text-zinc-200' : 'hover:bg-pink-50 text-zinc-700';
  const dropdownActive = isMale ? 'bg-zinc-600 text-white font-bold' : 'bg-pink-100 text-pink-700 font-bold';

  // 바깥 클릭 시 닫기
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const canDec = value > 0;
  const canInc = value < options.length - 1;

  return (
    <div ref={ref} className={`rounded-xl p-4 ${bg} relative`}>
      <div className={`text-xs mb-2 ${labelColor} flex items-center gap-1`}>
        <span>{STEP_ICONS[label] ?? ''}</span>
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {/* − 버튼 */}
        <button
          onClick={() => canDec && onChange(value - 1)}
          className={`w-9 h-9 rounded-xl font-black text-xl flex items-center justify-center flex-shrink-0 transition-all ${
            canDec ? btnEnabled : btnDisabled
          }`}
        >
          −
        </button>

        {/* 텍스트 + 드롭다운 토글 */}
        <button
          onClick={() => setOpen((v) => !v)}
          className={`flex-1 text-center px-2 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
            isMale ? 'hover:bg-zinc-600' : 'hover:bg-pink-50'
          }`}
        >
          <span className={`text-xs font-bold ${textColor} leading-snug line-clamp-2 flex-1`}>
            {options[value]}
          </span>
          <span className={`text-[10px] flex-shrink-0 ${labelColor}`}>{open ? '▲' : '▼'}</span>
        </button>

        {/* + 버튼 */}
        <button
          onClick={() => canInc && onChange(value + 1)}
          className={`w-9 h-9 rounded-xl font-black text-xl flex items-center justify-center flex-shrink-0 transition-all ${
            canInc ? btnEnabled : btnDisabled
          }`}
        >
          +
        </button>
      </div>

      {/* 드롭다운 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-0 right-0 z-50 rounded-xl shadow-xl overflow-hidden mt-1 ${dropdownBg}`}
            style={{ top: '100%' }}
          >
            <div className="max-h-52 overflow-y-auto py-1">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => { onChange(i); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs transition-all flex items-center gap-2 ${
                    i === value ? dropdownActive : dropdownItem
                  }`}
                >
                  <span className={`text-[10px] font-black w-4 flex-shrink-0 ${
                    i === value ? '' : labelColor
                  }`}>{i + 1}</span>
                  {opt}
                  {i === value && <span className="ml-auto">✓</span>}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Simulator({ data, baseResult, isMale }: Props) {
  const labelColor = isMale ? 'text-zinc-400' : 'text-zinc-500';
  const point = isMale ? '#FFD700' : '#FF6B6B';

  const [actIdx, setActIdx] = useState((data.activityLevel ?? 5) - 1);   // 0-based
  const [mealIdx, setMealIdx] = useState((data.mealLevel ?? 4) - 1);      // 0-based
  const [proteinIdx, setProteinIdx] = useState(data.proteinLevel ?? 0);  // 0-based

  const simResult = calculate(data, {
    activityLevel: actIdx + 1,
    mealLevel: mealIdx + 1,
    proteinLevel: proteinIdx as 0 | 1 | 2 | 3,
  });

  const gradeOrder = ['D', 'C', 'B', 'A', 'S'];
  const improved = gradeOrder.indexOf(simResult.grade) > gradeOrder.indexOf(baseResult.grade);
  const actOptions = ACTIVITY_OPTIONS[data.gender!];
  const mealOptions = MEAL_OPTIONS[data.gender!];

  return (
    <div className={`rounded-2xl p-5 ${isMale ? 'bg-zinc-800' : 'bg-pink-50'}`}>
      <h3 className={`font-black text-base mb-4 ${isMale ? 'text-white' : 'text-zinc-800'}`}>
        이렇게 바꾸면 어떻게 될까? 🎛️
      </h3>

      <div className="space-y-3 mb-5">
        <StepControl
          label="운동량"
          options={actOptions}
          value={actIdx}
          onChange={setActIdx}
          isMale={isMale}
        />
        <StepControl
          label="식사량"
          options={mealOptions}
          value={mealIdx}
          onChange={setMealIdx}
          isMale={isMale}
        />
        <StepControl
          label="단백질"
          options={PROTEIN_OPTIONS}
          value={proteinIdx}
          onChange={(v) => setProteinIdx(v as 0 | 1 | 2 | 3)}
          isMale={isMale}
        />
      </div>

      {/* 결과 */}
      <div className={`rounded-xl p-4 ${isMale ? 'bg-zinc-900' : 'bg-white border border-pink-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-xs mb-1 ${labelColor}`}>시뮬레이션 결과</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black" style={{ color: point }}>{simResult.grade}</span>
              {improved && <span className="text-xs text-green-400 font-bold">↑ 향상</span>}
              {!improved && simResult.grade === baseResult.grade && (
                <span className={`text-xs ${labelColor}`}>현재와 동일</span>
              )}
            </div>
          </div>
          <div className="text-right">
            {simResult.impossible ? (
              <div className={`text-sm font-bold ${labelColor}`}>달성 어려움</div>
            ) : (
              <>
                <div className={`text-xs ${labelColor}`}>목표까지</div>
                <div className={`text-xl font-black ${isMale ? 'text-white' : 'text-zinc-800'}`}>
                  {simResult.dDay <= 0 ? '달성! 🎉' : `D-${simResult.dDay.toLocaleString()}`}
                </div>
              </>
            )}
          </div>
        </div>
        <div className={`text-xs mt-2 ${labelColor}`}>{GRADE_COMMENTS[simResult.grade]}</div>
      </div>
    </div>
  );
}
