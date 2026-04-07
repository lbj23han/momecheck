'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBubble from './ChatBubble';
import { UserData } from '@/types';
import { ACTIVITY_OPTIONS, ACTIVITY_REACTIONS } from '@/lib/constants';

interface Props {
  data: UserData;
  onChange: (updates: Partial<UserData>) => void;
  onNext: () => void;
}

export default function StepActivity({ data, onChange, onNext }: Props) {
  const [reaction, setReaction] = useState<string | null>(null);
  const isMale = data.gender === 'male';
  const point = isMale ? '#FFD700' : '#FF6B6B';
  const options = ACTIVITY_OPTIONS[data.gender!];

  const btnBase = isMale
    ? 'border border-zinc-600 text-zinc-300 bg-transparent text-left'
    : 'border border-pink-200 text-zinc-600 bg-white text-left';

  function handleSelect(idx: number) {
    const level = idx + 1;
    onChange({ activityLevel: level });
    setReaction(ACTIVITY_REACTIONS[idx]);
    setTimeout(() => { setReaction(null); onNext(); }, 1200);
  }

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-4">
        <ChatBubble text="평소에 얼마나 움직이세요?" gender={data.gender} />

        <AnimatePresence>
          {reaction ? (
            <motion.div key="reaction" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <ChatBubble text={reaction} gender={data.gender} />
            </motion.div>
          ) : (
            <motion.div key="options" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-2">
              {options.map((opt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSelect(i)}
                  className={`w-full px-4 py-3 rounded-2xl text-sm transition-all ${
                    data.activityLevel === i + 1
                      ? isMale ? 'bg-[#FFD700] text-black font-bold border-[#FFD700] border' : 'bg-[#FF6B6B] text-white font-bold border-[#FF6B6B] border'
                      : btnBase
                  }`}
                >
                  <span className={`inline-block w-5 text-xs mr-2 font-bold`} style={{ color: point }}>{i + 1}</span>
                  {opt}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
