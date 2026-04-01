"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Playground, AwarenessLevel, CreativeFormat } from "@/lib/types";

interface Props {
  onClose: () => void;
  onCreate: (playground: Playground) => void;
}

const NICHES = [
  "Mode & Vêtements",
  "Beauté & Cosmétiques",
  "Fitness & Sport",
  "Alimentation & Nutrition",
  "Maison & Déco",
  "Tech & Gadgets",
  "Enfants & Bébé",
  "Animaux",
  "Formation & Info-produit",
  "Autre",
];

export default function CreatePlaygroundModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [awareness, setAwareness] = useState<AwarenessLevel>("TOF");
  const [format, setFormat] = useState<CreativeFormat>("static");
  const [niche, setNiche] = useState(NICHES[0]);
  const [productName, setProductName] = useState("");
  const [benefits, setBenefits] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [price, setPrice] = useState("");
  const [angle, setAngle] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const playground: Playground = {
      id: crypto.randomUUID(),
      name,
      awareness,
      format,
      niche,
      productInfo: {
        name: productName,
        benefits,
        targetAudience,
        price,
        angle,
      },
      createdAt: new Date().toISOString(),
    };
    onCreate(playground);
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold">Nouveau Playground</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-sm text-gray-400 block mb-1.5">
              Nom du playground
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Serum Visage — TOF Instagram"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 placeholder:text-gray-600"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-gray-400 block mb-1.5">
                Awareness
              </label>
              <select
                value={awareness}
                onChange={(e) => setAwareness(e.target.value as AwarenessLevel)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
              >
                <option value="TOF">TOF</option>
                <option value="MOF">MOF</option>
                <option value="BOF">BOF</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1.5">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as CreativeFormat)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
              >
                <option value="static">Static</option>
                <option value="carousel">Carousel</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1.5">
                Niche
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
              >
                {NICHES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr className="border-white/10" />
          <p className="text-sm font-medium text-gray-300">
            Info produit
          </p>

          <div>
            <label className="text-sm text-gray-400 block mb-1.5">
              Nom du produit
            </label>
            <input
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="ex: Sérum Vitamine C Pro"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 placeholder:text-gray-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-1.5">
              Bénéfices clés (séparés par une virgule)
            </label>
            <input
              required
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              placeholder="ex: anti-âge, éclat immédiat, hydratation 24h"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 placeholder:text-gray-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-400 block mb-1.5">
                Cible
              </label>
              <input
                required
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="ex: Femmes 30-50 ans"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1.5">
                Prix
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="ex: 39€"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 placeholder:text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-1.5">
              Angle / Positionnement (optionnel)
            </label>
            <input
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              placeholder="ex: résultats visibles en 7 jours, made in France"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 placeholder:text-gray-600"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-white/10 hover:border-white/20 rounded-lg py-2.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
            >
              Créer le playground
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
