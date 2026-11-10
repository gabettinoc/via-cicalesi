import { Reveal } from './Reveal';
import { IconDesk, IconFamily, IconLayers } from './Icons';

const CARDS = [
  {
    n: 'A',
    Icon: IconFamily,
    title: 'Soluzione per Famiglia Numerosa',
    text: 'Ampi spazi di rappresentanza per il giorno e zona notte riservata per garantire a tutti la propria privacy.',
    tag: 'Spazio per crescere',
  },
  {
    n: 'B',
    Icon: IconLayers,
    title: 'Doppio Nucleo Familiare (Genitori + Figli)',
    text: 'Due livelli collegati internamente ma indipendenti, ideali per vivere vicini mantenendo la propria autonomia.',
    tag: 'Vicini, ma indipendenti',
  },
  {
    n: 'C',
    Icon: IconDesk,
    title: 'Casa + Studio Professionale',
    text: 'Possibilità di dedicare l’intero livello superiore ad area lavoro o studio privato ad alta rappresentanza.',
    tag: 'Lavoro a un piano di distanza',
  },
];

export function Scenarios() {
  return (
    <section id="soluzioni" className="bg-sand/60 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">02 — Le Destinazioni d’Uso</p>
          <h2 className="h-section mt-5">Un Immobile, Molteplici Soluzioni Abitative</h2>
          <p className="mt-5 text-[17px] leading-relaxed text-ink/70">
            Due piani, una scala interna, infinite combinazioni. Immagina come lo abiterebbe la tua famiglia.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {CARDS.map(({ n, Icon, title, text, tag }, i) => (
            <Reveal key={n} delay={i * 0.08}>
              <article className="group flex h-full flex-col rounded-3xl bg-ivory p-7 shadow-[0_1px_0_rgba(28,26,23,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-soft sm:p-8">
                <div className="flex items-center justify-between">
                  <Icon className="h-9 w-9 text-bronze" />
                  <span className="font-display text-5xl italic text-stone transition group-hover:text-bronze-light">{n}</span>
                </div>
                <h3 className="mt-8 font-display text-2xl leading-tight">{title}</h3>
                <p className="mt-4 flex-1 leading-relaxed text-ink/70">{text}</p>
                <p className="mt-8 border-t border-stone/60 pt-4 text-xs font-semibold uppercase tracking-eyebrow text-forest">
                  {tag}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
