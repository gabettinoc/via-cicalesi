'use client';

import { useEffect, useState } from 'react';

export function Header() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid ? 'bg-ivory/90 text-ink shadow-[0_1px_0_rgba(28,26,23,0.08)] backdrop-blur-md' : 'text-white'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="font-display text-lg tracking-tight">
          Attico <span className="italic">Via Cicalesi</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <a href="#manifesto" className="opacity-80 hover:opacity-100">L’immobile</a>
          <a href="#soluzioni" className="opacity-80 hover:opacity-100">Soluzioni</a>
          <a href="#scheda" className="opacity-80 hover:opacity-100">Scheda tecnica</a>
          <a href="#video-tour" className="opacity-80 hover:opacity-100">Video</a>
        </nav>
        <a
          href="#prenota"
          className="rounded-full bg-bronze px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-bronze-dark"
        >
          Prenota visita
        </a>
      </div>
    </header>
  );
}
