import React from "react";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Paginator({ page, totalPages, onPageChange }: Props) {
  const canPrev = page > 1;
  const canNext = page < totalPages;
  return (
    <div className="flex items-center gap-2">
      <button
        className="border rounded px-3 py-1 text-sm disabled:opacity-50"
        onClick={() => onPageChange(page - 1)}
        disabled={!canPrev}
      >
        ← Prev
      </button>
      <span className="text-sm">
        Pagina {page} / {Math.max(totalPages, 1)}
      </span>
      <button
        className="border rounded px-3 py-1 text-sm disabled:opacity-50"
        onClick={() => onPageChange(page + 1)}
        disabled={!canNext}
      >
        Next →
      </button>
    </div>
  );
}
