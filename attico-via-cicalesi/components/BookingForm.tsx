'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CANALE_OPTIONS,
  EVENT,
  SITUAZIONE_OPTIONS,
  TEMPI_OPTIONS,
  buildIcs,
  buildSlots,
  validateBooking,
  type BookingPayload,
  type SlotStatus,
} from '@/lib/booking';
import { IconArrow, IconCheck } from './Icons';

type Form = Omit<BookingPayload, 'privacy'> & { privacy: boolean; website: string };

const EMPTY: Form = {
  nome: '', cognome: '', telefono: '', indirizzo: '',
  situazione: '', tempi: '', canale: '', slot: '', privacy: false, website: '',
};

const STEP_FIELDS: (keyof Form)[][] = [
  ['slot'],
  ['situazione', 'tempi', 'canale'],
  ['nome', 'cognome', 'telefono', 'indirizzo', 'privacy'],
];

const STEP_LABELS = ['Orario', 'Profilo', 'Contatti'];

const ERROR_MSG: Record<string, string> = {
  SLOT_TAKEN: 'Questo orario è appena stato prenotato da un’altra persona. Scegline un altro, la lista è aggiornata.',
  DUPLICATE_PHONE: 'Con questo numero risulta già una prenotazione. Per modificarla scrivici su WhatsApp.',
  BOOKINGS_CLOSED: 'Le prenotazioni per l’Open Day sono chiuse. Scrivici su WhatsApp per una visita in un’altra data.',
  BUSY: 'Molte richieste in questo momento. Riprova tra qualche secondo.',
  DEFAULT: 'Qualcosa non ha funzionato. Riprova oppure contattaci su WhatsApp.',
};

const AGENCY_WA = process.env.NEXT_PUBLIC_AGENCY_WHATSAPP || '';

/** Preseleziona il canale di provenienza dai parametri UTM delle campagne. */
function guessCanale(): string {
  if (typeof window === 'undefined') return '';
  const q = new URLSearchParams(window.location.search);
  const src = `${q.get('utm_source') || ''} ${q.get('fbclid') ? 'facebook' : ''}`.toLowerCase();
  if (/facebook|instagram|tiktok|\bfb\b|\big\b|meta/.test(src)) return CANALE_OPTIONS[1];
  if (/immobiliare|idealista|casa\.it|casait/.test(src)) return CANALE_OPTIONS[0];
  return '';
}

