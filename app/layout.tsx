import type { Metadata, Viewport } from "next";
import "./globals.css";

const BASE_URL = "https://momecheck.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "몸짱 한번 해볼까? | 몸매체크 MomeCheck",
    template: "%s | 몸매체크 MomeCheck",
  },
  description:
    "내 생활습관으로 목표 몸까지 얼마나 걸릴지 계산해보세요. 체지방 분석 · D-Day 계산 · 등급 판정 · 식단/운동 추천까지. 1분도 안 걸려요.",
  keywords: [
    "몸짱 계산기",
    "체지방 계산기",
    "다이어트 기간 계산",
    "바디프로필 기간",
    "식스팩 만들기 기간",
    "운동 등급 테스트",
    "헬스 루틴 테스트",
    "내 몸 점수",
    "체형 등급",
    "몸매 체크",
    "다이어트 D-Day",
    "BMR 계산기",
    "TDEE 계산기",
    "체지방률 계산",
  ],

  authors: [{ name: "MomeCheck" }],
  creator: "MomeCheck",
  publisher: "MomeCheck",

  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: BASE_URL,
    siteName: "몸매체크 MomeCheck",
    title: "몸짱 한번 해볼까? | 몸매체크",
    description:
      "내 생활습관으로 목표 몸까지 얼마나 걸릴지 계산해보세요. 체지방 분석 · D-Day 계산 · 식단/운동 추천까지. 1분도 안 걸려요.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "몸매체크 - 목표 몸까지 얼마나 걸릴까?",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "몸짱 한번 해볼까? | 몸매체크",
    description:
      "내 생활습관으로 목표 몸까지 얼마나 걸릴지 계산해보세요. 1분도 안 걸려요.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: BASE_URL,
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-adsense-account" content="ca-pub-5992854033857462" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5992854033857462"
          crossOrigin="anonymous"
        />
        <meta name="google-site-verification" content="UqqVWxR6WNXvWnv66Cod24CsoN0fKdO1opwN9PFOpcg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "몸매체크 MomeCheck",
              url: BASE_URL,
              description:
                "생활습관 기반 체지방 분석과 목표 몸까지의 예상 기간을 계산해주는 피트니스 시뮬레이터",
              applicationCategory: "HealthApplication",
              operatingSystem: "All",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "KRW",
              },
              inLanguage: "ko",
              genre: "fitness, health, calculator",
            }),
          }}
        />
      </head>
      <body className="antialiased bg-[#0a0a0a]">{children}</body>
    </html>
  );
}
