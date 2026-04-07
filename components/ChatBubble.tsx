'use client';

import { motion } from 'framer-motion';
import { Gender } from '@/types';
import CharacterIcon from './CharacterIcon';

interface Props {
  text: string;
  gender: Gender | null;
  delay?: number;
}

export default function ChatBubble({ text, gender, delay = 0 }: Props) {
  const isMale = gender === 'male';
  const bubbleBg = isMale ? 'bg-zinc-800 text-white' : 'bg-pink-50 text-zinc-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-start gap-2 mb-4"
    >
      <div className="flex-shrink-0 rounded-full overflow-hidden w-10 h-10">
        <CharacterIcon gender={gender} size={40} />
      </div>
      <div className={`rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed max-w-[80%] ${bubbleBg}`}>
        {text}
      </div>
    </motion.div>
  );
}
