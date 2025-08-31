import React, { useState, useEffect } from "react";
import ModalShell from "./ModalShell";

type DeleteConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  email?: string;
};

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  email,
}: DeleteConfirmModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [canDelete, setCanDelete] = useState(false);

  const requiredPrompt = email ? `elimina_${email}` : "";

  useEffect(() => {
    if (open) {
      setInputValue("");
      setCanDelete(false);
    }
  }, [open, email]);

  useEffect(() => {
    setCanDelete(inputValue.trim() === requiredPrompt);
  }, [inputValue, requiredPrompt]);

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      size="sm"
      title="Conferma eliminazione"
      description={`Sei sicuro di voler eliminare il profilo ${email ?? ""}?`}
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-neutral-200 px-4 py-2 text-sm hover:bg-neutral-300"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canDelete}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              canDelete
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-red-200 text-red-400 cursor-not-allowed"
            }`}
          >
            Elimina
          </button>
        </div>
      }
    >
      <div className="space-y-3 p-4 text-sm text-neutral-700">
        <p>
          Per confermare l’eliminazione, digita{" "}
          <span className="font-semibold text-red-700">{requiredPrompt}</span>{" "}
          nel campo sottostante.
        </p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
            canDelete
              ? "border-red-600 text-red-700 focus:ring-red-600"
              : "border-neutral-300 focus:ring-red-500"
          }`}
          placeholder={`Scrivi: ${requiredPrompt}`}
        />
      </div>
    </ModalShell>
  );
}
