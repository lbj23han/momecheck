import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: '서비스 소개',
  description: '몸매체크(MomeCheck)는 생활습관 기반으로 목표 몸까지 얼마나 걸릴지 계산해주는 피트니스 시뮬레이터입니다.',
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 px-6 py-12 max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 mb-8 inline-block">← 홈으로</Link>

      <div className="flex items-center gap-4 mb-10">
        <Image src="/main.png" alt="몸매체크 로고" width={80} height={80} className="object-contain" />
        <div>
          <h1 className="text-2xl font-black text-white">몸매체크</h1>
          <p className="text-sm text-zinc-500">MomeCheck</p>
        </div>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">

        <section>
          <h2 className="text-base font-bold text-white mb-3">서비스 소개</h2>
          <p className="text-zinc-400">몸매체크(MomeCheck)는 &ldquo;목표한 몸까지 얼마나 걸릴까?&rdquo;라는 질문에 답하는 생활습관 기반 피트니스 시뮬레이터입니다. 복잡한 공식 없이, 지금 내 루틴 그대로 입력하면 1분 안에 결과를 확인할 수 있습니다.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-3">어떻게 계산하나요?</h2>
          <p className="text-zinc-400 mb-3">국제적으로 검증된 공식을 기반으로 생활습관 보정을 적용합니다.</p>
          <ul className="space-y-2 text-zinc-400 list-disc list-inside">
            <li><span className="text-zinc-300 font-semibold">BMR 계산</span>: Mifflin-St Jeor 공식 (성별·나이·키·몸무게 반영)</li>
            <li><span className="text-zinc-300 font-semibold">TDEE 계산</span>: 활동량 계수 적용 하루 소비 칼로리</li>
            <li><span className="text-zinc-300 font-semibold">체지방률 추정</span>: Deurenberg BMI 공식 + 활동량 보정</li>
            <li><span className="text-zinc-300 font-semibold">감량 기간 계산</span>: 칼로리 적자 기반 + 단백질·음주 보정</li>
            <li><span className="text-zinc-300 font-semibold">등급 판정</span>: 목표 달성까지 예상 기간 기준 (S/A/B/C/D/F)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-3">주의사항</h2>
          <p className="text-zinc-400">모든 결과는 <span className="text-zinc-300">통계적 추정값</span>입니다. 실제 체성분은 체성분 검사(InBody 등)를 통해 정확히 측정하시기 바랍니다. 본 서비스의 결과는 참고용이며, 의학적 진단을 대체하지 않습니다.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-3">등급 기준</h2>
          <div className="space-y-2">
            {[
              { grade: 'S', color: '#FFD700', desc: '이미 달성 · 목표 체지방률 달성 상태' },
              { grade: 'A', color: '#00C9A7', desc: '90일 이내 달성 가능' },
              { grade: 'B', color: '#4FC3F7', desc: '180일 이내 달성 가능' },
              { grade: 'C', color: '#FFB74D', desc: '1년 이내 달성 가능' },
              { grade: 'D', color: '#EF5350', desc: '2년 이내 달성 가능' },
              { grade: 'F', color: '#9E9E9E', desc: '2년 초과 또는 현재 루틴으론 불가' },
            ].map((item) => (
              <div key={item.grade} className="flex items-center gap-3 py-2 border-b border-zinc-800">
                <span className="text-xl font-black w-8" style={{ color: item.color }}>{item.grade}</span>
                <span className="text-zinc-400 text-xs">{item.desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-3">문의</h2>
          <p className="text-zinc-400">서비스 관련 문의는 아래 이메일로 연락해주세요.</p>
          <p className="mt-2 text-zinc-300">momecheck.contact@gmail.com</p>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t border-zinc-800 flex gap-4 text-xs text-zinc-600">
        <Link href="/" className="hover:text-zinc-400">홈</Link>
        <Link href="/privacy" className="hover:text-zinc-400">개인정보처리방침</Link>
        <Link href="/terms" className="hover:text-zinc-400">이용약관</Link>
      </div>
    </div>
  );
}
