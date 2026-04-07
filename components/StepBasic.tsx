'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBubble from './ChatBubble';
import { UserData, Gender, AgeGroup } from '@/types';

interface Props {
  data: UserData;
  onChange: (updates: Partial<UserData>) => void;
  onNext: () => void;
  theme: 'male' | 'female' | null;
}

const AGE_OPTIONS: { value: AgeGroup; label: string }[] = [
  { value: '10s', label: '10대' },
  { value: '20s', label: '20대' },
  { value: '30s', label: '30대' },
  { value: '40s', label: '40대' },
  { value: '50s+', label: '50대+' },
];

export default function StepBasic({ data, onChange, onNext, theme }: Props) {
  const [subStep, setSubStep] = useState(0);
  const [heightInput, setHeightInput] = useState(data.height?.toString() ?? '');
  const [weightInput, setWeightInput] = useState(data.weight?.toString() ?? '');
  const [reaction, setReaction] = useState<string | null>(null);

  const isMale = theme === 'male';
  const btnBase = isMale
    ? 'border border-zinc-600 text-zinc-300 bg-transparent'
    : 'border border-pink-200 text-zinc-600 bg-white';
  const btnActive = isMale
    ? 'bg-[#FFD700] text-black border-[#FFD700] font-bold'
    : 'bg-[#FF6B6B] text-white border-[#FF6B6B] font-bold';

  function handleGender(g: Gender) {
    onChange({ gender: g });
    setReaction(g === 'male' ? '오, 남자셨군요 💪' : '오, 여자셨군요 🌸');
    setTimeout(() => { setReaction(null); setSubStep(1); }, 1000);
  }

  function handleAge(a: AgeGroup) {
    onChange({ ageGroup: a });
    setReaction('알겠어요!');
    setTimeout(() => { setReaction(null); setSubStep(2); }, 900);
  }

  function handleBodySubmit() {
    const h = parseFloat(heightInput);
    const w = parseFloat(weightInput);
    if (!h || !w || h < 100 || h > 250 || w < 20 || w > 300) return;
    onChange({ height: h, weight: w });
    onNext();
  }

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-4">

        {/* Q1: 성별 */}
        <AnimatePresence>
          {subStep >= 0 && (
            <ChatBubble text="성별이 어떻게 되세요?" gender={theme} />
          )}
        </AnimatePresence>

        {subStep === 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-center mb-6 flex-wrap">
            {(['male', 'female'] as Gender[]).map((g) => (
              <button key={g}
                onClick={() => handleGender(g)}
                className={`px-8 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  data.gender === g ? btnActive : btnBase
                }`}>
                {g === 'male' ? '남자 👦' : '여자 👧'}
              </button>
            ))}
          </motion.div>
        )}

        {reaction && subStep === 1 && !data.ageGroup && (
          <ChatBubble text={reaction} gender={theme} delay={0} />
        )}

        {/* Q2: 나이대 */}
        {subStep >= 1 && (
          <AnimatePresence>
            <ChatBubble text="나이대가 어떻게 되세요?" gender={theme} delay={0.1} />
          </AnimatePresence>
        )}

        {subStep === 1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 flex-wrap justify-center mb-6">
            {AGE_OPTIONS.map((opt) => (
              <button key={opt.value}
                onClick={() => handleAge(opt.value)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                  data.ageGroup === opt.value ? btnActive : btnBase
                }`}>
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}

        {/* Q3: 키/몸무게 */}
        {subStep >= 2 && (
          <AnimatePresence>
            <ChatBubble text="키랑 몸무게 알려주세요!" gender={theme} delay={0.1} />
          </AnimatePresence>
        )}

        {subStep === 2 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-3 mb-6">
            <div className={`rounded-2xl p-4 ${isMale ? 'bg-zinc-800' : 'bg-pink-50'}`}>
              <div className="flex gap-3 items-center">
                <div className="flex-1">
                  <label className={`text-xs mb-1 block ${isMale ? 'text-zinc-400' : 'text-zinc-500'}`}>키</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number" inputMode="decimal"
                      value={heightInput}
                      onChange={(e) => setHeightInput(e.target.value)}
                      placeholder="170"
                      className={`w-full rounded-xl px-3 py-2.5 text-lg font-bold outline-none ${
                        isMale ? 'bg-zinc-700 text-white' : 'bg-white text-zinc-800 border border-pink-200'
                      }`}
                    />
                    <span className={`text-sm ${isMale ? 'text-zinc-400' : 'text-zinc-500'}`}>cm</span>
                  </div>
                </div>
                <div className="flex-1">
                  <label className={`text-xs mb-1 block ${isMale ? 'text-zinc-400' : 'text-zinc-500'}`}>몸무게</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number" inputMode="decimal"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      placeholder="70"
                      className={`w-full rounded-xl px-3 py-2.5 text-lg font-bold outline-none ${
                        isMale ? 'bg-zinc-700 text-white' : 'bg-white text-zinc-800 border border-pink-200'
                      }`}
                    />
                    <span className={`text-sm ${isMale ? 'text-zinc-400' : 'text-zinc-500'}`}>kg</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleBodySubmit}
              disabled={!heightInput || !weightInput}
              className={`w-full py-4 rounded-2xl font-black text-base transition-all ${
                heightInput && weightInput
                  ? isMale ? 'bg-[#FFD700] text-black' : 'bg-[#FF6B6B] text-white'
                  : isMale ? 'bg-zinc-700 text-zinc-500' : 'bg-pink-100 text-pink-300'
              }`}
            >
              다음으로 →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
