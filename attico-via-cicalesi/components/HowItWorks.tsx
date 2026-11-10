import { Reveal } from './Reveal';

const STEPS = [
  ['Scegli l’orario', 'Seleziona lo slot orario per la tua visita guidata.'],
  ['Poche domande', 'Rispondi a pochissime domande per personalizzare il tuo sopralluogo.'],
  ['Conferma su WhatsApp', 'Ricevi la conferma con la posizione esatta su WhatsApp.'],
  ['Visita privata', 'Incontra il nostro consulente dedicato sul posto, in Via Cicalesi.'],
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
      <Reveal className="max-w-2xl">
        <p className="eyebrow">05 — Come Funziona il Sopralluogo</p>
        <h2 className="h-section mt-5">Dalla prenotazione alla visita, in quattro passaggi.</h2>
      </Reveal>

      <div role="list" className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(([t, d], i) => (
          <Reveal key={t} delay={i * 0.08}>
            <div role="listitem" className="relative border-t border-ink pt-6">
              <span className="font-display text-5xl italic text-bronze">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 text-lg font-semibold">{t}</h3>
              <p className="mt-2 leading-relaxed text-ink/70">{d}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-12">
        <a href="#prenota" className="btn-primary">Inizia dal passo 1</a>
      </div>
    </section>
  );
}
