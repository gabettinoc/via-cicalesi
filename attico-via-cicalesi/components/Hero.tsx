'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { IconPlay } from './Icons';

export function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 120]);
  const scale = useTransform(scrollY, [0, 600], [1.05, reduce ? 1.05 : 1.15]);

  const fade = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink text-white">
      {/* Visual: video cinematico con poster; se il video non c'è resta il poster/gradiente */}
      <motion.div style={{ y, scale }} className="media-fallback absolute inset-0">
        <video
          className="h-full w-full object-cover"
          src="/media/hero.mp4"
          poster="/media/hero.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-32 sm:pb-20">
        <motion.p {...fade(0.1)} className="eyebrow !text-bronze-light">
          Open Day · Sabato 21 Novembre · Visite private
        </motion.p>

        <motion.h1
          {...fade(0.2)}
          className="mt-5 max-w-3xl font-display text-[2.6rem] leading-[1.02] tracking-[-0.02em] sm:text-7xl"
        >
          Il Tuo Attico Duplex Esclusivo nel Cuore di <span className="italic">Nocera Inferiore.</span>
        </motion.h1>

        <motion.p {...fade(0.35)} className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/85 sm:text-lg">
          Spaziosa dimora su due livelli con vista panoramica sulle montagne, parco antisismico, garage privato di 22 mq
          e massima indipendenza per tutta la famiglia.
        </motion.p>

        <motion.div {...fade(0.45)} className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="text-sm uppercase tracking-eyebrow text-white/60">Via Cicalesi — Richiesta</span>
          <span className="font-display text-4xl">€ 330.000</span>
        </motion.div>

        <motion.div {...fade(0.55)} className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href="#prenota" className="btn-primary">Prenota la tua Visita Privata</a>
          <a href="#video-tour" className="btn-ghost">
            <IconPlay className="h-4 w-4" /> Guarda il Video Tour
          </a>
        </motion.div>

        <motion.ul
          {...fade(0.7)}
          className="mt-12 grid grid-cols-3 gap-4 border-t border-white/15 pt-6 text-[13px] text-white/75 sm:max-w-xl"
        >
          <li><b className="block font-display text-2xl font-normal text-white">2</b>livelli collegati</li>
          <li><b className="block font-display text-2xl font-normal text-white">22 mq</b>garage privato</li>
          <li><b className="block font-display text-2xl font-normal text-white">€ 95</b>condominio / mese</li>
        </motion.ul>
      </div>
    </section>
  );
}
