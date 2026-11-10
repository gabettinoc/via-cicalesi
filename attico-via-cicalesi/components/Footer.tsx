export function Footer() {
  const agency = process.env.NEXT_PUBLIC_AGENCY_NAME || 'Agenzia Immobiliare';
  return (
    <footer className="bg-ink pb-28 pt-16 text-white/60 md:pb-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 text-sm sm:flex-row sm:justify-between">
        <div>
          <p className="font-display text-xl text-white">Attico <span className="italic">Via Cicalesi</span></p>
          <p className="mt-2">Nocera Inferiore (SA) · Richiesta € 330.000 · Classe energetica E</p>
        </div>
        <div className="sm:text-right">
          <p>{agency}</p>
          <p className="mt-2">
            <a href="/privacy" className="underline">Privacy</a> · Le immagini hanno valore illustrativo.
          </p>
        </div>
      </div>
    </footer>
  );
}
