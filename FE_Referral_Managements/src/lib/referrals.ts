// src/lib/referrals.ts
export type PersonType = "PersonaFisica" | "Azienda";
export type Role = "SuperAdmin" | "Admin" | "Technician" | "User";

export type Profile = {
  _id: string;
  user_id?: number;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  type?: PersonType;
  region?: string;
  role?: Role;
  verified?: boolean;
  referralCode: string; // 🔥 codice proprio
  referredByCode?: string | null; // 🔥 chi l'ha invitato
  createdAt?: string;
};

export type Rank = {
  min: number;
  level: number;
  label: string;
  reward: string;
};

// 🔥 Config livelli (esempio): cambia liberamente
export const RANKS: Rank[] = [
  { min: 0, level: 0, label: "Base", reward: "—" },
  { min: 2, level: 1, label: "Starter", reward: "Bonus 10€" },
  { min: 5, level: 2, label: "Silver", reward: "Buono 25€" },
  { min: 10, level: 3, label: "Gold", reward: "Sconto 15%" },
  { min: 20, level: 4, label: "Platinum", reward: "Gift 50€" },
];

export function getRank(byReferrals: number): Rank {
  // prende il rank con min più alto <= byReferrals
  let best = RANKS[0];
  for (const r of RANKS) if (byReferrals >= r.min) best = r;
  return best;
}

export function getNextRank(byReferrals: number): Rank | null {
  const remaining = RANKS.filter((r) => r.min > byReferrals).sort(
    (a, b) => a.min - b.min
  );
  return remaining[0] ?? null;
}

// Indice: referralCode -> lista profili referenziati
export function buildReferralIndex(list: Profile[]): Record<string, Profile[]> {
  const idx: Record<string, Profile[]> = {};
  for (const p of list) {
    const code = p.referredByCode ?? undefined;
    if (!code) continue;
    if (!idx[code]) idx[code] = [];
    idx[code].push(p);
  }
  return idx;
}
