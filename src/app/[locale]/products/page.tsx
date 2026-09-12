import {useTranslations} from 'next-intl';
import {products} from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const t = useTranslations('Products');

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-12">
      <h1 className="text-3xl font-bold text-center mb-8">{t('title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
