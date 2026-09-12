'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {Product} from '@/data/products';

export default function ProductDetail({product}: {product: Product}) {
  const t = useTranslations('Products');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await fetch('/api/scan', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, slug: product.slug}),
    });
    setSubmitted(true);
    setEmail('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary transition-colors">Productos</Link>
        <span>/</span>
        <span className="text-text-main font-medium">{product.name.es}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Image */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-border/50">
            <div className="aspect-[3/4] bg-gray-100">
              <img
                src={product.image}
                alt={product.name.es}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <Link
            href={`/products/${product.slug}/qr`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-surface-dark text-white rounded-xl hover:bg-accent-blue transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            {t('viewQR')} del producto
          </Link>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 border border-border/50 flex-1">
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                {product.category.es}
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-text-main mb-2">
              {product.name.es}
            </h1>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-text-secondary uppercase mb-2 tracking-wide">
                {t('description')}
              </h2>
              <p className="text-text-main leading-relaxed">{product.description.es}</p>
            </div>

            {/* Origin */}
            <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {product.origin.es}
            </div>

            {/* Cluster Thanks */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary-green/5 rounded-xl p-4 border border-primary/20 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-text-main leading-relaxed">
                  {t('clusterThanks')}
                </p>
              </div>
            </div>

            {/* Email Capture */}
            <div className="bg-bg rounded-xl p-4 border border-border">
              <h3 className="text-sm font-semibold text-text-main mb-3">
                {t('wantMoreInfo')}
              </h3>
              {submitted ? (
                <div className="flex items-center gap-2 text-primary text-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ¡Gracias! Te contactaremos pronto.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors shrink-0"
                  >
                    {t('submit')}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm text-accent-blue hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('back')} a productos
            </Link>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden border border-border/50 p-4 max-w-md mx-auto lg:max-w-none">
        <img
          src="/images/zacatlan_mapa.png"
          alt="Mapa de la región Chignahuapan Zacatlán"
          className="w-full h-auto rounded-xl opacity-80 hover:opacity-100 transition-opacity"
        />
      </div>
    </div>
  );
}
