// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  selectProfiles,
  selectProfilesLoading,
  selectProfileDetail,
  selectProfileDetailLoading,
  selectProfilesMeta,
  selectProfileReferrals,
  resetProfileDetail,
} from "../features/profiles/profilesSlice";

import FiltersBar from "../ui/FiltersBar";
import DataTable, { Column } from "../ui/DataTable";
import Pagination from "../ui/Pagination";
import ModalShell from "../components/ui/ModalShell";
import CTA_Button from "../ui/CTA_Button";

import { getRank, getNextRank } from "../lib/referrals";
import {
  listProfilesThunk,
  type ProfileDoc,
} from "../features/profiles/listProfilesThunk";
import { getProfileByIdThunk } from "../features/profiles/getProfileByIdThunk";

import type { PersonType } from "../lib/referrals";
import Select from "../ui/Select";
import { fetchAllProfiles } from "../utils/fetchAllProfiles";
import DeleteConfirmModal from "../ui/DeleteConfirmModal";
import { toast } from "react-toastify";
import { deleteProfileThunk } from "../features/profiles/deleteProfileThunk";
import { Icon } from "../ui/Icon";

export default function Home() {
  const dispatch = useAppDispatch();

  // Stato Redux lista
  const profiles = useAppSelector(selectProfiles);
  const { totalPages } = useAppSelector(selectProfilesMeta);
  const loading = useAppSelector(selectProfilesLoading);

  // Stato Redux dettaglio
  const profile = useAppSelector(selectProfileDetail); // 👈 già ProfileDoc | undefined
  const referrals = useAppSelector(selectProfileReferrals);
  const detailLoading = useAppSelector(selectProfileDetailLoading);
  // Stati locali
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  // Export
  const [exportOpen, setExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<
    "" | "csv" | "json" | "xlsx"
  >("");

  // Stato per delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<{
    id: string;
    email: string;
  } | null>(null);

  const [type, setType] = useState<"" | PersonType>("");
  const [region, setRegion] = useState("");
  const [verified, setVerified] = useState<"" | "yes" | "no">("");
  const [sort, setSort] = useState("createdAt:desc");
  const [limit, setLimit] = useState<10 | 20 | 50>(10);

  const [page, setPage] = useState(1);

  // Effettua fetch lista profili
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(
        listProfilesThunk({
          token,
          q: search || undefined,
          region: region || undefined,
          type:
            type === "Azienda"
              ? "azienda"
              : type === "PersonaFisica"
              ? "persona"
              : undefined,
          verified:
            verified === "yes" ? true : verified === "no" ? false : undefined,
          sortBy: sort.split(":")[0] as
            | "createdAt"
            | "dateJoined"
            | "lastLogin"
            | "lastActivity"
            | "firstName"
            | "lastName"
            | "email"
            | "companyName",
          sortDir: (sort.split(":")[1] as "asc" | "desc") || "desc",
          limit: limit as 10 | 20 | 50,
          page, // 👈 fondamentale
        })
      );
    }
  }, [dispatch, search, role, type, region, verified, sort, limit, page]);

  // Modale
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = (profileId: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getProfileByIdThunk({ profileId, token }));
      setModalOpen(true);
    }
  };
  const closeModal = () => {
    dispatch(resetProfileDetail());
    setModalOpen(false);
  };

  // Colonne tabella
  const columns: Column<ProfileDoc>[] = [
    {
      key: "user_id",
      header: "ID",
      render: (r) => <span className="w-20 inline-block">{r.user_id}</span>,
    },
    {
      key: "firstName",
      header: "Nome",
      sortable: true,
      render: (r) => (
        <button
          type="button"
          onClick={() => openModal(r._id)}
          className="font-medium text-brand hover:underline"
          title="Vedi dettaglio referral"
        >
          {r.firstName} {r.lastName}
        </button>
      ),
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      render: (r) => r.email,
    },
    {
      key: "phone",
      header: "Numero",
      sortable: true,
      render: (r) => r.phone ?? "—",
    },
    {
      key: "region",
      header: "Regione / Azienda",
      sortable: true,
      render: (r) => (
        <div>
          <div>{r.region ?? "—"}</div>
          {r.companyName && (
            <div className="text-xs text-neutral-500">{r.companyName}</div>
          )}
        </div>
      ),
    },
    {
      key: "region",
      header: "Regione",
      sortable: true,
      render: (r) => r.region ?? "—",
    },
    {
      key: "verified",
      header: "Verificato",
      sortable: true,
      render: (r) => (
        <span className={r.verified ? "text-green-600" : "text-neutral-500"}>
          {r.verified ? "Sì" : "No"}
        </span>
      ),
    },
    {
      key: "referralCode",
      header: "Ref Code",
      render: (r) => r.referralCode ?? "—",
    },
    {
      key: "createdAt",
      header: "Creato",
      sortable: true,
      render: (r) =>
        r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—",
    },
    {
      key: "actions",
      header: "Azioni",
      render: (r) => (
        <button
          type="button"
          onClick={() => openDeleteModal(r._id, r.email)}
          className="p-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
          title="Elimina profilo"
        >
          <Icon name="delete" size={20} strokeWidth={2} />
        </button>
      ),
    },
  ];

  const sortKey = sort.split(":")[0];
  const sortDir = (sort.split(":")[1] as "asc" | "desc") || "asc";

  // Calcola rank referral per la modale
  const totalRefs = referrals?.total ?? 0;
  const currentRank = getRank(totalRefs);
  const nextRank = getNextRank(totalRefs);
  const progressToNext = nextRank
    ? Math.min(100, Math.round((totalRefs / nextRank.min) * 100))
    : 100;

  // Export data

  const handleExport = async (format: "csv" | "json" | "xlsx") => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // ottieni tutti i profili, non solo quelli della pagina corrente
    const allProfiles = await fetchAllProfiles({
      dispatch,
      token,
      q: search || undefined,
      region: region || undefined,
      type:
        type === "Azienda"
          ? "azienda"
          : type === "PersonaFisica"
          ? "persona"
          : undefined,
      verified:
        verified === "yes" ? true : verified === "no" ? false : undefined,
      sortBy: sort.split(":")[0] as
        | "createdAt"
        | "dateJoined"
        | "lastLogin"
        | "lastActivity"
        | "firstName"
        | "lastName"
        | "email"
        | "companyName", // 👈 cast esplicito
      sortDir: (sort.split(":")[1] as "asc" | "desc") || "desc",
    });

    if (!allProfiles.length) return;

    let blob: Blob;

    if (format === "json") {
      blob = new Blob([JSON.stringify(allProfiles, null, 2)], {
        type: "application/json",
      });
    } else if (format === "csv") {
      const header = Object.keys(allProfiles[0]).join(",") + "\n";
      const rows = allProfiles
        .map((row) => Object.values(row).join(","))
        .join("\n");
      blob = new Blob([header + rows], { type: "text/csv" });
    } else {
      // "xlsx" -> per semplicità esportiamo CSV con estensione .xlsx
      const header = Object.keys(allProfiles[0]).join(",") + "\n";
      const rows = allProfiles
        .map((row) => Object.values(row).join(","))
        .join("\n");
      blob = new Blob([header + rows], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `profiles.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Delete modal handlers
  const openDeleteModal = (id: string, email: string) => {
    setProfileToDelete({ id, email });
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setProfileToDelete(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!profileToDelete) return;
    const token = localStorage.getItem("token");
    if (token) {
      const action = await dispatch(
        deleteProfileThunk({ profileId: profileToDelete.id, token })
      );

      if (deleteProfileThunk.fulfilled.match(action)) {
        toast.success(
          `Profilo ${action.payload.email} eliminato con successo`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      } else {
        toast.error("Errore durante l'eliminazione del profilo", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
    closeDeleteModal();
  };

  return (
    <div className="space-y-4">
      {/* Ricerca + Filtri */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cerca nome, email o numero…"
            className="w-72 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/70 focus:border-brand"
          />
        </div>
        <FiltersBar
          type={type}
          onChangeType={(v) => {
            setType(v);
            setPage(1);
          }}
          region={region}
          onChangeRegion={(v) => {
            setRegion(v);
            setPage(1);
          }}
          verified={verified}
          onChangeVerified={(v) => {
            setVerified(v);
            setPage(1);
          }}
          role={role}
          onChangeRole={(v) => {
            setRole(v);
            setPage(1);
          }}
          sort={sort}
          onChangeSort={(v) => {
            setSort(v);
            setPage(1);
          }}
          limit={limit}
          onChangeLimit={(v) => {
            setLimit(v as 10 | 20 | 50);
            setPage(1);
          }}
          extra={
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <CTA_Button
                  variant="secondary"
                  onClick={() => setExportOpen((prev) => !prev)}
                >
                  Esporta
                </CTA_Button>

                {exportOpen && (
                  <div className="w-40">
                    <Select
                      fullWidth
                      size="sm"
                      options={[
                        { value: "csv", label: "CSV" },
                        { value: "xlsx", label: "Excel (.xlsx)" },
                        { value: "json", label: "JSON" },
                      ]}
                      value={exportFormat}
                      onChange={(e) => {
                        const val = e.target.value as "csv" | "json" | "xlsx";
                        setExportFormat(val);
                        handleExport(val);
                        setExportOpen(false);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 🔄 Reset filtri */}
              <CTA_Button
                variant="secondary"
                onClick={() => {
                  setSearch("");
                  setRole("");
                  setType("");
                  setRegion("");
                  setVerified("");
                  setSort("createdAt:desc");
                  setLimit(10);
                  setPage(1);
                }}
                title="Reset filtri"
              >
                <span className="flex items-center gap-1">
                  <span className="text-lg">↺</span> Reset
                </span>
              </CTA_Button>
            </div>
          }
        />
      </div>

      {/* Totale risultati */}
      <div className="text-sm text-neutral-600">
        Risultati:{" "}
        <span className="font-medium text-neutral-900">{profiles.length}</span>
      </div>

      {/* Tabella */}
      <DataTable<ProfileDoc>
        data={profiles}
        columns={columns}
        loading={loading}
        emptyLabel="Nessun profilo trovato"
        sortKey={sortKey}
        sortDir={sortDir}
        onSortChange={(key, dir) => {
          setSort(`${key}:${dir}`);
          setPage(1);
        }}
        density="comfortable"
      />

      {/* Paginazione (mockata lato FE, se non hai server pagination) */}
      <div className="flex items-center justify-end">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(p: number) => setPage(p)}
        />
      </div>

      {/* Modale referral */}
      <ModalShell
        open={modalOpen}
        onClose={closeModal}
        size="lg"
        title={
          profile
            ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`
            : undefined
        }
        description={profile?.email}
        footer={
          <button
            className="rounded-xl bg-brand text-brand-lightest px-4 py-2 text-sm hover:bg-brand-medium"
            onClick={closeModal}
          >
            Chiudi
          </button>
        }
      >
        {detailLoading && (
          <div className="p-6 text-sm text-neutral-600">Caricamento…</div>
        )}

        {profile && !detailLoading && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-neutral-200 p-4">
                <div className="text-xs text-neutral-500">Referrals totali</div>
                <div className="mt-1 text-2xl font-semibold">
                  {referrals?.count ?? 0}
                </div>
              </div>
              <div className="rounded-xl border border-neutral-200 p-4">
                <div className="text-xs text-neutral-500">Livello</div>
                <div className="mt-1 text-2xl font-semibold">
                  {currentRank.level}{" "}
                  <span className="ml-2 text-sm font-normal text-neutral-600">
                    ({currentRank.label})
                  </span>
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  Premio: {currentRank.reward}
                </div>
              </div>
              <div className="rounded-xl border border-neutral-200 p-4">
                {nextRank ? (
                  <>
                    <div className="text-xs text-neutral-500">
                      Prossimo livello
                    </div>
                    <div className="mt-1 text-sm">
                      {nextRank.label} (L{nextRank.level}) a {nextRank.min}{" "}
                      referrals
                    </div>
                    <div className="mt-2 h-2 w-full rounded bg-neutral-100">
                      <div
                        className="h-2 rounded bg-brand"
                        style={{ width: `${progressToNext}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">
                      Mancano{" "}
                      <b>
                        {Math.max(0, nextRank.min - (referrals?.total ?? 0))}
                      </b>{" "}
                      referrals
                    </div>
                  </>
                ) : (
                  <div className="text-sm">
                    Hai raggiunto il livello massimo 🎉
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200">
              <div className="px-4 py-3 border-b border-neutral-200 text-sm font-medium">
                Utenti registrati con il suo referral ({profile.referralCode})
              </div>
              {referrals?.emails.length === 0 ? (
                <div className="px-4 py-6 text-sm text-neutral-600">
                  Nessun utente referenziato.
                </div>
              ) : (
                <ul className="max-h-64 overflow-auto divide-y divide-neutral-100">
                  {referrals?.emails.map((email, idx) => (
                    <li key={idx} className="px-4 py-3 text-sm">
                      <div className="font-medium">{email}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 👉 SE È UN'AZIENDA mostro i dati aziendali */}
            {profile.companyName && (
              <div className="rounded-xl border border-neutral-200 p-4 space-y-2">
                <div>
                  <div className="text-xs text-neutral-500">Azienda</div>
                  <div className="text-sm font-medium">
                    {profile.companyName}
                  </div>
                </div>
                {profile.vatNumber && (
                  <div>
                    <div className="text-xs text-neutral-500">Partita IVA</div>
                    <div className="text-sm font-medium">
                      {profile.vatNumber}
                    </div>
                  </div>
                )}
                {profile.region && (
                  <div>
                    <div className="text-xs text-neutral-500">Regione</div>
                    <div className="text-sm font-medium">{profile.region}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </ModalShell>

      {/* DELETE MODAL */}

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        email={profileToDelete?.email}
      />
    </div>
  );
}
