'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ChatBubble from './ChatBubble';
import { UserData, ProteinLevel, AlcoholLevel } from '@/types';
import { MEAL_OPTIONS, PROTEIN_OPTIONS, ALCOHOL_OPTIONS } from '@/lib/constants';

interface Props {
  data: UserData;
  onChange: (updates: Partial<UserData>) => void;
  onNext: () => void;
}

export default function StepDiet({ data, onChange, onNext }: Props) {
  const [subStep, setSubStep] = useState(0);
  const [reaction, setReaction] = useState<string | null>(null);

  const isMale = data.gender === 'male';
  const point = isMale ? '#FFD700' : '#FF6B6B';
  const options = MEAL_OPTIONS[data.gender!];

  const btnBase = isMale
    ? 'border border-zinc-600 text-zinc-300 bg-transparent text-left'
    : 'border border-pink-200 text-zinc-600 bg-white text-left';
  const btnActive = isMale
    ? 'bg-[#FFD700] text-black font-bold border-[#FFD700] border'
    : 'bg-[#FF6B6B] text-white font-bold border-[#FF6B6B] border';

  function handleMeal(idx: number) {
    onChange({ mealLevel: idx + 1 });
    setReaction('그렇군요!');
    setTimeout(() => { setReaction(null); setSubStep(1); }, 900);
  }

  function handleProtein(idx: number) {
    onChange({ proteinLevel: idx as ProteinLevel });
    setReaction('👀 체크했어요!');
    setTimeout(() => { setReaction(null); setSubStep(2); }, 900);
  }

  function handleAlcohol(idx: number) {
    onChange({ alcoholLevel: idx as AlcoholLevel });
    onNext();
  }

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-4 space-y-4">

        {/* Q1: 식사량 */}
        <ChatBubble text="평소에 얼마나 드세요?" gender={data.gender} />

        {subStep === 0 && !reaction && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            {options.map((opt, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleMeal(i)}
                className={`w-full px-4 py-3 rounded-2xl text-sm transition-all ${
                  data.mealLevel === i + 1 ? btnActive : btnBase
                }`}
              >
                <span className="inline-block w-5 text-xs mr-2 font-bold" style={{ color: point }}>{i + 1}</span>
                {opt}
              </motion.button>
            ))}
          </motion.div>
        )}

        {reaction && <ChatBubble text={reaction} gender={data.gender} />}

        {/* Q2: 단백질 */}
        {subStep >= 1 && (
          <>
            <ChatBubble text="단백질은 얼마나 챙기세요?" gender={data.gender} delay={0.1} />
            {subStep === 1 && !reaction && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2">
                {PROTEIN_OPTIONS.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleProtein(i)}
                    className={`px-4 py-2.5 rounded-2xl text-sm transition-all ${
                      data.proteinLevel === i ? btnActive : btnBase
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </motion.div>
            )}
          </>
        )}

        {/* Q3: 술/야식 */}
        {subStep >= 2 && (
          <>
            <ChatBubble text="술이나 야식은요?" gender={data.gender} delay={0.1} />
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2">
              {ALCOHOL_OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAlcohol(i)}
                  className={`px-4 py-2.5 rounded-2xl text-sm transition-all ${
                    data.alcoholLevel === i ? btnActive : btnBase
                  }`}
                >
                  {opt}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
