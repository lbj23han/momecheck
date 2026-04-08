import type { Metadata } from 'next';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '몸매체크 MomeCheck 개인정보처리방침',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 px-6 py-12 max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 mb-8 inline-block">← 홈으로</Link>

      <h1 className="text-2xl font-black text-white mb-2">개인정보처리방침</h1>
      <p className="text-sm text-zinc-500 mb-10">최종 수정일: 2025년 4월 7일</p>

      <div className="space-y-8 text-sm leading-relaxed">

        <section>
          <h2 className="text-base font-bold text-white mb-3">1. 개인정보의 처리 목적</h2>
          <p>몸매체크(MomeCheck, 이하 &ldquo;서비스&rdquo;)는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
          <ul className="mt-3 space-y-1 text-zinc-400 list-disc list-inside">
            <li>서비스 제공 및 계산 결과 표시</li>
            <li>서비스 개선 및 통계 분석</li>
            <li>광고 서비스 제공 (Google AdSense)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-3">2. 수집하는 개인정보 항목</h2>
          <p className="text-zinc-400">본 서비스는 회원가입 없이 이용 가능하며, 별도의 개인정보를 수집하지 않습니다. 다만, 서비스 이용 과정에서 아래와 같은 정보가 자동으로 수집될 수 있습니다.</p>
          <ul className="mt-3 space-y-1 text-zinc-400 list-disc list-inside">
            <li>IP 주소, 브라우저 종류, 방문 일시, 서비스 이용 기록 (자동 수집)</li>
            <li>쿠키 및 유사 기술을 통한 광고 식별자 (Google AdSense)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-3">3. 개인정보의 보유 및 이용기간</h2>
          <p className="text-zinc-400">서비스는 원칙적으로 개인정보의 처리 목적이 달성되면 해당 개인정보를 지체 없이 파기합니다. 단, 관계 법령에 따라 보존해야 하는 경우는 해당 기간 동안 보관합니다.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-3">4. 쿠키(Cookie) 운영</h2>
          <p className="text-zinc-400">서비스는 이용자에게 맞춤형 서비스를 제공하기 위해 쿠키를 사용합니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다. 다만, 쿠키 저장을 거부할 경우 일부 서비스 이용에 어려움이 있을 수 있습니다.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-3">5. Google AdSense 및 제3자 광고</h2>
          <p className="text-zinc-400">본 서비스는 Google AdSense를 통한 광고를 게재합니다. Google은 쿠키를 사용하여 이용자의 관심사 기반 광고를 표시할 수 있습니다. 이용자는 <a href="https://www.google.com/settings/ads" className="text-zinc-300 underline" target="_blank" rel="noopener noreferrer">Google 광고 설정</a>에서 맞춤 광고를 비활성화할 수 있습니다.</p>
          <p className="mt-2 text-zinc-400">Google의 개인정보처리방침은 <a href="https://policies.google.com/privacy" className="text-zinc-300 underline" target="_blank" rel="noopener noreferrer">여기</a>에서 확인할 수 있습니다.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-3">6. 개인정보의 제3자 제공</h2>
          <p className="text-zinc-400">서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.</p>
          <ul className="mt-3 space-y-1 text-zinc-400 list-disc list-inside">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-3">7. 개인정보 보호책임자</h2>
          <p className="text-zinc-400">서비스의 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제를 처리하기 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
          <div className="mt-3 text-zinc-400">
            <p>서비스명: 몸매체크 MomeCheck</p>
            <p>문의: momecheck.contact@gmail.com</p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-3">8. 개인정보처리방침 변경</h2>
          <p className="text-zinc-400">이 개인정보처리방침은 법령, 정책 또는 보안기술의 변경에 따라 내용이 추가, 삭제 및 수정될 수 있으며, 변경 시에는 서비스 내 공지사항을 통하여 고지합니다.</p>
        </section>

      </div>

      <AdBanner className="mt-8" />

      <div className="mt-8 pt-6 border-t border-zinc-800 flex gap-4 text-xs text-zinc-600">
        <Link href="/" className="hover:text-zinc-400">홈</Link>
        <Link href="/terms" className="hover:text-zinc-400">이용약관</Link>
        <Link href="/about" className="hover:text-zinc-400">서비스 소개</Link>
      </div>
    </div>
  );
}
