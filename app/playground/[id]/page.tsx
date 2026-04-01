"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Zap, Copy, Check, Trash2 } from "lucide-react";
import { Playground, Creative, AwarenessLevel, CreativeFormat } from "@/lib/types";
import Link from "next/link";

const awarenessColors: Record<AwarenessLevel, string> = {
  TOF: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  MOF: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  BOF: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

const hookTypeColors: Record<string, string> = {
  problème: "text-red-400 bg-red-400/10",
  transformation: "text-purple-400 bg-purple-400/10",
  curiosité: "text-yellow-400 bg-yellow-400/10",
  social_proof: "text-blue-400 bg-blue-400/10",
  urgence: "text-orange-400 bg-orange-400/10",
  bénéfice: "text-green-400 bg-green-400/10",
  question: "text-indigo-400 bg-indigo-400/10",
  chiffre: "text-pink-400 bg-pink-400/10",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button onClick={copy} className="text-gray-600 hover:text-gray-300 transition-colors">
      {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
    </button>
  );
}

function CreativeCard({ creative, onDelete }: { creative: Creative; onDelete: () => void }) {
  const hookColor = hookTypeColors[creative.hookType] ?? "text-gray-400 bg-gray-400/10";

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all flex flex-col gap-3 group">
      <div className="flex items-start justify-between gap-2">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${hookColor}`}>
          {creative.hookType}
        </span>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600 uppercase tracking-wide">Hook</span>
            <CopyButton text={creative.hook} />
          </div>
          <p className="text-sm text-indigo-300 font-medium leading-snug">{creative.hook}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600 uppercase tracking-wide">Headline</span>
            <CopyButton text={creative.headline} />
          </div>
          <p className="text-sm font-semibold leading-snug">{creative.headline}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600 uppercase tracking-wide">Body</span>
            <CopyButton text={creative.body} />
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">{creative.body}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-600 uppercase tracking-wide block mb-1">CTA</span>
            <span className="text-sm bg-indigo-600/20 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full">
              {creative.cta}
            </span>
          </div>
          <CopyButton text={creative.cta} />
        </div>

        {creative.visualDescription && (
          <div className="border-t border-white/5 pt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600 uppercase tracking-wide">Visuel</span>
              <CopyButton text={creative.visualDescription} />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed italic">{creative.visualDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlaygroundPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [playground, setPlayground] = useState<Playground | null>(null);
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(10);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("playgrounds");
    if (!stored) { router.push("/"); return; }
    const list: Playground[] = JSON.parse(stored);
    const found = list.find((p) => p.id === id);
    if (!found) { router.push("/"); return; }
    setPlayground(found);

    const storedCreatives = localStorage.getItem(`creatives-${id}`);
    if (storedCreatives) setCreatives(JSON.parse(storedCreatives));
  }, [id, router]);

  function saveCreatives(updated: Creative[]) {
    setCreatives(updated);
    localStorage.setItem(`creatives-${id}`, JSON.stringify(updated));
  }

  async function generate() {
    if (!playground) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playground, count }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur serveur");

      saveCreatives([...data.creatives, ...creatives]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  function deleteCreative(creativeId: string) {
    saveCreatives(creatives.filter((c) => c.id !== creativeId));
  }

  function copyAll() {
    const text = creatives
      .map(
        (c, i) =>
          `--- CRÉA ${i + 1} (${c.hookType}) ---\nHook: ${c.hook}\nHeadline: ${c.headline}\nBody: ${c.body}\nCTA: ${c.cta}`
      )
      .join("\n\n");
    navigator.clipboard.writeText(text);
  }

  if (!playground) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold">{playground.name}</h1>
          <p className="text-sm text-gray-500">{playground.niche} · {playground.productInfo.name}</p>
        </div>
        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border font-medium ${awarenessColors[playground.awareness]}`}>
          {playground.awareness}
        </span>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-400">
              <span className="text-white font-medium">Produit:</span>{" "}
              {playground.productInfo.name} {playground.productInfo.price && `· ${playground.productInfo.price}`}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              {playground.productInfo.benefits}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
              <span className="text-sm text-gray-400">Générer</span>
              {[5, 10, 20].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`text-sm px-2 py-0.5 rounded font-medium transition-colors ${
                    count === n
                      ? "bg-indigo-600 text-white"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {n}
                </button>
              ))}
              <span className="text-sm text-gray-400">créas</span>
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Zap size={15} className={loading ? "animate-pulse" : ""} />
              {loading ? "Génération..." : "Générer"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
      </div>

      {creatives.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {creatives.length} créa{creatives.length > 1 ? "s" : ""} générée{creatives.length > 1 ? "s" : ""}
          </p>
          <div className="flex gap-2">
            <button
              onClick={copyAll}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-all"
            >
              <Copy size={13} />
              Tout copier
            </button>
            <button
              onClick={() => saveCreatives([])}
              className="text-sm text-gray-600 hover:text-red-400 border border-white/10 hover:border-red-400/20 rounded-lg px-3 py-1.5 transition-all"
            >
              Effacer tout
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse">
              <div className="h-3 bg-white/10 rounded w-1/3 mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-white/10 rounded w-full" />
                <div className="h-3 bg-white/10 rounded w-4/5" />
                <div className="h-3 bg-white/10 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && creatives.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {creatives.map((creative) => (
            <CreativeCard
              key={creative.id}
              creative={creative}
              onDelete={() => deleteCreative(creative.id)}
            />
          ))}
        </div>
      )}

      {!loading && creatives.length === 0 && (
        <div className="text-center py-16 text-gray-600">
          <Zap size={32} className="mx-auto mb-3 opacity-30" />
          <p>Lance ta première génération ci-dessus</p>
        </div>
      )}
    </div>
  );
}
