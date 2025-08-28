import React from "react";
import { Typography } from "../components/ui/Typography"; // <-- adatta il path se serve

/**
 * Pagina esplicativa del sistema di ranking a livelli con "piramide" visiva,
 * stato corrente dell'utente, prossimo livello e premi.
 * - TailwindCSS only
 */

export type Rank = {
  min: number; // soglia minima di referrals raggiunti per il livello
  level: number;
  label: string;
  reward: string;
};

export type RankOverviewProps = {
  referralsCount?: number; // referrals attuali dell'utente
  ranks?: Rank[]; // dataset livelli (ordinato per min crescente)
};

// Dataset di esempio (puoi importarlo da src/lib/referrals se già esiste)
const DEFAULT_RANKS: Rank[] = [
  { min: 0, level: 0, label: "Base", reward: "—" },
  { min: 2, level: 1, label: "Starter", reward: "Bonus 10€" },
  { min: 5, level: 2, label: "Silver", reward: "Buono 25€" },
  { min: 10, level: 3, label: "Gold", reward: "Sconto 15%" },
  { min: 20, level: 4, label: "Platinum", reward: "Gift 50€" },
];

function getRank(ranks: Rank[], count: number): Rank {
  let best = ranks[0];
  for (const r of ranks) if (count >= r.min) best = r;
  return best;
}

function getNextRank(ranks: Rank[], count: number): Rank | null {
  const remaining = ranks
    .filter((r) => r.min > count)
    .sort((a, b) => a.min - b.min);
  return remaining[0] ?? null;
}

export default function RankOverview({
  referralsCount = 0,
  ranks = DEFAULT_RANKS,
}: RankOverviewProps) {
  const current = getRank(ranks, referralsCount);
  const next = getNextRank(ranks, referralsCount);
  const remaining = next ? Math.max(0, next.min - referralsCount) : 0;
  const progressToNext = next
    ? Math.min(100, Math.round((referralsCount / next.min) * 100))
    : 100;

  // Calcolo larghezze graduali per la piramide (base larga → top stretta)
  const maxWidth = 100; // percentuale base
  const step =
    ranks.length > 1 ? Math.floor(maxWidth / ranks.length) : maxWidth;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <header className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <Typography variant="h2" weight="semibold" color="brand-dark">
          Piramide di Ranking & Premi
        </Typography>
        <Typography className="mt-2" color="brand-medium">
          Ogni utente sale di livello in base al numero di referrals confermati.
          Più inviti completi, più sali nella piramide e migliori diventano i
          premi.
        </Typography>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 p-4">
            <Typography variant="span" className="text-xs text-neutral-500">
              Referrals attuali
            </Typography>
            <Typography
              variant="h3"
              className="mt-1 text-2xl font-semibold text-neutral-900"
            >
              {referralsCount}
            </Typography>
          </div>

          <div className="rounded-xl border border-neutral-200 p-4">
            <Typography variant="span" className="text-xs text-neutral-500">
              Livello attuale
            </Typography>
            <div className="mt-1 text-2xl font-semibold">
              L{current.level}
              <Typography
                variant="span"
                className="ml-2 text-sm font-normal text-neutral-600"
              >
                ({current.label})
              </Typography>
            </div>
            <Typography
              variant="span"
              className="mt-1 block text-xs text-neutral-500"
            >
              Premio: {current.reward}
            </Typography>
          </div>

          <div className="rounded-xl border border-neutral-200 p-4">
            {next ? (
              <>
                <Typography variant="span" className="text-xs text-neutral-500">
                  Prossimo livello
                </Typography>
                <Typography className="mt-1 text-sm">
                  {next.label} (L{next.level}) a <b>{next.min}</b> referrals
                </Typography>
                <div className="mt-2 h-2 w-full rounded bg-neutral-100">
                  <div
                    className="h-2 rounded bg-brand"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
                <Typography
                  variant="span"
                  className="mt-1 block text-xs text-neutral-500"
                >
                  Mancano <b>{remaining}</b> referrals
                </Typography>
              </>
            ) : (
              <Typography className="text-sm">
                Hai raggiunto il livello massimo 🎉
              </Typography>
            )}
          </div>
        </div>
      </header>

      {/* Piramide */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mt-6 flex flex-col items-center gap-3">
          {ranks
            .slice()
            .sort((a, b) => b.min - a.min) // dal top (min più alto) alla base (min più basso)
            .map((r, idx) => {
              // <-- rimosso 'arr' per evitare eslint no-unused-vars
              const width = Math.max(30, maxWidth - idx * step); // %
              const isCurrent = r.level === current.level;
              const isNext = next && r.level === next.level;
              return (
                <div
                  key={r.level}
                  className={[
                    "relative rounded-xl border p-3 text-center transition",
                    isCurrent
                      ? "border-brand bg-brand-lightest/60 shadow-brand"
                      : "border-neutral-200 bg-white",
                    isNext && !isCurrent ? "border-dashed" : "",
                  ].join(" ")}
                  style={{ width: `${width}%` }}
                >
                  <Typography className="text-sm font-semibold">
                    L{r.level} · {r.label}
                  </Typography>
                  <Typography
                    variant="span"
                    className="text-xs text-neutral-600"
                  >
                    da {r.min} referrals
                  </Typography>
                  <Typography variant="span" className="mt-1 block text-xs">
                    Premio: <span className="font-medium">{r.reward}</span>
                  </Typography>

                  {isCurrent && (
                    <span className="absolute -right-3 -top-3 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-2 text-xs text-white">
                      Attuale
                    </span>
                  )}
                  {isNext && !isCurrent && (
                    <span className="absolute -right-3 -top-3 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-black px-2 text-xs text-white">
                      Prossimo
                    </span>
                  )}
                </div>
              );
            })}
        </div>

        {/* Callouts esplicativi */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 p-4">
            <Typography className="text-sm font-semibold">
              Come si sale di livello?
            </Typography>
            <Typography className="mt-1 text-sm text-neutral-600">
              Ogni iscrizione valida tramite il tuo codice referral aumenta il
              tuo conteggio. Al raggiungimento della soglia del livello
              successivo, sblocchi il relativo premio.
            </Typography>
          </div>
          <div className="rounded-xl border border-neutral-200 p-4">
            <Typography className="text-sm font-semibold">Esempio</Typography>
            <Typography className="mt-1 text-sm text-neutral-600">
              Con <b>2 referrals</b> passi da <b>Base (L0)</b> a{" "}
              <b>Starter (L1)</b> e ottieni <b>Bonus 10€</b>. Con{" "}
              <b>5 referrals</b> raggiungi <b>Silver (L2)</b> con{" "}
              <b>Buono 25€</b>.
            </Typography>
          </div>
          <div className="rounded-xl border border-neutral-200 p-4">
            <Typography className="text-sm font-semibold">
              Suggerimento
            </Typography>
            <Typography className="mt-1 text-sm text-neutral-600">
              Condividi il tuo codice referral con amici e colleghi. Più persone
              inviti, più veloce sarà la tua scalata nella piramide.
            </Typography>
          </div>
        </div>
      </section>
    </div>
  );
}
