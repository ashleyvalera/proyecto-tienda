import React from 'react';

interface BrandLogoProps {
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '' }) => {
  return (
    <a
      href="/"
      className={`inline-flex items-center gap-2.5 group shrink-0 focus:outline-none ${className}`}
      aria-label="La casita de Mathi - Inicio"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white transition-transform group-hover:scale-105">
        <svg className="h-4.5 w-4.5" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M6 14.5L16 6L26 14.5"
            stroke="#f97316"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="11" y="14.5" width="10" height="11" rx="2.5" fill="white" />
        </svg>
      </span>
      <span className="inline-flex items-center gap-1.5 text-[17px] sm:text-[18px] tracking-tight">
        <span className="font-bold text-zinc-900">La casita</span>
        <span className="font-light text-orange-500" aria-hidden="true">
          |
        </span>
        <span className="font-semibold text-zinc-500">Mathi</span>
      </span>
    </a>
  );
};
