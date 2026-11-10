// Icone lineari minimali (stroke 1.5), nessuna dipendenza esterna.
type P = { className?: string };
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
};

export const IconBuilding = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M4 21V7l8-4 8 4v14M9 21v-4h6v4M8 10h.01M12 10h.01M16 10h.01M8 13.5h.01M12 13.5h.01M16 13.5h.01" />
  </svg>
);
export const IconSun = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M3 18h18M6 18a6 6 0 0 1 12 0M12 5V3M5.6 8.6 4.2 7.2M18.4 8.6l1.4-1.4M3 13h1M20 13h1" />
  </svg>
);
export const IconTools = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M12 3v3M12 18v3M4.2 7.5l2.6 1.5M17.2 15l2.6 1.5M4.2 16.5 6.8 15M17.2 9l2.6-1.5" />
    <circle cx="12" cy="12" r="3.5" />
  </svg>
);
export const IconGarage = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M3 21V9l9-5 9 5v12M7 21v-8h10v8M7 16h10M7 19h10" />
  </svg>
);
export const IconFamily = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden>
    <circle cx="8" cy="7" r="2.5" /><circle cx="16" cy="7" r="2.5" /><circle cx="12" cy="13" r="2" />
    <path d="M3.5 20c0-3 2-5 4.5-5M20.5 20c0-3-2-5-4.5-5M9 21c0-2 1.3-3.5 3-3.5s3 1.5 3 3.5" />
  </svg>
);
export const IconLayers = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" />
  </svg>
);
export const IconDesk = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden>
    <rect x="4" y="4" width="16" height="11" rx="1.5" /><path d="M9 20h6M12 15v5" />
  </svg>
);
export const IconPlay = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg>
);
export const IconCheck = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const IconArrow = ({ className }: P) => (
  <svg {...base} className={className} aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
