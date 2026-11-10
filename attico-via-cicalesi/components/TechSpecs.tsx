import { Reveal } from './Reveal';
import { IconBuilding, IconGarage, IconSun, IconTools } from './Icons';

const SPECS = [
  {
    Icon: IconBuilding,
    title: 'Piano & Struttura',
    lines: ['4° + 5° Piano (ultimo piano)', 'Ascensore', 'Parco antisismico (1979)', 'Accesso disabili'],
  },
  {
    Icon: IconSun,
    title: 'Esposizione & Vista',
    lines: ['Affaccio Nord-Ovest', 'Alta luminosità', 'Vista su verde e montagne'],
  },
  {
    Icon: IconTools,
    title: 'Stato & Impianti',
    lines: [
      '4° piano ristrutturato nel 2016',
      '5° piano costruito nel 2002',
      '4 condizionatori · Riscaldamento autonomo',
      'Doppio vetro · Porta blindata',
    ],
  },
  {
    Icon: IconGarage,
    title: 'Pertinenze & Spese',
    lines: ['Garage privato 22 mq', 'Posti auto condominiali', 'Condominio ~ € 95/mese', 'Classe energetica E'],
  },
];

const FACTS = [
  ['Prezzo di richiesta', '€ 330.000'],
  ['Livelli', '2, con scala interna'],
  ['Climatizzazione', 'Cucina e soggiorno (4°), sala e camera (5°)'],
  ['Arredo', 'Vuoto / non arredato'],
];

export function TechSpecs() {
  return (
    <section id="scheda" className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
      <Reveal className="max-w-2xl">
        <p className="eyebrow">03 — Scheda Tecnica</p>
        <h2 className="h-section mt-5">Le caratteristiche chiave, in un colpo d’occhio.</h2>
      </Reveal>

      <div className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-stone/60 sm:grid-cols-2 lg:grid-cols-4">
        {SPECS.map(({ Icon, title, lines }, i) => (
          <Reveal key={title} delay={i * 0.06} className="bg-ivory p-7">
            <Icon className="h-8 w-8 text-bronze" />
            <h3 className="mt-6 text-[13px] font-semibold uppercase tracking-eyebrow text-ink">{title}</h3>
            <ul className="mt-4 space-y-2 text-[15px] leading-snug text-ink/75">
              {lines.map((l) => (
                <li key={l} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-bronze" />{l}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <dl className="mt-10 divide-y divide-stone/60 border-y border-stone/60">
          {FACTS.map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between">
              <dt className="text-sm text-mute">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
