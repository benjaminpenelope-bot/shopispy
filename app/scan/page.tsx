import { PublicScanner } from "@/components/scan/PublicScanner";
import { Navbar } from "@/components/landing/Navbar";

export default function ScanPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#080808] pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-center space-y-2 mb-8">
            <span className="section-tag">Scanner</span>
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-white mt-3">
              Analyse une boutique Shopify
            </h1>
            <p className="text-[#71717a] text-sm">
              Colle une URL — produits, scores et analyse IA en quelques secondes.
            </p>
          </div>
          <PublicScanner />
        </div>
      </main>
    </>
  );
}
