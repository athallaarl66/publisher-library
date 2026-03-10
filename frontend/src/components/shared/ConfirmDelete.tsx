import { AlertTriangle } from "lucide-react";

interface Props {
  name: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDelete({
  name,
  description,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-sm shadow-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-red-50 rounded-lg shrink-0">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <div>
            <h2 className="font-semibold">Hapus "{name}"?</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {description ??
                "Data ini akan dihapus permanen dan tidak bisa dikembalikan."}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
