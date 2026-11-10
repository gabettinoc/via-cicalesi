import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Informativa Privacy – Attico Via Cicalesi', robots: { index: false } };

// MODELLO DA COMPLETARE: far verificare il testo definitivo al consulente privacy dell'agenzia.
export default function Privacy() {
  const agency = process.env.NEXT_PUBLIC_AGENCY_NAME || '[Ragione sociale agenzia]';
  return (
    <main className="mx-auto max-w-2xl px-5 py-20 leading-relaxed text-ink/80">
      <a href="/" className="text-sm text-bronze">← Torna all’annuncio</a>
      <h1 className="mt-6 font-display text-4xl text-ink">Informativa sul trattamento dei dati</h1>
      <p className="mt-2 text-sm text-mute">Art. 13 Regolamento UE 2016/679 (GDPR)</p>

      <h2 className="mt-10 font-semibold text-ink">Titolare del trattamento</h2>
      <p>{agency}, [indirizzo sede], P.IVA [•], email [•].</p>

      <h2 className="mt-8 font-semibold text-ink">Dati raccolti e finalità</h2>
      <p>
        Nome, cognome, telefono, indirizzo di residenza e le risposte del modulo (situazione d’acquisto, tempi, canale di
        provenienza, orario scelto) sono trattati per organizzare la visita all’immobile, inviarti conferma, posizione e
        promemoria via WhatsApp, e ricontattarti in merito a questo immobile.
      </p>

      <h2 className="mt-8 font-semibold text-ink">Base giuridica e conservazione</h2>
      <p>
        Esecuzione di misure precontrattuali richieste dall’interessato e consenso. I dati sono conservati per [12] mesi,
        salvo obblighi di legge, su Google Workspace (Google Fogli).
      </p>

      <h2 className="mt-8 font-semibold text-ink">I tuoi diritti</h2>
      <p>
        Puoi chiedere accesso, rettifica, cancellazione, limitazione, opposizione e portabilità scrivendo a [email], e
        proporre reclamo al Garante per la protezione dei dati personali.
      </p>
    </main>
  );
}
