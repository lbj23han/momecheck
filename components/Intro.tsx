"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Props {
  onStart: () => void;
}

export default function Intro({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center bg-[#0a0a0a] overflow-hidden">
      {/* 로고 이미지 */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src="/main.png"
          alt="몸짱 계산기 메인 로고"
          width={260}
          height={260}
          priority
          className="mx-auto h-auto w-[180px] sm:w-[220px] md:w-[260px] object-contain"
        />
      </motion.div>

      {/* 타이틀 */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-3xl sm:text-4xl font-black text-white mb-2"
      >
        몸짱 한번 해볼까?
      </motion.h1>

      {/* 서브 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-zinc-400 text-sm sm:text-base mb-1 leading-relaxed"
      >
        목표한 몸에 도달하는데 얼마나 걸릴지 계산해보기
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="text-[#FFD700] text-sm font-semibold mb-10"
      >
        1분도 안걸려요 ⚡
      </motion.p>

      {/* 시작 버튼 */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.4 }}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        onClick={onStart}
        className="w-full max-w-xs bg-[#FFD700] text-black font-black text-base py-4 rounded-2xl shadow-lg shadow-yellow-500/20"
      >
        지금 바로 알아보기 →
      </motion.button>
    </div>
  );
}
