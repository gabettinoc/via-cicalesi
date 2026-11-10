import { NextResponse } from 'next/server';
import { buildSlots, type SlotStatus } from '@/lib/booking';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.GAS_WEB_APP_URL;

  // Modalità sviluppo senza backend: tutti gli slot liberi.
  if (!url) {
    const slots: SlotStatus[] = buildSlots().map((slot) => ({ slot, available: true }));
    return NextResponse.json({ ok: true, closed: false, slots, demo: true });
  }

  try {
    const res = await fetch(`${url}?action=slots`, { cache: 'no-store', redirect: 'follow' });
    const data = await res.json();
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ ok: false, error: 'UPSTREAM' }, { status: 502 });
  }
}
