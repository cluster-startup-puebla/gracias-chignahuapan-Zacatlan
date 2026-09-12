import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {Product} from '@/data/products';

export default function ProductCard({product}: {product: Product}) {
  const t = useTranslations('Products');

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border/50"
    >
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name.es}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-block bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
            {t('technicalSheet')}
          </span>
        </div>
        {product.price && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {product.price}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[11px] text-text-secondary font-medium uppercase tracking-wider">
            {product.category.es}
          </span>
        </div>
        <h3 className="text-base font-bold text-text-main group-hover:text-primary transition-colors">
          {product.name.es}
        </h3>
        <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
          {product.description.es}
        </p>
        <div className="flex items-center gap-1.5 mt-3 text-xs text-text-secondary">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {product.origin.es}
        </div>
      </div>
    </Link>
  );
}
