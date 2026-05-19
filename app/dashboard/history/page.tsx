import { ScanHistory } from "@/components/dashboard/ScanHistory";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-white">Historique des scans</h1>
        <p className="text-[#52525b] text-sm mt-1">Tes 20 dernières analyses de boutiques Shopify.</p>
      </div>
      <ScanHistory />
    </div>
  );
}
