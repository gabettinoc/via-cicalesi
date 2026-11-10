import { Reveal } from './Reveal';

export function Manifesto() {
  return (
    <section id="manifesto" className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        <Reveal className="md:col-span-5">
          <p className="eyebrow">01 — Il Manifesto</p>
          <h2 className="h-section mt-5">
            Due livelli di puro comfort pensati per le esigenze di <span className="italic">tutta la famiglia.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="space-y-6 text-[17px] leading-[1.75] text-ink/80 md:col-span-7 md:pt-12">
          <p className="font-display text-2xl leading-snug text-ink">
            Svegliarsi all’ultimo piano, con la luce che entra da due lati e le montagne che fanno da sfondo alla
            colazione.
          </p>
          <p>
            Questo attico si sviluppa tra il quarto e il quinto piano, uniti da una scala interna che separa con
            naturalezza la vita di tutti i giorni dagli spazi più intimi. L’esposizione a Nord e Ovest regala una luce
            morbida e costante in ogni stanza, e lo sguardo si apre sul verde del parco fino ai rilievi che circondano la
            città.
          </p>
          <p>
            Tutto è già stato fatto con cura: il <b className="font-semibold text-ink">4° piano è stato ristrutturato nel 2016</b>{' '}
            — pavimenti, bagni, impianto elettrico e idraulico, infissi in legno/alluminio a doppio vetro — mentre il{' '}
            <b className="font-semibold text-ink">5° piano è stato edificato a nuovo nel 2002</b>, con infissi in PVC a doppio
            vetro. Entri e personalizzi, senza cantieri da affrontare.
          </p>
          <p>
            Intorno, un parco antisismico con ascensore e accesso per disabili, posti auto condominiali e il tuo garage
            privato. Vicino ai servizi di Nocera Inferiore, ma con la quiete di chi abita in alto.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.15} className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { src: '/media/living.jpg', alt: 'Zona giorno luminosa al 4° piano', cls: 'col-span-2 row-span-2 aspect-[4/5] sm:aspect-auto' },
          { src: '/media/vista.jpg', alt: 'Vista sulle montagne', cls: 'aspect-square' },
          { src: '/media/scala.jpg', alt: 'Scala interna tra 4° e 5° piano', cls: 'aspect-square' },
        ].map((img) => (
          <div
            key={img.src}
            role="img"
            aria-label={img.alt}
            className={`media-fallback overflow-hidden rounded-2xl ${img.cls}`}
            style={{ backgroundImage: `url(${img.src}), linear-gradient(160deg,#3E4A3D,#A5643A)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        ))}
      </Reveal>
    </section>
  );
}
