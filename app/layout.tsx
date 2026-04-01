import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CréaEcom — Générateur de créas AI",
  description: "Générez 10/20 créas ecom quali en quelques clics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#0f0f11] text-gray-100 antialiased">
        <header className="border-b border-white/10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight">
                ⚡ CréaEcom
              </span>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                beta
              </span>
            </div>
            <span className="text-sm text-gray-500">
              Powered by Claude + OpenAI
            </span>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
