'use client';

import { motion } from 'framer-motion';
import ChatBubble from './ChatBubble';
import { UserData } from '@/types';
import { GOAL_OPTIONS } from '@/lib/constants';

interface Props {
  data: UserData;
  onChange: (updates: Partial<UserData>) => void;
  onNext: () => void;
}

const GOAL_EMOJIS = ['😌', '😏', '🏊', '📸', '🔥', '🏆'];

export default function StepGoal({ data, onChange, onNext }: Props) {
  const isMale = data.gender === 'male';
  const options = GOAL_OPTIONS[data.gender!];

  const btnBase = isMale
    ? 'border border-zinc-600 text-zinc-300 bg-transparent text-left'
    : 'border border-pink-200 text-zinc-600 bg-white text-left';
  const btnActive = isMale
    ? 'bg-[#FFD700] text-black font-bold border-[#FFD700] border'
    : 'bg-[#FF6B6B] text-white font-bold border-[#FF6B6B] border';

  function handleSelect(idx: number) {
    onChange({ goalLevel: idx + 1 });
    setTimeout(() => onNext(), 600);
  }

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-4">
        <ChatBubble text="어떤 몸이 목표예요?" gender={data.gender} />
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="space-y-2 mt-2">
          {options.map((opt, i) => (
            <motion.button key={i}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => handleSelect(i)}
              className={`w-full px-4 py-3.5 rounded-2xl text-sm transition-all ${
                data.goalLevel === i + 1 ? btnActive : btnBase
              }`}>
              <span className="mr-2">{GOAL_EMOJIS[i]}</span>
              {opt}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
