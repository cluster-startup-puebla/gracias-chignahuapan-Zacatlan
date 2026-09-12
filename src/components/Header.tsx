'use client';

import {useState, useEffect} from 'react';
import {useTranslations} from 'next-intl';
import {useRouter, usePathname, Link} from '@/i18n/navigation';

export default function Header() {
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = (locale: string) => {
    router.replace(pathname, {locale});
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <header
        className={`flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? 'bg-surface-dark/95 backdrop-blur-md shadow-lg px-4 py-2 rounded-full w-full max-w-2xl'
            : 'bg-surface-dark px-6 py-3 rounded-full w-full max-w-4xl'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/images/logo-cluster.png"
            alt="Cluster"
            className="h-8 w-8 rounded-full bg-white p-0.5"
          />
          <span className={`font-bold text-white transition-all duration-300 ${scrolled ? 'text-sm' : 'text-base'}`}>
            Cluster Chignahuapan Zacatlán
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="text-white/80 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full text-sm transition-all"
          >
            {t('home')}
          </Link>
          <Link
            href="/products"
            className="text-white/80 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full text-sm transition-all"
          >
            {t('products')}
          </Link>

          {/* Locale Switcher */}
          <div className="flex items-center gap-0.5 ml-2 bg-white/10 rounded-full px-1 py-0.5">
            <button
              onClick={() => switchLocale('es')}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-all ${
                pathname?.startsWith('/es') ? 'bg-primary text-white font-medium' : 'text-white/70 hover:text-white'
              }`}
              title="Español"
            >
              🇲🇽 ES
            </button>
            <button
              onClick={() => switchLocale('en')}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-all ${
                pathname?.startsWith('/en') ? 'bg-primary text-white font-medium' : 'text-white/70 hover:text-white'
              }`}
              title="English"
            >
              🇺🇸 EN
            </button>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-1"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-16 left-4 right-4 bg-surface-dark/95 backdrop-blur-md rounded-2xl p-4 shadow-xl">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="block text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm transition-all"
          >
            {t('home')}
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileOpen(false)}
            className="block text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm transition-all"
          >
            {t('products')}
          </Link>
          <div className="flex gap-1 mt-2 pt-2 border-t border-white/10">
            <button
              onClick={() => { switchLocale('es'); setMobileOpen(false); }}
              className={`flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg transition-all ${
                pathname?.startsWith('/es') ? 'bg-primary text-white font-medium' : 'text-white/70 hover:bg-white/10'
              }`}
              title="Español"
            >
              🇲🇽 ES
            </button>
            <button
              onClick={() => { switchLocale('en'); setMobileOpen(false); }}
              className={`flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg transition-all ${
                pathname?.startsWith('/en') ? 'bg-primary text-white font-medium' : 'text-white/70 hover:bg-white/10'
              }`}
              title="English"
            >
              🇺🇸 EN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
