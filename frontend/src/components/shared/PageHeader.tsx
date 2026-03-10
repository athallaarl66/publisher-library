import { Plus } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  onAdd: () => void;
  addLabel: string;
}

export default function PageHeader({
  title,
  subtitle,
  onAdd,
  addLabel,
}: Props) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
      >
        <Plus size={16} />
        {addLabel}
      </button>
    </div>
  );
}
