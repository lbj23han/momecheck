"use client";

import Image from "next/image";

interface Props {
  gender: "male" | "female" | null;
  size?: number;
}

export default function CharacterIcon({ gender, size = 40 }: Props) {
  if (gender === "male") {
    return (
      <Image
        src="/dogtrainer.svg"
        alt="남성 캐릭터"
        width={size}
        height={size}
        className="object-contain"
      />
    );
  }
  if (gender === "female") {
    return (
      <Image
        src="/rabbittrainer.png"
        alt="여성 캐릭터"
        width={size}
        height={size}
        className="object-contain"
      />
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="50" fill="#222" />
      <text x="50" y="62" textAnchor="middle" fontSize="36">
        💪
      </text>
    </svg>
  );
}
