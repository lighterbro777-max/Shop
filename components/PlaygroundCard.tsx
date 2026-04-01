import Link from "next/link";
import { Trash2, ArrowRight } from "lucide-react";
import { Playground, AwarenessLevel, CreativeFormat } from "@/lib/types";

const awarenessColors: Record<AwarenessLevel, string> = {
  TOF: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  MOF: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  BOF: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

const awarenessLabels: Record<AwarenessLevel, string> = {
  TOF: "Top of Funnel",
  MOF: "Mid of Funnel",
  BOF: "Bottom of Funnel",
};

const formatIcons: Record<CreativeFormat, string> = {
  static: "🖼️",
  carousel: "📸",
  video: "🎬",
};

interface Props {
  playground: Playground;
  onDelete: (id: string) => void;
}

export default function PlaygroundCard({ playground, onDelete }: Props) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all group flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{playground.name}</h3>
          <p className="text-sm text-gray-500 truncate mt-0.5">
            {playground.niche}
          </p>
        </div>
        <button
          onClick={() => onDelete(playground.id)}
          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all ml-2 flex-shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span
          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${awarenessColors[playground.awareness]}`}
        >
          {playground.awareness} · {awarenessLabels[playground.awareness]}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-gray-400">
          {formatIcons[playground.format]} {playground.format}
        </span>
      </div>

      <div className="text-xs text-gray-600 space-y-1">
        <p>
          <span className="text-gray-500">Produit:</span>{" "}
          {playground.productInfo.name}
        </p>
        <p>
          <span className="text-gray-500">Cible:</span>{" "}
          {playground.productInfo.targetAudience}
        </p>
      </div>

      <Link
        href={`/playground/${playground.id}`}
        className="flex items-center justify-center gap-2 w-full bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 rounded-lg py-2 text-sm font-medium transition-all mt-auto"
      >
        Ouvrir le playground
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
