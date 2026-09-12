import {notFound} from 'next/navigation';
import {products, getProductBySlug} from '@/data/products';
import ProductDetail from '@/components/ProductDetail';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return products.map((p) => ({slug: p.slug}));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
