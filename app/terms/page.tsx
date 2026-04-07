import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '이용약관',
  description: '몸매체크 MomeCheck 이용약관',
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 px-6 py-12 max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 mb-8 inline-block">← 홈으로</Link>

      <h1 className="text-2xl font-black text-white mb-2">이용약관</h1>
      <p className="text-sm text-zinc-500 mb-10">최종 수정일: 2025년 4월 7일</p>

      <div className="space-y-8 text-sm leading-relaxed">

        <section>
          <h2 className="text-base font-bold text-white mb-3">제1조 (목적)</h2>
          <p className="text-zinc-400">이 약관은 몸매체크(MomeCheck, 이하 &ldquo;서비스&rdquo;)가 제공하는 피트니스 분석 서비스의 이용과 관련하여 서비스와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-3">제2조 (서비스의 내용)</h2>
          <p className="text-zinc-400">서비스는 이용자의 입력 정보(성별, 나이, 키, 몸무게, 생활습관 등)를 바탕으로 체지방률, 목표 달성 예상 기간 등을 추정하여 제공합니다. 제공되는 모든 수치는 참고용 추정값이며, 의학적 진단이나 전문적 조언을 대체하지 않습니다.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-3">제3조 (면책조항)</h2>
          <ul className="space-y-2 text-zinc-400 list-disc list-inside">
            <li>서비스가 제공하는 계산 결과는 통계적 추정값으로, 실제 체성분과 다를 수 있습니다.</li>
            <li>서비스는 의료, 영양, 운동 전문가의 조언을 대체하지 않습니다.</li>
            <li>이용자가 서비스 결과를 바탕으로 내린 결정에 대해 서비스는 책임을 지지 않습니다.</li>
            <li>서비스는 천재지변, 시스템 장애 등 불가항력적인 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-3">제4조 (광고)</h2>
          <p className="text-zinc-400">서비스는 Google AdSense 등 제3자 광고 네트워크를 통해 광고를 게재할 수 있습니다. 광고 콘텐츠는 서비스가 통제하지 않으며, 광고주의 책임 하에 제공됩니다.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-3">제5조 (지적재산권)</h2>
          <p className="text-zinc-400">서비스 내 모든 콘텐츠(텍스트, 이미지, 로직 등)의 지적재산권은 서비스에 귀속됩니다. 이용자는 서비스의 사전 동의 없이 이를 복제, 배포, 상업적으로 이용할 수 없습니다.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-3">제6조 (약관의 변경)</h2>
          <p className="text-zinc-400">서비스는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지를 통해 고지합니다. 변경 후 서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 간주합니다.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-3">제7조 (준거법 및 관할)</h2>
          <p className="text-zinc-400">이 약관은 대한민국 법률에 따라 해석되며, 서비스와 이용자 간의 분쟁은 대한민국 법원을 관할 법원으로 합니다.</p>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t border-zinc-800 flex gap-4 text-xs text-zinc-600">
        <Link href="/" className="hover:text-zinc-400">홈</Link>
        <Link href="/privacy" className="hover:text-zinc-400">개인정보처리방침</Link>
        <Link href="/about" className="hover:text-zinc-400">서비스 소개</Link>
      </div>
    </div>
  );
}
