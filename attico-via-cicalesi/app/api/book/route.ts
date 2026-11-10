import { NextResponse } from 'next/server';
import { normalizePhone, validateBooking, type BookingPayload } from '@/lib/booking';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: Partial<BookingPayload> & { website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'INVALID_JSON' }, { status: 400 });
  }

  // Honeypot anti-bot: un campo nascosto che gli umani non compilano.
  if (body.website) return NextResponse.json({ ok: true, slot: body.slot });

  const errors = validateBooking(body);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: 'VALIDATION', fields: errors }, { status: 422 });
  }

  const payload = {
    nome: body.nome!.trim(),
    cognome: body.cognome!.trim(),
    telefono: normalizePhone(body.telefono!.trim()),
    indirizzo: body.indirizzo!.trim(),
    situazione: body.situazione,
    tempi: body.tempi,
    canale: body.canale,
    slot: body.slot,
    privacy: true,
    secret: process.env.GAS_SHARED_SECRET || '',
  };

  const url = process.env.GAS_WEB_APP_URL;
  if (!url) return NextResponse.json({ ok: true, slot: payload.slot, demo: true });

  try {
    // Apps Script risponde con un 302: fetch lo segue e restituisce il JSON finale.
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      cache: 'no-store',
    });
    const data = await res.json();
    const status = data.ok ? 200 : data.error === 'SLOT_TAKEN' || data.error === 'DUPLICATE_PHONE' ? 409 : 400;
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ ok: false, error: 'UPSTREAM' }, { status: 502 });
  }
}
