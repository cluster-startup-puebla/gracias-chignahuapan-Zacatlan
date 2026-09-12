import {useTranslations} from 'next-intl';
import {products} from '@/data/products';
import ProductCard from '@/components/ProductCard';
import {Link} from '@/i18n/navigation';

export default function HomePage() {
  const t = useTranslations('Home');

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-cover bg-center bg-no-repeat text-white pt-28 pb-32 px-4" style={{backgroundImage: 'url(/images/bg.jpeg)'}}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/30"></div>
        <div className="relative">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src="/images/logo-cluster.png"
            alt="Logo Cluster Innovación"
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-white p-2 shadow-xl"
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('hero')}</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {t('description')}
          </p>
          <Link
            href="/products"
            className="mt-8 inline-block bg-white text-primary font-bold px-8 py-3 rounded-full hover:bg-white/90 transition-all hover:shadow-lg hover:shadow-white/20"
          >
            {t('seeProducts')}
          </Link>
        </div>
        </div>
      </section>

      {/* Quiénes Somos */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-text-main mb-12">
            {t('aboutTitle')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <div className="bg-bg rounded-2xl p-8 border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-accent-blue">{t('visionLabel')}</h3>
              </div>
              <p className="text-text-main leading-relaxed">{t('visionText')}</p>
            </div>

            <div className="bg-bg rounded-2xl p-8 border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-accent-blue">{t('missionLabel')}</h3>
              </div>
              <p className="text-text-main leading-relaxed">{t('missionText')}</p>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-bg rounded-2xl border border-border">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">{t('actionsLabel')}</h3>
              <p className="text-sm text-text-secondary">{t('actionsText')}</p>
            </div>
            <div className="text-center p-6 bg-bg rounded-2xl border border-border">
              <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">{t('odsLabel')}</h3>
              <p className="text-sm text-text-secondary">{t('odsText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section className="bg-bg py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-text-main mb-2">Nuestra Región</h2>
          <p className="text-text-secondary mb-6">Chignahuapan y Zacatlán en el estado de Puebla</p>
          <div className="bg-white rounded-2xl p-6 border border-border shadow-sm inline-block">
            <img
              src="/images/zacatlan_mapa.png"
              alt="Mapa de la región Chignahuapan Zacatlán"
              className="max-w-sm w-full h-auto opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </section>

      {/* Productos */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-text-main mb-4">
            {t('featuredProducts')}
          </h2>
          <p className="text-center text-text-secondary mb-10 max-w-xl mx-auto">
            {t('featuredProductsDesc')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-dark text-white py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src="/images/logo-cluster.png"
            alt="Logo"
            className="w-14 h-14 mx-auto mb-4 rounded-full bg-white p-1"
          />
          <p className="font-bold text-lg">{t('footerName')}</p>
          <p className="text-white/60 text-sm mt-1">{t('footerLocation')}</p>
          <p className="text-white/40 text-xs mt-4">{t('footerCopy')}</p>
        </div>
      </footer>
    </div>
  );
}
