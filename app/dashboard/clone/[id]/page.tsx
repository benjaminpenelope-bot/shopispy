import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/lib/mock-data";
import { CloneResult } from "@/components/dashboard/CloneResult";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClonePage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/dashboard/search" className="hover:text-primary transition-colors font-medium">
          Recherche
        </Link>
        <span className="text-text-light">›</span>
        <span className="text-ink font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      <CloneResult product={product} />
    </div>
  );
}
