'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Intro from '@/components/Intro';
import StepBasic from '@/components/StepBasic';
import StepActivity from '@/components/StepActivity';
import StepDiet from '@/components/StepDiet';
import StepGoal from '@/components/StepGoal';
import Result from '@/components/Result';
import { UserData, Step } from '@/types';
import { calculate } from '@/lib/calculator';

const INITIAL_DATA: UserData = {
  gender: null, ageGroup: null, height: null, weight: null,
  activityLevel: null, mealLevel: null, proteinLevel: null,
  alcoholLevel: null, goalLevel: null,
};

const STEPS: Step[] = ['intro', 'basic', 'activity', 'diet', 'goal', 'result'];
const STEP_LABELS: Partial<Record<Step, string>> = {
  basic: '기본 정보', activity: '활동량', diet: '식습관', goal: '목표',
};

export default function Home() {
  const [step, setStep] = useState<Step>('intro');
  const [data, setData] = useState<UserData>(INITIAL_DATA);
  const [direction, setDirection] = useState(1);

  const isMale = data.gender === 'male';
  const bg = data.gender === 'female' ? '#FFFFFF' : '#0a0a0a';
  const point = isMale ? '#FFD700' : '#FF6B6B';


  function updateData(updates: Partial<UserData>) {
    setData((prev) => ({ ...prev, ...updates }));
  }

  function goNext() {
    setDirection(1);
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }

  function goBack() {
    setDirection(-1);
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  }

  const showProgress = step !== 'intro' && step !== 'result';
  const progressSteps = ['basic', 'activity', 'diet', 'goal'] as Step[];
  const progressIdx = progressSteps.indexOf(step);

  const result = step === 'result' && data.gender && data.ageGroup && data.height && data.weight
    && data.activityLevel && data.mealLevel && data.proteinLevel !== null
    && data.alcoholLevel !== null && data.goalLevel
    ? calculate(data) : null;

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '60%' : '-60%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-60%' : '60%', opacity: 0 }),
  };

  return (
    <main style={{ background: bg, minHeight: '100dvh' }} className="transition-colors duration-500">
      <div className="mx-auto max-w-[430px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[720px] relative">

        {/* 진행 바 */}
        {showProgress && (
          <div
            className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[720px] z-50 px-4 pt-4 pb-2"
            style={{ background: bg }}
          >
            <div className="flex items-center gap-3 mb-2">
              <button onClick={goBack} className={`text-sm ${isMale ? 'text-zinc-500' : 'text-zinc-400'}`}>←</button>
              <span className={`text-xs font-semibold ${isMale ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {STEP_LABELS[step]}
              </span>
            </div>
            <div className="flex gap-1.5">
              {progressSteps.map((s, i) => (
                <div key={s} className="flex-1 h-1 rounded-full transition-all duration-500"
                  style={{ background: i <= progressIdx ? point : isMale ? '#333' : '#f0d0d0' }} />
              ))}
            </div>
          </div>
        )}

        {/* 스텝 콘텐츠 */}
        <div className={showProgress ? 'pt-14' : ''} style={{ overflow: 'hidden' }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeInOut' }}
            >
              {step === 'intro' && <Intro onStart={goNext} />}
              {step === 'basic' && (
                <StepBasic data={data} onChange={updateData} onNext={goNext} theme={data.gender} />
              )}
              {step === 'activity' && (
                <StepActivity data={data} onChange={updateData} onNext={goNext} />
              )}
              {step === 'diet' && (
                <StepDiet data={data} onChange={updateData} onNext={goNext} />
              )}
              {step === 'goal' && (
                <StepGoal data={data} onChange={updateData} onNext={goNext} />
              )}
              {step === 'result' && result && (
                <Result result={result} data={data} onReset={() => {
                  setData(INITIAL_DATA);
                  setDirection(-1);
                  setStep('intro');
                }} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
