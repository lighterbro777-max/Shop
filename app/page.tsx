"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Playground } from "@/lib/types";
import PlaygroundCard from "@/components/PlaygroundCard";
import CreatePlaygroundModal from "@/components/CreatePlaygroundModal";

export default function Dashboard() {
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("playgrounds");
    if (stored) setPlaygrounds(JSON.parse(stored));
  }, []);

  function savePlaygrounds(updated: Playground[]) {
    setPlaygrounds(updated);
    localStorage.setItem("playgrounds", JSON.stringify(updated));
  }

  function handleCreate(playground: Playground) {
    savePlaygrounds([...playgrounds, playground]);
    setShowModal(false);
  }

  function handleDelete(id: string) {
    savePlaygrounds(playgrounds.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Mes Playgrounds</h1>
          <p className="text-gray-500 text-sm mt-1">
            Chaque playground = un contexte produit × awareness × format
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Nouveau playground
        </button>
      </div>

      {playgrounds.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-white/10 rounded-xl">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-gray-400 mb-2">Aucun playground pour l'instant</p>
          <p className="text-gray-600 text-sm mb-6">
            Crée ton premier playground pour commencer à générer des créas
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Créer mon premier playground
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playgrounds.map((p) => (
            <PlaygroundCard key={p.id} playground={p} onDelete={handleDelete} />
          ))}
          <button
            onClick={() => setShowModal(true)}
            className="border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-gray-400 hover:border-white/20 transition-all min-h-[160px]"
          >
            <Plus size={20} />
            <span className="text-sm">Nouveau playground</span>
          </button>
        </div>
      )}

      {showModal && (
        <CreatePlaygroundModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
