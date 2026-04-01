export type AwarenessLevel = "TOF" | "MOF" | "BOF";
export type CreativeFormat = "static" | "carousel" | "video";

export interface ProductInfo {
  name: string;
  benefits: string;
  targetAudience: string;
  price: string;
  angle: string;
}

export interface Playground {
  id: string;
  name: string;
  awareness: AwarenessLevel;
  format: CreativeFormat;
  niche: string;
  productInfo: ProductInfo;
  createdAt: string;
}

export interface Creative {
  id: string;
  playgroundId: string;
  headline: string;
  body: string;
  cta: string;
  hook: string;
  hookType: string;
  visualDescription: string;
  imageUrl?: string;
  generatedAt: string;
}

export interface GenerateRequest {
  playground: Playground;
  count: number;
}
