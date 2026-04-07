'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RecommendationData } from '@/lib/recommendations';

interface Props {
  reco: RecommendationData;
  isMale: boolean;
}

function Tab({
  label, active, onClick, isMale,
}: { label: string; active: boolean; onClick: () => void; isMale: boolean }) {
  const point = isMale ? '#FFD700' : '#FF6B6B';
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
        active
          ? isMale ? 'bg-zinc-600 text-white' : 'bg-pink-100 text-pink-700'
          : isMale ? 'text-zinc-500' : 'text-zinc-400'
      }`}
      style={active ? { boxShadow: `0 0 0 1px ${point}40` } : {}}
    >
      {label}
    </button>
  );
}

export default function RecoCard({ reco, isMale }: Props) {
  const [tab, setTab] = useState<'diet' | 'exercise' | 'warning'>('diet');
  const point = isMale ? '#FFD700' : '#FF6B6B';
  const cardBg = isMale ? 'bg-zinc-800' : 'bg-pink-50';
  const innerBg = isMale ? 'bg-zinc-700' : 'bg-white border border-pink-100';
  const labelColor = isMale ? 'text-zinc-500' : 'text-zinc-400';
  const textColor = isMale ? 'text-zinc-200' : 'text-zinc-700';

  return (
    <div className={`rounded-2xl p-5 ${cardBg}`}>
      {/* 체형 뱃지 */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-black px-3 py-1 rounded-full ${isMale ? 'bg-zinc-700 text-zinc-200' : 'bg-white text-zinc-700 border border-pink-100'}`}>
          {reco.bodyTypeLabel}
        </span>
        <span className={`text-[11px] ${labelColor}`}>{reco.bodyTypeDesc}</span>
      </div>

      {/* 탭 */}
      <div className={`flex gap-1 rounded-xl p-1 mb-4 ${isMale ? 'bg-zinc-900' : 'bg-white border border-pink-100'}`}>
        <Tab label="🍽️ 식단" active={tab === 'diet'} onClick={() => setTab('diet')} isMale={isMale} />
        <Tab label="🏋️ 운동" active={tab === 'exercise'} onClick={() => setTab('exercise')} isMale={isMale} />
        <Tab
          label={`⚠️ 주의${reco.warnings.length > 0 ? ` ${reco.warnings.length}` : ''}`}
          active={tab === 'warning'}
          onClick={() => setTab('warning')}
          isMale={isMale}
        />
      </div>

      <AnimatePresence mode="wait">
        {tab === 'diet' && (
          <motion.div key="diet" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}>
            <div className="flex items-center justify-between mb-3">
              <div className={`text-sm font-black ${isMale ? 'text-white' : 'text-zinc-800'}`}>
                {reco.diet.title}
              </div>
              <div className="text-xs font-black" style={{ color: point }}>
                {reco.diet.kcalTarget.toLocaleString()} kcal
              </div>
            </div>

            <div className="space-y-2">
              {reco.diet.meals.map((meal) => {
                const mealKcal = meal.items.reduce((s, i) => s + i.kcal, 0);
                const mealProtein = meal.items.reduce((s, i) => s + i.protein, 0);
                return (
                  <div key={meal.label} className={`rounded-xl p-3 ${innerBg}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[11px] font-bold ${labelColor}`}>{meal.label}</span>
                      <span className={`text-[10px] ${labelColor}`}>{mealKcal}kcal · 단백질 {mealProtein}g</span>
                    </div>
                    <div className="space-y-1">
                      {meal.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className={`text-xs ${textColor}`}>
                            {item.name}
                            <span className={`ml-1 text-[10px] ${labelColor}`}>{item.amount}</span>
                          </span>
                          <span className={`text-[10px] ${labelColor}`}>{item.kcal}kcal</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`mt-3 text-[11px] p-3 rounded-xl ${isMale ? 'bg-zinc-900' : 'bg-pink-100/50'} ${labelColor}`}>
              💡 {reco.diet.tip}
            </div>
          </motion.div>
        )}

        {tab === 'exercise' && (
          <motion.div key="exercise" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}>
            <div className={`text-sm font-black mb-1 ${isMale ? 'text-white' : 'text-zinc-800'}`}>
              {reco.exercise.title}
            </div>
            <div className="text-xs font-bold mb-4" style={{ color: point }}>
              {reco.exercise.schedule}
            </div>
            <div className="space-y-2">
              {reco.exercise.items.map((item, i) => (
                <div key={i} className={`flex items-start gap-2 rounded-xl px-3 py-2.5 ${innerBg}`}>
                  <span className="text-xs font-black mt-0.5" style={{ color: point }}>{i + 1}</span>
                  <span className={`text-xs ${textColor}`}>{item}</span>
                </div>
              ))}
            </div>
            <div className={`mt-3 text-[11px] p-3 rounded-xl ${isMale ? 'bg-zinc-900' : 'bg-pink-100/50'} ${labelColor}`}>
              💡 {reco.exercise.tip}
            </div>
          </motion.div>
        )}

        {tab === 'warning' && (
          <motion.div key="warning" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}>
            {reco.warnings.length === 0 ? (
              <div className={`text-center py-8 ${labelColor} text-sm`}>
                특별한 주의사항이 없어요 👍
              </div>
            ) : (
              <div className="space-y-2">
                {reco.warnings.map((w, i) => (
                  <div key={i} className={`rounded-xl px-4 py-3 text-xs leading-relaxed ${isMale ? 'bg-zinc-900 text-zinc-300' : 'bg-white border border-orange-100 text-zinc-700'}`}>
                    {w}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
