import { BookingForm } from './BookingForm';
import { Reveal } from './Reveal';

export function BookingSection() {
  return (
    <section id="prenota" className="bg-sand/60 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">06 — Prenota la Visita</p>
          <h2 className="h-section mt-5">Scegli l’orario e prenota la tua visita esclusiva</h2>
          <p className="mt-5 text-[17px] leading-relaxed text-ink/75">
            Open Day con visite private di 15 minuti — <b className="text-ink">Sabato 21 Novembre dalle 9:00 alle 13:00</b>.
          </p>
          <ul className="mt-8 space-y-3 text-[15px] text-ink/75">
            <li>— Una famiglia alla volta, nessuna sovrapposizione</li>
            <li>— Consulente dedicato sul posto</li>
            <li>— Gli slot si esauriscono: gli orari grigi sono già prenotati</li>
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7">
          <BookingForm />
        </Reveal>
      </div>
    </section>
  );
}
