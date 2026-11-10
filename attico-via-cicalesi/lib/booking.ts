// Costanti condivise tra form, API route e (in copia) Google Apps Script.
// Se modifichi un'opzione qui, aggiornala anche in google-apps-script/code.gs.

export const EVENT = {
  label: 'Sabato 21 Novembre',
  date: '2026-11-21',
  start: '09:00',
  end: '13:00',
  stepMin: 15,
  timezone: 'Europe/Rome',
  place: 'Via Cicalesi, Nocera Inferiore (SA)',
} as const;

export const SITUAZIONE_OPTIONS = [
  'Devo fare mutuo e ho già fatto la pre-consulenza bancaria',
  'Devo fare mutuo ma NON ho ancora fatto una consulenza',
  'Devo prima vendere un altro immobile per poter acquistare',
  'Ho disponibilità immediata (Senza mutuo / Liquidità pronta)',
] as const;

export const TEMPI_OPTIONS = ['Entro 1 mese', 'Da 1 a 3 mesi', 'Da 3 a 6 mesi', '1 anno'] as const;

export const CANALE_OPTIONS = [
  'Portali Immobiliari (Immobiliare.it, Idealista, Casa.it)',
  'Facebook / Instagram / TikTok',
  "Proposta/Contatto diretto dall'Ufficio",
] as const;

export type SlotStatus = { slot: string; available: boolean };

export type BookingPayload = {
  nome: string;
  cognome: string;
  telefono: string;
  indirizzo: string;
  situazione: string;
  tempi: string;
  canale: string;
  slot: string;
  privacy: boolean;
};

export function buildSlots(): string[] {
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const fmt = (m: number) =>
    `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const out: string[] = [];
  for (let m = toMin(EVENT.start); m + EVENT.stepMin <= toMin(EVENT.end); m += EVENT.stepMin) {
    out.push(`${fmt(m)} - ${fmt(m + EVENT.stepMin)}`);
  }
  return out;
}

export function normalizePhone(raw: string): string {
  let x = raw.replace(/[\s.\-()/]/g, '');
  if (x.startsWith('00')) x = '+' + x.slice(2);
  if (!x.startsWith('+') && /^[03]\d{5,10}$/.test(x)) x = '+39' + x;
  return x;
}

export function validateBooking(d: Partial<BookingPayload>): Record<string, string> {
  const e: Record<string, string> = {};
  const s = (v: unknown) => String(v ?? '').trim();
  if (s(d.nome).length < 2) e.nome = 'Inserisci il tuo nome';
  if (s(d.cognome).length < 2) e.cognome = 'Inserisci il tuo cognome';
  if (!/^\+\d{8,15}$/.test(normalizePhone(s(d.telefono)))) e.telefono = 'Numero non valido';
  if (s(d.indirizzo).length < 5) e.indirizzo = 'Inserisci città e via di residenza';
  if (!(SITUAZIONE_OPTIONS as readonly string[]).includes(s(d.situazione))) e.situazione = 'Seleziona un’opzione';
  if (!(TEMPI_OPTIONS as readonly string[]).includes(s(d.tempi))) e.tempi = 'Seleziona un’opzione';
  if (!(CANALE_OPTIONS as readonly string[]).includes(s(d.canale))) e.canale = 'Seleziona un’opzione';
  if (!buildSlots().includes(s(d.slot))) e.slot = 'Seleziona un orario';
  if (d.privacy !== true) e.privacy = 'Il consenso è necessario per prenotare';
  return e;
}

/** File .ics per "Aggiungi al calendario". */
export function buildIcs(slot: string): string {
  const [start, end] = slot.split(' - ');
  const d = EVENT.date.replace(/-/g, '');
  const t = (x: string) => x.replace(':', '') + '00';
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Attico Via Cicalesi//Open Day//IT',
    'BEGIN:VEVENT',
    `UID:${d}-${t(start)}@attico-via-cicalesi`,
    `DTSTART;TZID=${EVENT.timezone}:${d}T${t(start)}`,
    `DTEND;TZID=${EVENT.timezone}:${d}T${t(end)}`,
    'SUMMARY:Visita privata – Attico Duplex Via Cicalesi',
    `LOCATION:${EVENT.place}`,
    'DESCRIPTION:Riceverai la posizione esatta su WhatsApp.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
