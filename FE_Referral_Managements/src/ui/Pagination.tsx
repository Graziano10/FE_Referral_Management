// src/components/ui/Pagination.tsx
import React from "react";
import CTA_Button from "./CTA_Button";

export type PaginationProps = {
  page: number;
  totalPages: number; // 👈 calcolato dal container (Home)
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const canPrev = page > 1;
  const canNext = page < safeTotalPages;

  return (
    <div className="flex items-center gap-2">
      <CTA_Button
        variant="secondary"
        size="sm"
        disabled={!canPrev}
        onClick={() => onPageChange(page - 1)}
      >
        ← Prev
      </CTA_Button>

      <span className="text-sm text-neutral-600">
        Pagina {page} / {safeTotalPages}
      </span>

      <CTA_Button
        variant="secondary"
        size="sm"
        disabled={!canNext}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </CTA_Button>
    </div>
  );
}
