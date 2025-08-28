// src/ui/DataTable.tsx  (adatta i path di cn/LoadSpinner se servono)
import React from "react";
import { cn } from "../components/ui/utils/cn"; // <-- aggiorna path
import LoadSpinner from "../components/ui/LoadSpinner"; // <-- aggiorna path

export type SortDir = "asc" | "desc";

/** Chiave di colonna che esiste davvero nel tipo T (soltanto stringhe) */
type ColumnKey<T> = Extract<keyof T, string>;

type BaseColumn = {
  header: string | React.ReactNode;
  className?: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
};

/** Colonna “a chiave”: opzionale render, ma key deve essere una proprietà di T */
export type KeyColumn<T> = BaseColumn & {
  key: ColumnKey<T>;
  render?: (row: T) => React.ReactNode;
};

export type RenderOnlyColumn<T> = BaseColumn & {
  key: string;
  render: (row: T) => React.ReactNode;
};

export type Column<T> = KeyColumn<T> | RenderOnlyColumn<T>;

export type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyLabel?: string;
  sortKey?: string;
  sortDir?: SortDir;
  onSortChange?: (key: string, dir: SortDir) => void;
  rowKey?: (row: T, idx: number) => string | number;
  density?: "comfortable" | "compact";
  className?: string;
  /** se presente, mostra solo queste chiavi */
  visibleKeys?: string[];
};

function getDefaultRowKey<T>(row: T, idx: number): string | number {
  const r = row as unknown as Record<string, unknown>;
  const id = (r._id ?? r.id) as string | number | undefined;
  return id ?? idx;
}

function getCellValue<T>(row: T, col: Column<T>): React.ReactNode {
  if ("render" in col && typeof col.render === "function") {
    return col.render(row);
  }
  // Qui col è un KeyColumn<T> (perché le RenderOnly hanno sempre render)
  const k = col.key as ColumnKey<T>;
  const r = row as unknown as Record<ColumnKey<T>, unknown>;
  return r[k] as React.ReactNode;
}

export default function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyLabel = "Nessun dato",
  sortKey,
  sortDir = "asc",
  onSortChange,
  rowKey,
  density = "comfortable",
  className,
  visibleKeys,
}: DataTableProps<T>) {
  const cellY = density === "compact" ? "py-2" : "py-3";

  const filteredCols =
    visibleKeys && visibleKeys.length
      ? columns.filter((c) => visibleKeys.includes(String(c.key)))
      : columns;

  const toggleSort = (key: string) => {
    if (!onSortChange) return;
    const next: SortDir = sortKey === key && sortDir === "asc" ? "desc" : "asc";
    onSortChange(key, next);
  };

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-2xl border border-neutral-200 bg-white",
        className
      )}
    >
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-50 text-left text-neutral-600">
          <tr>
            {filteredCols.map((c, i) => {
              const isSorted = c.sortable && String(c.key) === sortKey;
              return (
                <th
                  key={i}
                  className={cn(
                    "px-4 py-3 font-medium",
                    c.width,
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center",
                    c.className
                  )}
                >
                  {c.sortable ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 select-none"
                      onClick={() => toggleSort(String(c.key))}
                    >
                      <span>{c.header}</span>
                      <span
                        className={cn(
                          "text-xs",
                          isSorted ? "opacity-100" : "opacity-40"
                        )}
                      >
                        {sortDir === "asc" && isSorted ? "▲" : "▼"}
                      </span>
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={filteredCols.length}
                className="px-4 py-10 text-center"
              >
                <LoadSpinner className="inline-block" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={filteredCols.length}
                className="px-4 py-10 text-center text-neutral-500"
              >
                {emptyLabel}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={rowKey ? rowKey(row, idx) : getDefaultRowKey(row, idx)}
                className="border-t border-neutral-100"
              >
                {filteredCols.map((c, ci) => (
                  <td
                    key={ci}
                    className={cn(
                      "px-4",
                      cellY,
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center",
                      c.className
                    )}
                  >
                    {getCellValue(row, c)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
