import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { GenerateRequest, Creative } from "@/lib/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const AWARENESS_CONTEXT = {
  TOF: "La cible ne connaît pas encore le produit. Capte l'attention sur un problème ou une émotion. Pas de vente directe. Hook accrocheur, storytelling, curiosité.",
  MOF: "La cible connaît le problème et cherche une solution. Compare les options. Mets en avant les différenciateurs et bénéfices concrets.",
  BOF: "La cible est prête à acheter. Lève les dernières objections. Urgence, preuve sociale, garanties, offre claire.",
};

const FORMAT_CONTEXT = {
  static: "Image statique. 1 headline fort, body court, 1 CTA. Maximum d'impact en une seule image.",
  carousel: "Plusieurs slides. Slide 1 = hook, slides suivantes = bénéfices/preuves, dernière slide = CTA.",
  video: "Script vidéo court (15-30s). Hook en 3s, développement, CTA final. Pense au texte à l'écran.",
};

function buildPrompt(req: GenerateRequest): string {
  const { playground, count } = req;
  const { productInfo, awareness, format, niche } = playground;

  return `Tu es un expert en création de publicités e-commerce performantes (style créas strat).

CONTEXTE PRODUIT:
- Produit: ${productInfo.name}
- Bénéfices: ${productInfo.benefits}
- Cible: ${productInfo.targetAudience}
- Prix: ${productInfo.price || "non précisé"}
- Angle/Positionnement: ${productInfo.angle || "non précisé"}
- Niche: ${niche}

NIVEAU D'AWARENESS: ${awareness}
${AWARENESS_CONTEXT[awareness]}

FORMAT CRÉA: ${format}
${FORMAT_CONTEXT[format]}

MISSION: Génère exactement ${count} créas publicitaires différentes. Chaque créa doit avoir un angle/hook UNIQUE. Varie les approches: problème/solution, transformation, social proof, curiosité, urgence, bénéfice direct, question, etc.

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ni après:
[
  {
    "headline": "Titre accrocheur (max 8 mots)",
    "body": "Corps du texte (2-4 phrases max, percutantes)",
    "cta": "Appel à l'action (3-5 mots)",
    "hook": "Le hook principal en 1 phrase",
    "hookType": "Type de hook: problème|transformation|curiosité|social_proof|urgence|bénéfice|question|chiffre",
    "visualDescription": "Description de l'visuel idéal pour cette créa (2-3 phrases pour guider la génération d'image)"
  }
]`;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();

    if (!body.playground || !body.count) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: buildPrompt(body) }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Réponse inattendue" }, { status: 500 });
    }

    let parsed: Array<Omit<Creative, "id" | "playgroundId" | "generatedAt">>;
    try {
      const raw = content.text.trim();
      const jsonStart = raw.indexOf("[");
      const jsonEnd = raw.lastIndexOf("]") + 1;
      parsed = JSON.parse(raw.slice(jsonStart, jsonEnd));
    } catch {
      return NextResponse.json({ error: "Erreur parsing JSON" }, { status: 500 });
    }

    const creatives: Creative[] = parsed.map((c) => ({
      ...c,
      id: crypto.randomUUID(),
      playgroundId: body.playground.id,
      generatedAt: new Date().toISOString(),
    }));

    return NextResponse.json({ creatives });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
