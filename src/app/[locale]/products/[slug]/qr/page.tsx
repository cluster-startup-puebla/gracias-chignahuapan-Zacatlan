import {notFound} from 'next/navigation';
import {getProductBySlug, products} from '@/data/products';
import QRGenerator from '@/components/QRGenerator';
import {Link} from '@/i18n/navigation';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return products.map((p) => ({slug: p.slug}));
}

export default async function ProductQRPage({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const productUrl = `${baseUrl}/es/products/${product.slug}`;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
      <h1 className="text-2xl font-bold text-center mb-2">{product.name.es}</h1>
      <QRGenerator url={productUrl} productName={product.slug} />
      <div className="mt-6 text-center">
        <Link
          href={`/products/${product.slug}`}
          className="text-accent-blue hover:text-primary transition-colors text-sm inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Ver ficha del producto
        </Link>
      </div>
    </div>
  );
}
