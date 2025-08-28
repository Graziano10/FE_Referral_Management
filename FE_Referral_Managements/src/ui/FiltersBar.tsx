// src/ui/FiltersBar.tsx
import React from "react";
import { cn } from "./utils/cn";

// ✅ tipi riutilizzabili
export type PersonType = "" | "PersonaFisica" | "Azienda";
export type VerifiedFilter = "" | "yes" | "no";

export type FiltersBarProps = {
  role?: string;
  onChangeRole?: (value: string) => void;
  sort?: string;
  onChangeSort?: (value: string) => void;
  limit?: number;
  onChangeLimit?: (value: number) => void;

  type?: PersonType;
  onChangeType?: (value: PersonType) => void;
  region?: string;
  onChangeRegion?: (value: string) => void;

  verified?: VerifiedFilter;
  onChangeVerified?: (value: VerifiedFilter) => void;

  className?: string;
  extra?: React.ReactNode;
};

const FiltersBar: React.FC<FiltersBarProps> = ({
  //   role = "",
  //   onChangeRole,
  sort = "createdAt:desc",
  onChangeSort,
  limit = 10,
  onChangeLimit,

  type = "",
  onChangeType,
  region = "",
  onChangeRegion,

  verified = "",
  onChangeVerified,

  className,
  extra,
}) => {
  const regions = [
    "",
    "Abruzzo",
    "Basilicata",
    "Calabria",
    "Campania",
    "Emilia-Romagna",
    "Friuli-Venezia Giulia",
    "Lazio",
    "Liguria",
    "Lombardia",
    "Marche",
    "Molise",
    "Piemonte",
    "Puglia",
    "Sardegna",
    "Sicilia",
    "Toscana",
    "Trentino-Alto Adige",
    "Umbria",
    "Valle d'Aosta",
    "Veneto",
  ];

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {/* Tipo */}
      <select
        aria-label="Tipo soggetto"
        value={type}
        onChange={(e) => onChangeType?.(e.target.value as PersonType)}
        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
      >
        <option value="">Tutti i tipi</option>
        <option value="PersonaFisica">Persona fisica</option>
        <option value="Azienda">Azienda</option>
      </select>

      {/* Regione */}
      <select
        aria-label="Regione"
        value={region}
        onChange={(e) => onChangeRegion?.(e.target.value)}
        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
      >
        {regions.map((r) => (
          <option key={r || "all"} value={r}>
            {r || "Tutte le regioni"}
          </option>
        ))}
      </select>

      {/* Verificato */}
      <select
        aria-label="Verificato"
        value={verified}
        onChange={(e) => onChangeVerified?.(e.target.value as VerifiedFilter)}
        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
      >
        <option value="">Tutti</option>
        <option value="yes">Verificati</option>
        <option value="no">Non verificati</option>
      </select>

      {/* Ruolo */}
      {/* <select
        aria-label="Filtro ruolo"
        value={role}
        onChange={(e) => onChangeRole?.(e.target.value)}
        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
      >
        <option value="">Tutti i ruoli</option>
        <option>SuperAdmin</option>
        <option>Admin</option>
        <option>Technician</option>
        <option>User</option>
      </select> */}

      {/* Sort */}
      <select
        aria-label="Ordinamento"
        value={sort}
        onChange={(e) => onChangeSort?.(e.target.value)}
        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
      >
        {/* ordinamenti data */}
        <option value="createdAt:desc">Più recenti</option>
        <option value="createdAt:asc">Meno recenti</option>
        {/* ordinamenti per nome */}
        <option value="firstName:asc">Nome A→Z</option>
        <option value="firstName:desc">Nome Z→A</option>
      </select>

      {/* Limit */}
      <select
        aria-label="Elementi per pagina"
        value={String(limit)}
        onChange={(e) => onChangeLimit?.(Number(e.target.value))}
        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>

      <div className="ml-auto flex items-center gap-2">{extra}</div>
    </div>
  );
};

export default FiltersBar;
