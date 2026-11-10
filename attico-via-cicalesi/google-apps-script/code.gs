/**
 * ============================================================================
 *  BACKEND PRENOTAZIONI OPEN DAY — Attico Duplex Via Cicalesi, Nocera Inferiore
 * ============================================================================
 *  Da incollare in: Foglio Google > Estensioni > Apps Script > code.gs
 *
 *  Endpoint (App web):
 *    GET  ?action=slots  -> slot disponibili/occupati per l'Open Day
 *    POST (body JSON)    -> salva la prenotazione (con lock anti doppia prenotazione)
 *
 *  Colonne del foglio (ordine esatto):
 *  [Timestamp, Nome, Cognome, Telefono, Indirizzo Residenza,
 *   Situazione Acquisto/Mutuo, Tempi Conclusione Affare,
 *   Canale Provenienza, Slot Orario Selezionato]
 * ============================================================================
 */

const CONFIG = {
  SHEET_NAME: 'Prenotazioni',
  EVENT_LABEL: 'Sabato 21 Novembre 2026',
  EVENT_DATE: '2026-11-21',          // yyyy-MM-dd
  TIMEZONE: 'Europe/Rome',
  START: '09:00',
  END: '13:00',
  STEP_MIN: 15,

  // Stesso valore della variabile GAS_SHARED_SECRET su Next.js (consigliato).
  // Se vuoto, il controllo è disattivato.
  SHARED_SECRET: '',

  // Email a cui notificare ogni nuova prenotazione (vuoto = nessuna email).
  NOTIFY_EMAIL: '',

  // Impedisce che lo stesso numero prenoti più di uno slot.
  ONE_BOOKING_PER_PHONE: true,
};

const HEADERS = [
  'Timestamp',
  'Nome',
  'Cognome',
  'Telefono',
  'Indirizzo Residenza',
  'Situazione Acquisto/Mutuo',
  'Tempi Conclusione Affare',
  'Canale Provenienza',
  'Slot Orario Selezionato',
];

const COL = { TELEFONO: 4, SLOT: 9 };

const OPTIONS = {
  situazione: [
    'Devo fare mutuo e ho già fatto la pre-consulenza bancaria',
    'Devo fare mutuo ma NON ho ancora fatto una consulenza',
    'Devo prima vendere un altro immobile per poter acquistare',
    'Ho disponibilità immediata (Senza mutuo / Liquidità pronta)',
  ],
  tempi: ['Entro 1 mese', 'Da 1 a 3 mesi', 'Da 3 a 6 mesi', '1 anno'],
  canale: [
    'Portali Immobiliari (Immobiliare.it, Idealista, Casa.it)',
    'Facebook / Instagram / TikTok',
    "Proposta/Contatto diretto dall'Ufficio",
  ],
};

/* ------------------------------------------------------------------------- */
/*  ENDPOINTS                                                                */
/* ------------------------------------------------------------------------- */

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'slots';
  if (action !== 'slots') return json_({ ok: false, error: 'UNKNOWN_ACTION' });

  const sheet = getSheet_();
  const booked = new Set(readColumn_(sheet, COL.SLOT));
  const now = new Date();

  const slots = buildSlots_().map(function (slot) {
    return { slot: slot, available: !booked.has(slot) && slotStart_(slot) > now };
  });

  return json_({
    ok: true,
    event: CONFIG.EVENT_LABEL,
    closed: isClosed_(),
    slots: slots,
    updatedAt: now.toISOString(),
  });
}

function doPost(e) {
  let data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, error: 'INVALID_JSON' });
  }

  if (CONFIG.SHARED_SECRET && data.secret !== CONFIG.SHARED_SECRET) {
    return json_({ ok: false, error: 'UNAUTHORIZED' });
  }
  if (isClosed_()) return json_({ ok: false, error: 'BOOKINGS_CLOSED' });

  const v = validate_(data);
  if (!v.ok) return json_({ ok: false, error: 'VALIDATION', fields: v.errors });

  // Lock: due utenti che cliccano lo stesso slot nello stesso istante
  // non possono entrambi prenotarlo.
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (err) {
    return json_({ ok: false, error: 'BUSY' });
  }

  try {
    const sheet = getSheet_();

    if (readColumn_(sheet, COL.SLOT).indexOf(v.data.slot) !== -1 || slotStart_(v.data.slot) <= new Date()) {
      return json_({ ok: false, error: 'SLOT_TAKEN' });
    }
    if (CONFIG.ONE_BOOKING_PER_PHONE && readColumn_(sheet, COL.TELEFONO).indexOf(v.data.telefono) !== -1) {
      return json_({ ok: false, error: 'DUPLICATE_PHONE' });
    }

    const row = [
      new Date(),
      v.data.nome,
      v.data.cognome,
      v.data.telefono,
      v.data.indirizzo,
      v.data.situazione,
      v.data.tempi,
      v.data.canale,
      v.data.slot,
    ].map(safe_);

    sheet.appendRow(row);
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }

  notify_(v.data);
  return json_({ ok: true, slot: v.data.slot });
}

