"use client";

import { useRef, useState } from "react";
import { CalcResult, UserData } from "@/types";
import { GRADE_COMMENTS, GOAL_OPTIONS } from "@/lib/constants";
import { getVerdictLine, Insight } from "@/lib/insights";

interface Props {
  result: CalcResult;
  data: UserData;
  isMale: boolean;
  insights: Insight[];
}

export default function ShareCard({ result, data, isMale, insights }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const point = isMale ? "#FFD700" : "#FF6B6B";
  const goalText = GOAL_OPTIONS[data.gender!][(data.goalLevel ?? 1) - 1];
  const verdictLine = getVerdictLine(result.dDay);
  const topInsights = insights.slice(0, 2);

  async function handleSaveImage() {
    const html2canvas = (await import("html2canvas")).default;
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
    });
    const link = document.createElement("a");
    link.download = "몸짱_목표_결과.png";
    link.href = canvas.toDataURL();
    link.click();
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* 공유 카드 (캡처용) */}
      <div
        ref={cardRef}
        className={`rounded-2xl p-6 ${isMale ? "bg-zinc-900" : "bg-gradient-to-br from-pink-50 to-white"}`}
        style={{ border: `2px solid ${point}` }}
      >
        {/* 헤더 */}
        <div
          className={`text-[10px] font-bold tracking-widest mb-3 ${isMale ? "text-zinc-600" : "text-zinc-400"}`}
        >
          몸짱 한번 해볼까? · 몸매 체크 mome check
        </div>

        {/* 등급 + dDay */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <div
              className={`text-xs mb-0.5 ${isMale ? "text-zinc-500" : "text-zinc-400"}`}
            >
              목표: {goalText}
            </div>
            <div className="text-5xl font-black" style={{ color: point }}>
              {result.grade}등급
            </div>
          </div>
          <div className="text-right">
            {result.impossible ? (
              <div
                className={`text-sm font-bold ${isMale ? "text-zinc-400" : "text-zinc-500"}`}
              >
                루틴 바꿔야
                <br />
                가능해요
              </div>
            ) : (
              <div className="text-2xl font-black" style={{ color: point }}>
                {result.dDay <= 0
                  ? "이미 달성! 🎉"
                  : `D-${result.dDay.toLocaleString()}`}
              </div>
            )}
          </div>
        </div>

        {/* 판정 문장 */}
        <div
          className={`text-sm font-bold mb-3 ${isMale ? "text-white" : "text-zinc-800"}`}
        >
          {verdictLine}
        </div>
        <div
          className={`text-xs mb-4 ${isMale ? "text-zinc-400" : "text-zinc-500"}`}
        >
          {GRADE_COMMENTS[result.grade]}
        </div>

        {/* 변화 인사이트 (공유 포인트) */}
        {topInsights.length > 0 && (
          <div
            className={`rounded-xl p-3 mb-4 ${isMale ? "bg-zinc-800" : "bg-pink-50"}`}
          >
            <div
              className={`text-[10px] font-bold mb-2 ${isMale ? "text-zinc-500" : "text-pink-400"}`}
            >
              이렇게만 바꾸면
            </div>
            {topInsights.map((ins, i) => (
              <div
                key={i}
                className={`flex items-center justify-between text-xs py-1 ${i < topInsights.length - 1 ? (isMale ? "border-b border-zinc-700" : "border-b border-pink-100") : ""}`}
              >
                <span className={isMale ? "text-zinc-400" : "text-zinc-500"}>
                  {ins.icon} {ins.label}
                </span>
                <span className="font-black" style={{ color: point }}>
                  {ins.delta}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 하단 CTA */}
        <div
          className={`text-xs ${isMale ? "text-zinc-600" : "text-zinc-400"}`}
        >
          나도 계산해보기 → momecheck.vercel.app
        </div>
      </div>

      <a
        href="https://헬린이맵.com"
        target="_blank"
        rel="noreferrer"
        className={isMale ? "block w-full rounded-xl px-4 py-3 text-center text-sm font-bold transition-all active:scale-95 bg-zinc-800 text-white hover:bg-zinc-700" : "block w-full rounded-xl px-4 py-3 text-center text-sm font-bold transition-all active:scale-95 bg-pink-100 text-pink-700 hover:bg-pink-200"}
      >
        눈치 안보고 운동 시작하고 싶으신가요?
      </a>

      {/* 공유 버튼들 */}
      <div className="flex gap-2">
        <button
          onClick={handleSaveImage}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
            isMale ? "bg-zinc-800 text-white" : "bg-pink-100 text-pink-700"
          }`}
        >
          📸 이미지 저장
        </button>
        <button
          onClick={handleCopyLink}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
            isMale ? "bg-zinc-800 text-white" : "bg-pink-100 text-pink-700"
          }`}
        >
          {copied ? "✅ 복사됨!" : "🔗 링크 복사"}
        </button>
      </div>
    </div>
  );
}
