import { useState } from "react";

type Props = {
  initial?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  initial = "",
  onSearch,
  placeholder = "Cerca per nome o email…",
}: Props) {
  const [v, setV] = useState(initial);
  return (
    <div className="flex items-center gap-2">
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch(v)}
        className="w-64 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
        placeholder={placeholder}
      />
      <button
        onClick={() => onSearch(v)}
        className="rounded-lg border bg-black text-white px-3 py-2 text-sm hover:opacity-90"
      >
        Cerca
      </button>
    </div>
  );
}