/* ------------------------------------------------------------------------- */
/*  VALIDAZIONE                                                              */
/* ------------------------------------------------------------------------- */

function validate_(d) {
  const errors = {};
  const s = function (x) { return String(x == null ? '' : x).trim().slice(0, 200); };

  const out = {
    nome: s(d.nome),
    cognome: s(d.cognome),
    telefono: normalizePhone_(s(d.telefono)),
    indirizzo: s(d.indirizzo),
    situazione: s(d.situazione),
    tempi: s(d.tempi),
    canale: s(d.canale),
    slot: s(d.slot),
  };

  if (out.nome.length < 2) errors.nome = 'Nome non valido';
  if (out.cognome.length < 2) errors.cognome = 'Cognome non valido';
  if (!/^\+\d{8,15}$/.test(out.telefono)) errors.telefono = 'Telefono non valido';
  if (out.indirizzo.length < 5) errors.indirizzo = 'Indirizzo non valido';
  if (OPTIONS.situazione.indexOf(out.situazione) === -1) errors.situazione = 'Opzione non valida';
  if (OPTIONS.tempi.indexOf(out.tempi) === -1) errors.tempi = 'Opzione non valida';
  if (OPTIONS.canale.indexOf(out.canale) === -1) errors.canale = 'Opzione non valida';
  if (buildSlots_().indexOf(out.slot) === -1) errors.slot = 'Slot non valido';
  if (d.privacy !== true) errors.privacy = 'Consenso privacy obbligatorio';

  return Object.keys(errors).length ? { ok: false, errors: errors } : { ok: true, data: out };
}

function normalizePhone_(p) {
  let x = p.replace(/[\s.\-()\/]/g, '');
  if (x.indexOf('00') === 0) x = '+' + x.slice(2);
  if (x.charAt(0) !== '+' && /^[03]\d{5,10}$/.test(x)) x = '+39' + x;
  return x;
}

/* ------------------------------------------------------------------------- */
/*  HELPERS                                                                  */
/* ------------------------------------------------------------------------- */

function buildSlots_() {
  const toMin = function (t) { const p = t.split(':'); return Number(p[0]) * 60 + Number(p[1]); };
  const fmt = function (m) {
    return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  };
  const out = [];
  for (let m = toMin(CONFIG.START); m + CONFIG.STEP_MIN <= toMin(CONFIG.END); m += CONFIG.STEP_MIN) {
    out.push(fmt(m) + ' - ' + fmt(m + CONFIG.STEP_MIN));
  }
  return out; // ["09:00 - 09:20", ..., "12:40 - 13:00"]
}

function slotStart_(slot) {
  return Utilities.parseDate(CONFIG.EVENT_DATE + ' ' + slot.slice(0, 5), CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm');
}

function isClosed_() {
  const end = Utilities.parseDate(CONFIG.EVENT_DATE + ' ' + CONFIG.END, CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm');
  return new Date() >= end;
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(CONFIG.SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#1c1a17').setFontColor('#ffffff');
    sheet.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm:ss');
    sheet.getRange('D:D').setNumberFormat('@'); // telefono come testo
    sheet.getRange('I:I').setNumberFormat('@'); // slot come testo
  }
  return sheet;
}

function readColumn_(sheet, col) {
  const n = sheet.getLastRow() - 1;
  if (n < 1) return [];
  return sheet.getRange(2, col, n, 1).getDisplayValues().map(function (r) { return String(r[0]).trim(); });
}

// Evita la "formula injection" (=, +, -, @ a inizio cella)
function safe_(v) {
  return typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v;
}

function notify_(d) {
  if (!CONFIG.NOTIFY_EMAIL) return;
  try {
    MailApp.sendEmail({
      to: CONFIG.NOTIFY_EMAIL,
      subject: 'Nuova visita Open Day — ' + d.slot + ' — ' + d.nome + ' ' + d.cognome,
      body: [
        'Nuova prenotazione — Attico Duplex Via Cicalesi',
        '',
        'Slot: ' + CONFIG.EVENT_LABEL + ', ' + d.slot,
        'Nome: ' + d.nome + ' ' + d.cognome,
        'Telefono / WhatsApp: ' + d.telefono,
        'Residenza: ' + d.indirizzo,
        'Situazione acquisto: ' + d.situazione,
        'Tempi: ' + d.tempi,
        'Provenienza: ' + d.canale,
        '',
        'WhatsApp diretto: https://wa.me/' + d.telefono.replace('+', ''),
      ].join('\n'),
    });
  } catch (err) {
    console.error('Notifica email fallita: ' + err);
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------------------------------------------------- */
/*  UTILITY DA ESEGUIRE MANUALMENTE DALL'EDITOR                              */
/* ------------------------------------------------------------------------- */

/** Eseguire una volta: crea il foglio con le intestazioni e richiede le autorizzazioni. */
function setup() {
  getSheet_();
  console.log('Foglio pronto. Slot: ' + buildSlots_().join(' | '));
}

/** Test rapido del doGet dall'editor. */
function testDoGet() {
  console.log(doGet({ parameter: { action: 'slots' } }).getContent());
}
