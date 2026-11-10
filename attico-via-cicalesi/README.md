# Landing Page — Attico Duplex Via Cicalesi, Nocera Inferiore

Next.js 15 · Tailwind CSS · Framer Motion · Backend su Google Fogli + Apps Script.

```
app/
  page.tsx            → composizione delle sezioni
  layout.tsx          → font, SEO, Open Graph, dati strutturati
  api/slots/route.ts  → proxy GET verso Apps Script (slot liberi/occupati)
  api/book/route.ts   → proxy POST verso Apps Script (salvataggio lead)
  privacy/page.tsx    → modello di informativa (da completare)
components/           → Hero, Manifesto, Scenarios, TechSpecs, VideoTour, HowItWorks, BookingForm…
lib/booking.ts        → opzioni del form, slot, validazione, file .ics
google-apps-script/code.gs → backend da incollare nel Foglio Google
public/media/         → foto e video (vedi elenco sotto)
```

## 1. Backend Google (10 minuti)

1. Crea un nuovo Foglio Google (es. "Lead Attico Via Cicalesi").
2. **Estensioni → Apps Script**, cancella il contenuto e incolla `google-apps-script/code.gs`.
3. In `CONFIG` imposta, se vuoi, `NOTIFY_EMAIL` (email ad ogni prenotazione) e `SHARED_SECRET` (una stringa a caso).
4. Esegui una volta la funzione **`setup`** e accetta le autorizzazioni: crea il foglio "Prenotazioni" con le 9 colonne.
5. **Distribuisci → Nuova distribuzione → App web**
   - Esegui come: **Me**
   - Chi ha accesso: **Chiunque**
6. Copia l'URL che termina in `/exec`.

> Ogni volta che modifichi `code.gs` serve **Distribuisci → Gestisci distribuzioni → Modifica → Nuova versione**, altrimenti l'URL continua a servire la versione vecchia.

Per liberare uno slot (disdetta) basta **cancellare la riga** dal foglio: il sito lo mostra di nuovo libero entro 30 secondi.

## 2. Frontend

```bash
npm install
cp .env.example .env.local   # incolla GAS_WEB_APP_URL, secret, numero WhatsApp agenzia
npm run dev
```

Senza `GAS_WEB_APP_URL` il sito gira in modalità demo (tutti gli slot liberi, nessun salvataggio).
Deploy consigliato: **Vercel** → importa il repository e inserisci le stesse variabili d'ambiente.

## 3. Media da caricare in `public/media/`

| File | Contenuto | Formato consigliato |
|---|---|---|
| `hero.mp4` + `hero.jpg` | Video cinematico: vista montagne, facciata parco, zona giorno 4° piano | 1920×1080, < 8 MB, senza audio |
| `living.jpg`, `vista.jpg`, `scala.jpg` | Galleria del Manifesto | 1600 px lato lungo |
| `reel-1.mp4` + `.jpg` | Tour 360° zona giorno 4° piano | 1080×1920 (9:16) |
| `reel-2.mp4` + `.jpg` | Panoramica drone Via Cicalesi e montagne | 1080×1920 |
| `reel-3.mp4` + `.jpg` | Scala interna e 5° piano | 1080×1920 |
| `og.jpg` | Anteprima condivisione social | 1200×630 |

Finché un file manca, al suo posto compare un gradiente neutro (il layout non si rompe).

## Come funzionano gli slot

- Il form chiede gli orari a `/api/slots`, che interroga il `doGet`: uno slot è occupato se compare nella colonna "Slot Orario Selezionato", oppure se l'orario è già passato.
- La lista si aggiorna ogni 30 secondi e quando l'utente torna sulla scheda.
- Il `doPost` usa un **lock**: se due persone confermano lo stesso slot nello stesso istante, la seconda riceve "slot appena prenotato" e torna alla scelta con la lista aggiornata.
- Opzionale (attivo di default): un numero di telefono può prenotare un solo slot.

## Conferma WhatsApp

La pagina di successo mostra il pulsante **"Ricevi subito la posizione su WhatsApp"**, che apre la chat con l'agenzia con un messaggio già compilato (nome + orario): l'agenzia risponde inviando la posizione.
Per un invio **completamente automatico** serve WhatsApp Business API (es. tramite il tuo provider WhatsApp): si aggancia nel `doPost` dopo `appendRow`, chiamando l'API del provider con il numero e l'orario.

## Tracciamento

Al successo il form invia `generate_lead` al `dataLayer` (GTM/GA4) e `fbq('track','Lead')` se il Pixel Meta è installato.
Il campo "Dove hai visto l'annuncio?" viene preselezionato dai parametri `utm_source` / `fbclid` delle campagne.

## Prima di pubblicare

- Completa `app/privacy/page.tsx` con i dati dell'agenzia.
- Verifica la data dell'evento in `lib/booking.ts` e in `CONFIG.EVENT_DATE` di `code.gs` (impostata a **sabato 21/11/2026**).
- Se aggiungi o cambi un'opzione del form, aggiornala in **entrambi** i file.
