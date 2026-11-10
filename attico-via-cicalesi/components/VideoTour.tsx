'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Reveal } from './Reveal';
import { IconPlay } from './Icons';

const VIDEOS = [
  { id: 'v1', src: '/media/reel-1.mp4', poster: '/media/reel-1.jpg', title: 'Tour 360° della zona giorno al 4° Piano Ristrutturato', dur: '0:45' },
  { id: 'v2', src: '/media/reel-2.mp4', poster: '/media/reel-2.jpg', title: 'Panoramica Drone su Via Cicalesi e Vista Montagne', dur: '0:30' },
  { id: 'v3', src: '/media/reel-3.mp4', poster: '/media/reel-3.jpg', title: 'La Scala Interna e gli Spazi del 5° Piano', dur: '0:40' },
];

/** Anteprima muta che parte solo quando la card è visibile (risparmio dati da mobile). */
function ReelPreview({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()),
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
    />
  );
}

export function VideoTour() {
  const [open, setOpen] = useState<(typeof VIDEOS)[number] | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <section id="video-tour" className="bg-ink py-24 text-white sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow !text-bronze-light">04 — Media & Video Tour</p>
            <h2 className="mt-5 font-display text-[2rem] leading-[1.08] sm:text-5xl">Esplora l’Attico in Anteprima</h2>
          </div>
          <p className="max-w-sm text-white/60">Tre reel verticali per capire spazi, luce e vista prima ancora di salire in ascensore.</p>
        </Reveal>

        {/* Mobile: carosello orizzontale con snap. Desktop: griglia a 3. */}
        <div className="-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {VIDEOS.map((v, i) => (
            <Reveal key={v.id} delay={i * 0.08} className="w-[72vw] shrink-0 snap-center md:w-auto">
              <button
                onClick={() => setOpen(v)}
                className="group relative block aspect-[9/16] w-full overflow-hidden rounded-3xl text-left media-fallback focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze-light"
                aria-label={`Guarda: ${v.title}`}
              >
                <ReelPreview src={v.src} poster={v.poster} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
                  Video {i + 1} · {v.dur}
                </span>
                <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-ink transition group-hover:scale-110">
                  <IconPlay className="ml-0.5 h-4 w-4" />
                </span>
                <p className="absolute inset-x-5 bottom-5 font-display text-xl leading-snug">{v.title}</p>
              </button>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href="#prenota" className="btn-primary">Visto abbastanza? Prenota la visita dal vivo</a>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-ink/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="relative aspect-[9/16] h-[85svh] max-w-full overflow-hidden rounded-3xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <video src={open.src} poster={open.poster} controls autoPlay playsInline className="h-full w-full object-contain" />
            </motion.div>
            <button
              onClick={() => setOpen(null)}
              className="absolute right-5 top-5 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur hover:bg-white/20"
            >
              Chiudi ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
