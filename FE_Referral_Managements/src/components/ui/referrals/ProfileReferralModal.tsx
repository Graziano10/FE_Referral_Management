// src/components/referrals/ProfileReferralModal.tsx

import { getNextRank, getRank, Profile } from "src/lib/referrals";
import ModalShell from "src/ui/ModalShell";

type Props = {
  open: boolean;
  onClose: () => void;
  profile: Profile | null;
  referredList: Profile[]; // utenti registrati col suo referralCode
};

export default function ProfileReferralModal({
  open,
  onClose,
  profile,
  referredList,
}: Props) {
  if (!profile) return null;

  const count = referredList.length;
  const rank = getRank(count);
  const next = getNextRank(count);
  const progressToNext = next
    ? Math.min(100, Math.round((count / next.min) * 100))
    : 100;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      size="lg"
      title={`${profile.name} ${profile.lastName}`}
      description={`Dettaglio referral e ranking per ${profile.email}`}
      footer={
        <button
          className="rounded-xl bg-brand text-brand-lightest px-4 py-2 text-sm hover:bg-brand-medium"
          onClick={onClose}
        >
          Chiudi
        </button>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="text-xs text-neutral-500">Referrals totali</div>
            <div className="mt-1 text-2xl font-semibold">{count}</div>
          </div>
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="text-xs text-neutral-500">Livello</div>
            <div className="mt-1 text-2xl font-semibold">
              {rank.level}{" "}
              <span className="ml-2 text-sm font-normal text-neutral-600">
                ({rank.label})
              </span>
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Premio: {rank.reward}
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200 p-4">
            {next ? (
              <>
                <div className="text-xs text-neutral-500">Prossimo livello</div>
                <div className="mt-1 text-sm">
                  {next.label} (L{next.level}) a {next.min} referrals
                </div>
                <div className="mt-2 h-2 w-full rounded bg-neutral-100">
                  <div
                    className="h-2 rounded bg-brand"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  Mancano <b>{Math.max(0, next.min - count)}</b> referrals
                </div>
              </>
            ) : (
              <div className="text-sm">Hai raggiunto il livello massimo 🎉</div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200">
          <div className="px-4 py-3 border-b border-neutral-200 text-sm font-medium">
            Utenti registrati con il tuo referral
          </div>
          {referredList.length === 0 ? (
            <div className="px-4 py-6 text-sm text-neutral-600">
              Nessun utente referenziato.
            </div>
          ) : (
            <ul className="max-h-64 overflow-auto divide-y divide-neutral-100">
              {referredList.map((u) => (
                <li key={u._id} className="px-4 py-3 text-sm">
                  <div className="font-medium">{u.email}</div>
                  <div className="text-neutral-600">
                    {u.name} {u.lastName} •{" "}
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : "—"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