export function BookingForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slots, setSlots] = useState<SlotStatus[] | null>(null);
  const [closed, setClosed] = useState(false);
  const [slotsError, setSlotsError] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [banner, setBanner] = useState('');

  const loadSlots = useCallback(async () => {
    try {
      const r = await fetch('/api/slots', { cache: 'no-store' });
      const d = await r.json();
      if (!d.ok) throw new Error();
      setSlots(d.slots);
      setClosed(Boolean(d.closed));
      setSlotsError(false);
      // Se lo slot scelto nel frattempo è stato preso, deselezionalo.
      setForm((f) =>
        f.slot && !d.slots.find((s: SlotStatus) => s.slot === f.slot)?.available ? { ...f, slot: '' } : f,
      );
    } catch {
      setSlotsError(true);
    }
  }, []);

  useEffect(() => {
    loadSlots();
    const canale = guessCanale();
    if (canale) setForm((f) => ({ ...f, canale }));
    const id = setInterval(loadSlots, 30_000);
    const onFocus = () => loadSlots();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', onFocus);
    };
  }, [loadSlots]);

  const freeCount = useMemo(() => slots?.filter((s) => s.available).length ?? 0, [slots]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => {
      const { [k as string]: _, ...rest } = e;
      return rest;
    });
  };

  const stepErrors = (s: number) => {
    const all = validateBooking(form);
    return Object.fromEntries(Object.entries(all).filter(([k]) => STEP_FIELDS[s].includes(k as keyof Form)));
  };

  const next = () => {
    const e = stepErrors(step);
    setErrors(e);
    if (Object.keys(e).length) return;
    setBanner('');
    setStep((s) => s + 1);
    document.getElementById('prenota')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (step < 2) return next();

    const e = validateBooking(form);
    setErrors(e);
    if (Object.keys(e).length) {
      const firstBad = STEP_FIELDS.findIndex((fs) => fs.some((f) => e[f as string]));
      if (firstBad < step) setStep(firstBad);
      return;
    }

    setStatus('sending');
    setBanner('');
    try {
      const r = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (d.ok) {
        setStatus('done');
        // Evento di conversione per GTM / GA4 / Meta (se installati).
        const w = window as unknown as { dataLayer?: unknown[]; fbq?: (...a: unknown[]) => void };
        w.dataLayer?.push({ event: 'generate_lead', slot: form.slot, situazione: form.situazione, tempi: form.tempi });
        w.fbq?.('track', 'Lead');
        return;
      }
      setStatus('idle');
      if (d.error === 'SLOT_TAKEN') {
        await loadSlots();
        setForm((f) => ({ ...f, slot: '' }));
        setStep(0);
      }
      if (d.error === 'VALIDATION' && d.fields) setErrors(d.fields);
      setBanner(ERROR_MSG[d.error] || ERROR_MSG.DEFAULT);
    } catch {
      setStatus('idle');
      setBanner(ERROR_MSG.DEFAULT);
    }
  };

  const downloadIcs = () => {
    const blob = new Blob([buildIcs(form.slot)], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'visita-attico-via-cicalesi.ics';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const waText = encodeURIComponent(
    `Ciao, sono ${form.nome} ${form.cognome}. Ho prenotato la visita all'attico in Via Cicalesi per ${EVENT.label} alle ${form.slot.slice(0, 5)}. Mi inviate la posizione esatta?`,
  );

  /* ----------------------------- SUCCESSO ----------------------------- */
  if (status === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-white p-8 text-center shadow-soft sm:p-12"
        role="status"
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-forest text-white">
          <IconCheck className="h-8 w-8" />
        </div>
        <h3 className="mt-6 font-display text-3xl">Visita confermata, {form.nome}.</h3>
        <p className="mt-3 text-ink/70">
          Ti aspettiamo <b className="text-ink">{EVENT.label}</b> alle <b className="text-ink">{form.slot.slice(0, 5)}</b> in Via
          Cicalesi. Riceverai su WhatsApp al numero <b className="text-ink">{form.telefono}</b> la posizione esatta e un
          promemoria.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {AGENCY_WA && (
            <a href={`https://wa.me/${AGENCY_WA}?text=${waText}`} target="_blank" rel="noopener" className="btn-primary">
              Ricevi subito la posizione su WhatsApp
            </a>
          )}
          <button type="button" onClick={downloadIcs} className="rounded-full border border-stone px-7 py-4 font-semibold hover:bg-sand">
            Aggiungi al calendario
          </button>
        </div>
      </motion.div>
    );
  }

  /* ------------------------------ FORM ------------------------------- */
  return (
    <form onSubmit={submit} noValidate className="rounded-3xl bg-white p-5 shadow-soft sm:p-10">
      {/* Progress */}
      <div className="mb-8 flex items-center gap-2" aria-label={`Passaggio ${step + 1} di 3`}>
        {STEP_LABELS.map((l, i) => (
          <button
            type="button"
            key={l}
            onClick={() => i < step && setStep(i)}
            disabled={i > step}
            className="flex flex-1 flex-col gap-2 text-left disabled:cursor-default"
          >
            <span className={`h-1 rounded-full transition-colors ${i <= step ? 'bg-bronze' : 'bg-sand'}`} />
            <span className={`text-xs font-semibold uppercase tracking-eyebrow ${i === step ? 'text-ink' : 'text-mute'}`}>
              {i + 1}. {l}
            </span>
          </button>
        ))}
      </div>

      {banner && (
        <p role="alert" className="mb-6 rounded-xl bg-bronze/10 px-4 py-3 text-sm text-bronze-dark">{banner}</p>
      )}

      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={(e) => set('website', e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          {step === 0 && (
            <fieldset>
              <legend className="font-display text-2xl">Scegli il tuo orario</legend>
              <p className="mt-1 text-sm text-mute">
                {EVENT.label} · visite da 15 minuti
                {slots && !closed && <> · <b className="text-forest">{freeCount} slot liberi</b></>}
              </p>

              {slotsError && (
                <p className="mt-5 text-sm text-bronze-dark">
                  Impossibile caricare gli orari.{' '}
                  <button type="button" onClick={loadSlots} className="underline">Riprova</button>
                </p>
              )}
              {closed && <p className="mt-5 text-sm text-bronze-dark">{ERROR_MSG.BOOKINGS_CLOSED}</p>}

              <div className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                {(slots ?? Array.from({ length: buildSlots().length }, () => null)).map((s, i) =>
                  s === null ? (
                    <div key={i} className="h-[58px] animate-pulse rounded-xl bg-sand" />
                  ) : (
                    <label
                      key={s.slot}
                      className={`relative flex h-[58px] cursor-pointer flex-col items-center justify-center rounded-xl border text-center transition
                        ${!s.available ? 'cursor-not-allowed border-transparent bg-sand/70 text-mute/50 line-through' : ''}
                        ${s.available && form.slot === s.slot ? 'border-bronze bg-bronze text-white shadow-soft' : ''}
                        ${s.available && form.slot !== s.slot ? 'border-stone hover:border-bronze' : ''}`}
                    >
                      <input
                        type="radio"
                        name="slot"
                        value={s.slot}
                        disabled={!s.available}
                        checked={form.slot === s.slot}
                        onChange={() => set('slot', s.slot)}
                        className="sr-only"
                      />
                      <span className="text-[15px] font-semibold">{s.slot.slice(0, 5)}</span>
                      <span className="text-[11px] opacity-70">{s.available ? `→ ${s.slot.slice(8)}` : 'Occupato'}</span>
                    </label>
                  ),
                )}
              </div>
              {errors.slot && <p className="mt-3 text-sm text-bronze-dark">{errors.slot}</p>}
            </fieldset>
          )}

          {step === 1 && (
            <div className="space-y-8">
              <ChoiceGroup
                legend="Qual è la tua situazione d’acquisto?"
                hint="Ci aiuta a preparare la visita con le informazioni giuste per te."
                name="situazione"
                options={SITUAZIONE_OPTIONS}
                value={form.situazione}
                onChange={(v) => set('situazione', v)}
                error={errors.situazione}
              />
              <ChoiceGroup
                legend="Entro quando vorresti concludere?"
                name="tempi"
                options={TEMPI_OPTIONS}
                value={form.tempi}
                onChange={(v) => set('tempi', v)}
                error={errors.tempi}
                compact
              />
              <ChoiceGroup
                legend="Dove hai visto l’annuncio?"
                name="canale"
                options={CANALE_OPTIONS}
                value={form.canale}
                onChange={(v) => set('canale', v)}
                error={errors.canale}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="font-display text-2xl">Ultimo passo: i tuoi contatti</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nome" error={errors.nome}>
                  <input className="field" value={form.nome} onChange={(e) => set('nome', e.target.value)} autoComplete="given-name" />
                </Field>
                <Field label="Cognome" error={errors.cognome}>
                  <input className="field" value={form.cognome} onChange={(e) => set('cognome', e.target.value)} autoComplete="family-name" />
                </Field>
              </div>
              <Field label="Telefono WhatsApp" hint="Per inviarti promemoria e posizione GPS" error={errors.telefono}>
                <input
                  className="field"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="333 123 4567"
                  value={form.telefono}
                  onChange={(e) => set('telefono', e.target.value)}
                />
              </Field>
              <Field label="Indirizzo di residenza" error={errors.indirizzo}>
                <input
                  className="field"
                  autoComplete="street-address"
                  placeholder="Via, numero civico, città"
                  value={form.indirizzo}
                  onChange={(e) => set('indirizzo', e.target.value)}
                />
              </Field>

              <label className="flex cursor-pointer items-start gap-3 pt-2 text-sm leading-relaxed text-ink/75">
                <input
                  type="checkbox"
                  checked={form.privacy}
                  onChange={(e) => set('privacy', e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-bronze"
                />
                <span>
                  Ho letto l’<a href="/privacy" target="_blank" className="underline">informativa privacy</a> e acconsento al
                  trattamento dei miei dati per organizzare la visita e ricevere comunicazioni via WhatsApp relative a questo
                  immobile.
                </span>
              </label>
              {errors.privacy && <p className="text-sm text-bronze-dark">{errors.privacy}</p>}

              <div className="rounded-xl bg-ivory px-4 py-3 text-sm">
                Riepilogo: <b>{EVENT.label}, ore {form.slot.slice(0, 5)}</b> · Via Cicalesi
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center gap-3">
        {step > 0 && (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="rounded-full px-5 py-4 font-semibold text-mute hover:text-ink">
            Indietro
          </button>
        )}
        <button type="submit" disabled={status === 'sending' || closed} className="btn-primary flex-1">
          {status === 'sending' ? 'Invio in corso…' : step < 2 ? <>Continua <IconArrow className="h-4 w-4" /></> : 'Conferma la visita privata'}
        </button>
      </div>
      <p className="mt-4 text-center text-xs text-mute">Gratuito e senza impegno · Meno di 60 secondi</p>
    </form>
  );
}

/* --------------------------- sotto-componenti --------------------------- */

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-mute">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-bronze-dark">{error}</span>}
    </label>
  );
}

function ChoiceGroup({
  legend, hint, name, options, value, onChange, error, compact,
}: {
  legend: string;
  hint?: string;
  name: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  compact?: boolean;
}) {
  return (
    <fieldset>
      <legend className="font-display text-xl">{legend}</legend>
      {hint && <p className="mt-1 text-sm text-mute">{hint}</p>}
      <div className={`mt-4 grid gap-2 ${compact ? 'grid-cols-2 sm:grid-cols-4' : ''}`}>
        {options.map((o) => {
          const active = value === o;
          return (
            <label
              key={o}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-[15px] leading-snug transition
                ${active ? 'border-bronze bg-bronze/5 ring-1 ring-bronze' : 'border-stone hover:border-bronze/60'}`}
            >
              <input type="radio" name={name} value={o} checked={active} onChange={() => onChange(o)} className="sr-only" />
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${active ? 'border-bronze bg-bronze' : 'border-stone'}`}>
                {active && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>
              {o}
            </label>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-bronze-dark">{error}</p>}
    </fieldset>
  );
}
