import { X } from "lucide-react";

export interface FilterChip {
  key: string;
  label: string;
  value: string;
}

interface Props {
  filters: FilterChip[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
}

export default function FilterChips({ filters, onRemove, onClearAll }: Props) {
  if (filters.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground">Filter:</span>
      {filters.map((f) => (
        <span
          key={f.key}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium"
        >
          {f.label}: {f.value}
          <button
            onClick={() => onRemove(f.key)}
            className="hover:text-primary/60 transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      {filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
        >
          Hapus semua
        </button>
      )}
    </div>
  );
}
