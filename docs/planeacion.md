# Plan de Implementación: Manzanita POC — QR Productos Cluster Innovación

> **Para agentes de código:** Usar la skill `executing-plans` o `subagent-driven-development` para implementar este plan tarea por tarea. Pasos con checkbox (`- [ ]`) para tracking.

**Objetivo:** Crear una mini POC donde un QR escaneado en un producto abre una ficha técnica del producto con agradecimiento al Cluster Innovación y experiencias turísticas Chignahuapan-Zacatlán A.C., con dashboard protegido de estadísticas de escaneos.

**Arquitectura:** Next.js 14 (App Router) con Tailwind CSS, internacionalización (es/en), generación dinámica de QR por producto, API de tracking de escaneos, y dashboard protegido con PIN.

**Stack:** Next.js 14, TypeScript, Tailwind CSS, next-intl, qrcode.react, recharts

---

## Estructura de Archivos

```
manzanita/
├── public/
│   └── images/
│       ├── manzanitas.jpeg          # Foto producto 1
│       ├── muchas_manzanitas.jpeg   # Foto producto 2
│       └── logo-cluster.png         # Logo del cluster
├── src/
│   ├── i18n/
│   │   ├── request.ts               # Config next-intl request
│   │   ├── routing.ts               # Routing config i18n
│   │   └── navigation.ts            # Navegación i18n
│   ├── dictionaries/
│   │   ├── es.json                  # Diccionario español
│   │   └── en.json                  # Diccionario inglés
│   ├── data/
│   │   ├── products.ts              # Diccionario de productos
│   │   ├── cluster.ts               # Datos institucionales del cluster
│   │   └── scans.ts                 # Store en memoria + persistencia JSON
│   ├── app/
│   │   ├── layout.tsx               # Root layout
│   │   ├── [locale]/
│   │   │   ├── layout.tsx           # Layout con i18n
│   │   │   ├── page.tsx             # Landing del cluster
│   │   │   └── products/
│   │   │       └── [slug]/
│   │   │           ├── page.tsx     # Ficha técnica producto
│   │   │           └── qr/
│   │   │               └── page.tsx # Página que muestra QR del producto
│   │   ├── estadistica/
│   │   │   └── page.tsx             # Dashboard protegido (sin i18n)
│   │   └── api/
│   │       ├── scan/
│   │       │   └── route.ts         # POST para registrar escaneo
│   │       └── stats/
│   │           └── route.ts         # GET estadísticas agregadas
│   └── components/
│       ├── Header.tsx               # Navegación + switcher idioma
│       ├── ProductCard.tsx          # Card de producto en landing
│       ├── ProductDetail.tsx        # Ficha técnica completa
│       ├── QRGenerator.tsx          # Componente QR
│       ├── InfoBanner.tsx           # Banner "recibe más info"
│       ├── StatsDashboard.tsx       # Dashboard con gráficas
│       └── PinAuth.tsx              # Componente de autenticación PIN
├── messages/
│   ├── es.json                      # Traducciones next-intl
│   └── en.json
├── .env.local                       # Variables de entorno
├── next.config.mjs                  # Config next + next-intl
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── middleware.ts                     # Middleware i18n + redirect
```

---

## Fase 1: Scaffolding del Proyecto (30 min)

### Tarea 1.1: Inicializar proyecto Next.js

- [ ] **Paso 1:** Crear proyecto Next.js con TypeScript y Tailwind
```bash
npx create-next-app@latest manzanita --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```
- [ ] **Paso 2:** Verificar que el proyecto compila
```bash
cd manzanita && npm run dev
```
- [ ] **Paso 3:** Commit
```bash
git init && git add . && git commit -m "chore: init next.js project with tailwind"
```

### Tarea 1.2: Instalar dependencias

- [ ] **Paso 1:** Instalar paquetes necesarios
```bash
npm install next-intl qrcode.react recharts
```
- [ ] **Paso 2:** Commit
```bash
git add . && git commit -m "deps: add next-intl, qrcode.react, recharts"
```

### Tarea 1.3: Configurar variables de entorno

- [ ] **Paso 1:** Crear `.env.local`
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ADMIN_PIN=1234
```
- [ ] **Paso 2:** Commit
```bash
git add .env.local && git commit -m "chore: add env variables"
```

---

## Fase 2: Configuración i18n (45 min)

### Tarea 2.1: Configurar next-intl routing

- [ ] **Paso 1:** Crear `src/i18n/routing.ts`
```typescript
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es'
});
```
- [ ] **Paso 2:** Crear `src/i18n/request.ts`
```typescript
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```
- [ ] **Paso 3:** Crear `src/i18n/navigation.ts`
```typescript
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
```
- [ ] **Paso 4:** Commit
```bash
git add src/i18n/ && git commit -m "feat: configure next-intl routing"
```

### Tarea 2.2: Configurar Next.js para i18n

- [ ] **Paso 1:** Actualizar `next.config.mjs`
```javascript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withNextIntl(nextConfig);
```
- [ ] **Paso 2:** Commit
```bash
git add next.config.mjs && git commit -m "feat: integrate next-intl with next.js config"
```

### Tarea 2.3: Crear archivos de traducción

- [ ] **Paso 1:** Crear `messages/es.json`
```json
{
  "App": {
    "title": "Clúster Innovación y Experiencias Turísticas",
    "subtitle": "Chignahuapan - Zacatlán, Puebla",
    "description": "Descubre productos artesanales de nuestra región"
  },
  "Home": {
    "welcome": "Bienvenido",
    "hero": "Clúster Innovación y Experiencias Turísticas",
    "subtitle": "Chignahuapan - Zacatlán, Puebla",
    "description": "Vinculando sectores para fomentar el desarrollo económico, turístico y cultural de la región.",
    "seeProducts": "Ver Productos",
    "aboutTitle": "Quiénes Somos",
    "visionLabel": "Visión",
    "visionText": "Ser un clúster reconocido a nivel nacional e internacional por vincular a los diferentes sectores para implementar estrategias que fomenten el desarrollo económico, turístico y cultural de la región con servicios de calidad, calidez inclusivos y sustentables.",
    "missionLabel": "Misión",
    "missionText": "Elevar la calidad de vida de nuestros habitantes, fortalecer la identidad cultural y natural, y posicionar a Chignahuapan y Zacatlán como destinos turísticos de excelencia.",
    "actionsLabel": "Acciones",
    "actionsText": "Estrategias de vinculación entre sectores productivos, turísticos y académicos para el desarrollo regional.",
    "odsLabel": "ODS",
    "odsText": "Alineados con los Objetivos de Desarrollo Sostenible para un futuro inclusivo y sustentable.",
    "featuredProducts": "Nuestros Productos",
    "featuredProductsDesc": "Descubre los productos artesanales que representan la identidad de nuestra región.",
    "footerName": "Clúster Innovación y Experiencias Turísticas Chignahuapan-Zacatlán A.C.",
    "footerLocation": "Chignahuapan - Zacatlán, Puebla, México",
    "footerCopy": "© 2025 Cluster Innovación. Todos los derechos reservados."
  },
  "Products": {
    "title": "Nuestros Productos",
    "technicalSheet": "Ficha Técnica",
    "description": "Descripción",
    "clusterThanks": "Gracias por apoyar al Clúster Innovación y experiencias turísticas Chignahuapan-Zacatlán A.C.",
    "wantMoreInfo": "¿Deseas recibir más información?",
    "emailPlaceholder": "Tu correo electrónico",
    "submit": "Enviar",
    "viewQR": "Ver Código QR",
    "back": "Volver"
  },
  "QR": {
    "title": "Código QR del Producto",
    "scanInstruction": "Escanea este código con tu teléfono para ver la ficha del producto",
    "download": "Descargar QR"
  },
  "Stats": {
    "title": "Panel de Estadísticas",
    "enterPin": "Ingresa el PIN de acceso",
    "pinPlaceholder": "PIN de 4 dígitos",
    "access": "Acceder",
    "totalScans": "Total de Escaneos",
    "todayScans": "Escaneos Hoy",
    "topProducts": "Productos Más Escaneados",
    "scansByDate": "Escaneos por Fecha",
    "recentScans": "Escaneos Recientes",
    "collectedEmails": "Correos Recopilados",
    "product": "Producto",
    "scans": "Escaneos",
    "date": "Fecha",
    "email": "Correo",
    "invalidPin": "PIN inválido",
    "logout": "Cerrar Sesión",
    "productBreakdown": "Desglose por Producto"
  },
  "Nav": {
    "home": "Inicio",
    "products": "Productos",
    "stats": "Estadísticas"
  }
}
```
- [ ] **Paso 2:** Crear `messages/en.json`
```json
{
  "App": {
    "title": "Innovation Cluster & Tourism Experiences",
    "subtitle": "Chignahuapan - Zacatlán, Puebla",
    "description": "Discover artisanal products from our region"
  },
  "Home": {
    "welcome": "Welcome",
    "hero": "Innovation Cluster & Tourism Experiences",
    "subtitle": "Chignahuapan - Zacatlán, Puebla",
    "description": "Connecting sectors to foster economic, tourism and cultural development in the region.",
    "seeProducts": "See Products",
    "aboutTitle": "About Us",
    "visionLabel": "Vision",
    "visionText": "To be a cluster recognized nationally and internationally for linking different sectors to implement strategies that foster the economic, tourism and cultural development of the region with quality, warmth, inclusive and sustainable services.",
    "missionLabel": "Mission",
    "missionText": "To improve the quality of life of our inhabitants, strengthen cultural and natural identity, and position Chignahuapan and Zacatlán as tourism destinations of excellence.",
    "actionsLabel": "Actions",
    "actionsText": "Strategies for linking productive, tourism and academic sectors for regional development.",
    "odsLabel": "SDGs",
    "odsText": "Aligned with the Sustainable Development Goals for an inclusive and sustainable future.",
    "featuredProducts": "Our Products",
    "featuredProductsDesc": "Discover the artisanal products that represent the identity of our region.",
    "footerName": "Innovation Cluster & Tourism Experiences Chignahuapan-Zacatlán A.C.",
    "footerLocation": "Chignahuapan - Zacatlán, Puebla, Mexico",
    "footerCopy": "© 2025 Innovation Cluster. All rights reserved."
  },
  "Products": {
    "title": "Our Products",
    "technicalSheet": "Technical Sheet",
    "description": "Description",
    "clusterThanks": "Thank you for supporting the Innovation Cluster & Tourism Experiences Chignahuapan-Zacatlán A.C.",
    "wantMoreInfo": "Want more information?",
    "emailPlaceholder": "Your email address",
    "submit": "Submit",
    "viewQR": "View QR Code",
    "back": "Back"
  },
  "QR": {
    "title": "Product QR Code",
    "scanInstruction": "Scan this code with your phone to view the product details",
    "download": "Download QR"
  },
  "Stats": {
    "title": "Statistics Dashboard",
    "enterPin": "Enter access PIN",
    "pinPlaceholder": "4-digit PIN",
    "access": "Access",
    "totalScans": "Total Scans",
    "todayScans": "Today's Scans",
    "topProducts": "Most Scanned Products",
    "scansByDate": "Scans by Date",
    "recentScans": "Recent Scans",
    "collectedEmails": "Collected Emails",
    "product": "Product",
    "scans": "Scans",
    "date": "Date",
    "email": "Email",
    "invalidPin": "Invalid PIN",
    "logout": "Log Out",
    "productBreakdown": "Product Breakdown"
  },
  "Nav": {
    "home": "Home",
    "products": "Products",
    "stats": "Statistics"
  }
}
```
- [ ] **Paso 3:** Commit
```bash
git add messages/ && git commit -m "feat: add es/en translation dictionaries"
```

### Tarea 2.4: Configurar middleware i18n

- [ ] **Paso 1:** Crear `src/middleware.ts`
```typescript
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(es|en)/:path*']
};
```
- [ ] **Paso 2:** Commit
```bash
git add src/middleware.ts && git commit -m "feat: add i18n middleware for locale routing"
```

### Tarea 2.5: Configurar layouts con i18n

- [ ] **Paso 1:** Actualizar `src/app/layout.tsx` (root)
```typescript
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cluster Innovación',
  description: 'Productos artesanales Chignahuapan-Zacatlán',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return children;
}
```
- [ ] **Paso 2:** Crear `src/app/[locale]/layout.tsx`
```typescript
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Header from '@/components/Header';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="min-h-screen">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```
- [ ] **Paso 3:** Commit
```bash
git add src/app/ && git commit -m "feat: configure root and locale layouts with i18n provider"
```

---

## Fase 3: Diccionario de Productos y Datos (30 min)

### Tarea 3.1: Crear diccionario de productos

- [ ] **Paso 1:** Crear `src/data/products.ts`
```typescript
export interface Product {
  slug: string;
  name: {es: string; en: string};
  description: {es: string; en: string};
  image: string;
  category: {es: string; en: string};
  price?: string;
  origin: {es: string; en: string};
}

export const products: Product[] = [
  {
    slug: 'manzanitas',
    name: {
      es: 'Manzanitas',
      en: 'Manzanitas',
    },
    description: {
      es: 'Refresco artesanal de manzana elaborado con frutas frescas de la región de Chignahuapan. Sin conservadores artificiales, elaborado con recetas tradicionales que preservan el sabor auténtico de la manzana. Un producto del Clúster Innovación y experiencias turísticas.',
      en: 'Artisanal apple soda made with fresh fruits from the Chignahuapan region. No artificial preservatives, made with traditional recipes that preserve the authentic flavor of apple. A product of the Innovation Cluster & Tourism Experiences.',
    },
    image: '/images/manzanitas.jpeg',
    category: {es: 'Bebidas Artesanales', en: 'Artisanal Beverages'},
    price: '$25 MXN',
    origin: {
      es: 'Chignahuapan, Puebla',
      en: 'Chignahuapan, Puebla',
    },
  },
  {
    slug: 'muchas-manzanitas',
    name: {
      es: 'Muchas Manzanitas',
      en: 'Many Little Apples',
    },
    description: {
      es: 'Presentación familiar de refresco de manzana artesanal. Ideal para compartir en reuniones y celebraciones. Mismo sabor artesanal de nuestras Manzanitas pero en presentación grande para disfrutar con toda la familia. Elaborado con amor en Chignahuapan.',
      en: 'Family-size artisanal apple soda. Ideal for sharing at gatherings and celebrations. Same artisanal flavor as our Manzanitas but in a large format to enjoy with the whole family. Made with love in Chignahuapan.',
    },
    image: '/images/muchas_manzanitas.jpeg',
    category: {es: 'Bebidas Artesanales', en: 'Artisanal Beverages'},
    price: '$45 MXN',
    origin: {
      es: 'Chignahuapan, Puebla',
      en: 'Chignahuapan, Puebla',
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return products.map((p) => p.slug);
}
```
- [ ] **Paso 2:** Commit
```bash
git add src/data/products.ts && git commit -m "feat: add product dictionary with manzanitas and muchas-manzanitas"
```

### Tarea 3.2: Crear datos institucionales del cluster

- [ ] **Paso 1:** Crear `src/data/cluster.ts`
```typescript
export const clusterInfo = {
  name: {
    es: 'Clúster Innovación y Experiencias Turísticas Chignahuapan-Zacatlán A.C.',
    en: 'Innovation Cluster & Tourism Experiences Chignahuapan-Zacatlán A.C.',
  },
  shortName: {
    es: 'Cluster Innovación',
    en: 'Innovation Cluster',
  },
  location: {
    es: 'Chignahuapan - Zacatlán, Puebla, México',
    en: 'Chignahuapan - Zacatlán, Puebla, Mexico',
  },
  vision: {
    es: 'Ser un clúster reconocido a nivel nacional e internacional por vincular a los diferentes sectores para implementar estrategias que fomenten el desarrollo económico, turístico y cultural de la región con servicios de calidad, calidez inclusivos y sustentables.',
    en: 'To be a cluster recognized nationally and internationally for linking different sectors to implement strategies that foster the economic, tourism and cultural development of the region with quality, warmth, inclusive and sustainable services.',
  },
  mission: {
    es: 'Elevar la calidad de vida de nuestros habitantes, fortalecer la identidad cultural y natural, y posicionar a Chignahuapan y Zacatlán como destinos turísticos de excelencia.',
    en: 'To improve the quality of life of our inhabitants, strengthen cultural and natural identity, and position Chignahuapan and Zacatlán as tourism destinations of excellence.',
  },
  actions: {
    es: 'Estrategias de vinculación entre sectores productivos, turísticos y académicos para el desarrollo regional.',
    en: 'Strategies for linking productive, tourism and academic sectors for regional development.',
  },
  ods: {
    es: 'Alineados con los Objetivos de Desarrollo Sostenible para un futuro inclusivo y sustentable.',
    en: 'Aligned with the Sustainable Development Goals for an inclusive and sustainable future.',
  },
};
```
- [ ] **Paso 2:** Commit
```bash
git add src/data/cluster.ts && git commit -m "feat: add institutional cluster data"
```

### Tarea 3.4: Crear store de escaneos

- [ ] **Paso 1:** Crear `src/data/scans.ts`
```typescript
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SCANS_FILE = path.join(DATA_DIR, 'scans.json');
const EMAILS_FILE = path.join(DATA_DIR, 'emails.json');

export interface ScanEntry {
  slug: string;
  timestamp: string;
  ip?: string;
}

export interface EmailEntry {
  email: string;
  slug: string;
  timestamp: string;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {recursive: true});
  }
}

function readJSON<T>(filePath: string, fallback: T): T {
  ensureDataDir();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw) as T;
    }
  } catch {
    // ignore
  }
  return fallback;
}

function writeJSON(filePath: string, data: unknown) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function recordScan(slug: string, ip?: string) {
  const scans = readJSON<ScanEntry[]>(SCANS_FILE, []);
  scans.push({
    slug,
    timestamp: new Date().toISOString(),
    ip,
  });
  writeJSON(SCANS_FILE, scans);
}

export function recordEmail(email: string, slug: string) {
  const emails = readJSON<EmailEntry[]>(EMAILS_FILE, []);
  emails.push({
    email,
    slug,
    timestamp: new Date().toISOString(),
  });
  writeJSON(EMAILS_FILE, emails);
}

export function getAllScans(): ScanEntry[] {
  return readJSON<ScanEntry[]>(SCANS_FILE, []);
}

export function getAllEmails(): EmailEntry[] {
  return readJSON<EmailEntry[]>(EMAILS_FILE, []);
}

export function getStatsByProduct() {
  const scans = getAllScans();
  const counts: Record<string, number> = {};
  for (const scan of scans) {
    counts[scan.slug] = (counts[scan.slug] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([slug, count]) => ({slug, scans: count}))
    .sort((a, b) => b.scans - a.scans);
}

export function getScansByDate() {
  const scans = getAllScans();
  const byDate: Record<string, number> = {};
  for (const scan of scans) {
    const date = scan.timestamp.split('T')[0];
    byDate[date] = (byDate[date] || 0) + 1;
  }
  return Object.entries(byDate)
    .map(([date, count]) => ({date, scans: count}))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getTodayScans(): number {
  const today = new Date().toISOString().split('T')[0];
  return getAllScans().filter((s) => s.timestamp.startsWith(today)).length;
}
```
- [ ] **Paso 2:** Crear directorio `data/` y archivo inicial
```bash
mkdir -p data && echo '[]' > data/scans.json && echo '[]' > data/emails.json
```
- [ ] **Paso 3:** Commit
```bash
git add src/data/scans.ts data/ && git commit -m "feat: add scan tracking store with persistence"
```

---

## Fase 4: Componentes UI (1 hora)

### Tarea 4.1: Componente Header con switcher de idioma

- [ ] **Paso 1:** Crear `src/components/Header.tsx`
```tsx
'use client';

import {useTranslations} from 'next-intl';
import {useRouter, usePathname} from '@/i18n/navigation';

export default function Header() {
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (locale: string) => {
    router.replace(pathname, {locale});
  };

  return (
    <header className="bg-green-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo-cluster.png"
            alt="Cluster Innovación"
            className="h-10 w-10 rounded"
          />
          <span className="font-bold text-lg hidden sm:block">
            Cluster Innovación
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <a href="/" className="hover:underline text-sm">
            {t('home')}
          </a>
          <a href="/products" className="hover:underline text-sm">
            {t('products')}
          </a>
          <div className="flex gap-1 border-l pl-4 ml-2">
            <button
              onClick={() => switchLocale('es')}
              className="text-xs px-2 py-1 rounded hover:bg-green-600"
            >
              ES
            </button>
            <button
              onClick={() => switchLocale('en')}
              className="text-xs px-2 py-1 rounded hover:bg-green-600"
            >
              EN
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
```
- [ ] **Paso 2:** Commit
```bash
git add src/components/Header.tsx && git commit -m "feat: add Header component with locale switcher"
```

### Tarea 4.2: Componente ProductCard

- [ ] **Paso 1:** Crear `src/components/ProductCard.tsx`
```tsx
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {Product} from '@/data/products';

export default function ProductCard({product}: {product: Product}) {
  const t = useTranslations('Products');

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gray-100">
        <img
          src={product.image}
          alt={product.name.es}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <span className="text-xs text-green-700 font-medium uppercase tracking-wide">
          {product.category.es}
        </span>
        <h3 className="text-lg font-bold mt-1 text-gray-900">{product.name.es}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {product.description.es}
        </p>
        {product.price && (
          <p className="text-green-700 font-bold mt-2">{product.price}</p>
        )}
        <div className="mt-3 flex gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 text-center bg-green-700 text-white py-2 rounded-lg text-sm hover:bg-green-800 transition"
          >
            {t('technicalSheet')}
          </Link>
          <Link
            href={`/products/${product.slug}/qr`}
            className="px-3 py-2 border border-green-700 text-green-700 rounded-lg text-sm hover:bg-green-50 transition"
          >
            QR
          </Link>
        </div>
      </div>
    </div>
  );
}
```
- [ ] **Paso 2:** Commit
```bash
git add src/components/ProductCard.tsx && git commit -m "feat: add ProductCard component"
```

### Tarea 4.3: Componente ProductDetail

- [ ] **Paso 1:** Crear `src/components/ProductDetail.tsx`
```tsx
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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="aspect-video bg-gray-100">
          <img
            src={product.image}
            alt={product.name.es}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <span className="text-xs text-green-700 font-medium uppercase tracking-wide">
            {product.category.es}
          </span>
          <h1 className="text-2xl font-bold mt-1 text-gray-900">
            {product.name.es}
          </h1>
          {product.price && (
            <p className="text-green-700 font-bold text-xl mt-2">{product.price}</p>
          )}

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              {t('description')}
            </h2>
            <p className="text-gray-700 leading-relaxed">{product.description.es}</p>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <p>Origen: {product.origin.es}</p>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-sm text-green-800 text-center font-medium">
              {t('clusterThanks')}
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              {t('wantMoreInfo')}
            </h3>
            {submitted ? (
              <p className="text-green-700 text-sm">¡Gracias! Te contactaremos.</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800"
                >
                  {t('submit')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <Link
          href="/products"
          className="text-green-700 hover:underline text-sm"
        >
          ← {t('back')}
        </Link>
        <Link
          href={`/products/${product.slug}/qr`}
          className="text-green-700 hover:underline text-sm"
        >
          {t('viewQR')} →
        </Link>
      </div>
    </div>
  );
}
```
- [ ] **Paso 2:** Commit
```bash
git add src/components/ProductDetail.tsx && git commit -m "feat: add ProductDetail component with email capture"
```

### Tarea 4.4: Componente QRGenerator

- [ ] **Paso 1:** Crear `src/components/QRGenerator.tsx`
```tsx
'use client';

import {useRef} from 'react';
import {QRCodeSVG} from 'qrcode.react';
import {useTranslations} from 'next-intl';

interface QRGeneratorProps {
  url: string;
  productName: string;
}

export default function QRGenerator({url, productName}: QRGeneratorProps) {
  const t = useTranslations('QR');
  const svgRef = useRef<SVGSVGElement>(null);

  const handleDownload = () => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qr-${productName}.png`;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <QRCodeSVG
          ref={svgRef}
          value={url}
          size={256}
          level="H"
          includeMargin
        />
      </div>
      <p className="text-gray-600 text-center text-sm">{t('scanInstruction')}</p>
      <p className="text-xs text-gray-400 break-all max-w-xs text-center">{url}</p>
      <button
        onClick={handleDownload}
        className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition"
      >
        {t('download')}
      </button>
    </div>
  );
}
```
- [ ] **Paso 2:** Commit
```bash
git add src/components/QRGenerator.tsx && git commit -m "feat: add QRGenerator component with download"
```

---

## Fase 5: API Routes (30 min)

### Tarea 5.1: API de registro de escaneo

- [ ] **Paso 1:** Crear `src/app/api/scan/route.ts`
```typescript
import {NextRequest, NextResponse} from 'next/server';
import {recordScan, recordEmail} from '@/data/scans';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {slug} = body;
  if (!slug) {
    return NextResponse.json({error: 'slug required'}, {status: 400});
  }
  const ip = request.headers.get('x-forwarded-for') || undefined;
  recordScan(slug, ip);
  return NextResponse.json({ok: true});
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const {email, slug} = body;
  if (!email || !slug) {
    return NextResponse.json({error: 'email and slug required'}, {status: 400});
  }
  recordEmail(email, slug);
  return NextResponse.json({ok: true});
}
```
- [ ] **Paso 2:** Commit
```bash
git add src/app/api/scan/route.ts && git commit -m "feat: add scan tracking API endpoint"
```

### Tarea 5.2: API de estadísticas

- [ ] **Paso 1:** Crear `src/app/api/stats/route.ts`
```typescript
import {NextRequest, NextResponse} from 'next/server';
import {
  getAllScans,
  getAllEmails,
  getStatsByProduct,
  getScansByDate,
  getTodayScans,
} from '@/data/scans';

export async function GET(request: NextRequest) {
  const pin = request.headers.get('x-admin-pin');
  if (pin !== process.env.ADMIN_PIN) {
    return NextResponse.json({error: 'unauthorized'}, {status: 401});
  }

  return NextResponse.json({
    totalScans: getAllScans().length,
    todayScans: getTodayScans(),
    byProduct: getStatsByProduct(),
    byDate: getScansByDate(),
    recentScans: getAllScans().slice(-20).reverse(),
    emails: getAllEmails(),
  });
}
```
- [ ] **Paso 2:** Commit
```bash
git add src/app/api/stats/route.ts && git commit -m "feat: add stats API endpoint with PIN auth"
```

---

## Fase 6: Páginas (1 hora)

### Tarea 6.1: Landing page del cluster

- [ ] **Paso 1:** Crear `src/app/[locale]/page.tsx`
```typescript
import {useTranslations} from 'next-intl';
import {products} from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const t = useTranslations('Home');

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-green-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src="/images/logo-cluster.png"
            alt="Logo Cluster Innovación"
            className="w-28 h-28 mx-auto mb-6 rounded-full bg-white p-2"
          />
          <h1 className="text-4xl md:text-5xl font-bold">{t('hero')}</h1>
          <p className="mt-4 text-lg text-green-100 max-w-2xl mx-auto">
            {t('description')}
          </p>
          <a
            href="/products"
            className="mt-8 inline-block bg-white text-green-800 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition"
          >
            {t('seeProducts')}
          </a>
        </div>
      </section>

      {/* Quiénes Somos */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('aboutTitle')}
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Visión / Descripción */}
            <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-800">{t('visionLabel')}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t('visionText')}
              </p>
            </div>

            {/* Misión */}
            <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-800">{t('missionLabel')}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t('missionText')}
              </p>
            </div>
          </div>

          {/* Acciones y ODS */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('actionsLabel')}</h3>
              <p className="text-sm text-gray-600">{t('actionsText')}</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('odsLabel')}</h3>
              <p className="text-sm text-gray-600">{t('odsText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            {t('featuredProducts')}
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">
            {t('featuredProductsDesc')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src="/images/logo-cluster.png"
            alt="Logo"
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-white p-1"
          />
          <p className="font-bold text-lg">{t('footerName')}</p>
          <p className="text-green-200 text-sm mt-1">{t('footerLocation')}</p>
          <p className="text-green-300 text-xs mt-4">{t('footerCopy')}</p>
        </div>
      </footer>
    </div>
  );
}
```
- [ ] **Paso 2:** Commit
```bash
git add src/app/\[locale\]/page.tsx && git commit -m "feat: add cluster landing page with institutional content"
```

### Tarea 6.2: Página de directorio de productos

- [ ] **Paso 1:** Crear `src/app/[locale]/products/page.tsx`
```typescript
import {useTranslations} from 'next-intl';
import {products} from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const t = useTranslations('Products');

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">{t('title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
```
- [ ] **Paso 2:** Commit
```bash
git add src/app/\[locale\]/products/page.tsx && git commit -m "feat: add products directory page"
```

### Tarea 6.3: Página de ficha técnica (producto individual)

- [ ] **Paso 1:** Crear `src/app/[locale]/products/[slug]/page.tsx`
```typescript
import {notFound} from 'next/navigation';
import {products, getProductBySlug} from '@/data/products';
import ProductDetail from '@/components/ProductDetail';

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
```
- [ ] **Paso 2:** Commit
```bash
mkdir -p src/app/\[locale\]/products/\[slug\]
git add src/app/\[locale\]/products/\[slug\]/page.tsx && git commit -m "feat: add product detail page"
```

### Tarea 6.4: Página QR del producto

- [ ] **Paso 1:** Crear `src/app/[locale]/products/[slug]/qr/page.tsx`
```typescript
import {notFound} from 'next/navigation';
import {getProductBySlug, products} from '@/data/products';
import QRGenerator from '@/components/QRGenerator';
import {Link} from '@/i18n/navigation';

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
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-center mb-2">{product.name.es}</h1>
      <QRGenerator url={productUrl} productName={product.slug} />
      <div className="mt-6 text-center">
        <Link
          href={`/products/${product.slug}`}
          className="text-green-700 hover:underline text-sm"
        >
          ← Ver ficha del producto
        </Link>
      </div>
    </div>
  );
}
```
- [ ] **Paso 2:** Commit
```bash
git add src/app/\[locale\]/products/\[slug\]/qr/page.tsx && git commit -m "feat: add product QR page"
```

---

## Fase 7: Dashboard de Estadísticas (1 hora)

### Tarea 7.1: Componente PinAuth

- [ ] **Paso 1:** Crear `src/components/PinAuth.tsx`
```tsx
'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';

interface PinAuthProps {
  onAuthenticated: () => void;
}

export default function PinAuth({onAuthenticated}: PinAuthProps) {
  const t = useTranslations('Stats');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    try {
      const res = await fetch('/api/stats', {
        headers: {'x-admin-pin': pin},
      });
      if (res.ok) {
        sessionStorage.setItem('admin_pin', pin);
        onAuthenticated();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-xl font-bold text-center mb-6">{t('title')}</h1>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('enterPin')}
          </label>
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder={t('pinPlaceholder')}
            className="w-full px-4 py-3 border rounded-xl text-center text-2xl tracking-widest mb-4"
            autoFocus
          />
          {error && (
            <p className="text-red-600 text-sm mb-4">{t('invalidPin')}</p>
          )}
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-xl font-medium hover:bg-green-800"
          >
            {t('access')}
          </button>
        </form>
      </div>
    </div>
  );
}
```
- [ ] **Paso 2:** Commit
```bash
git add src/components/PinAuth.tsx && git commit -m "feat: add PIN authentication component"
```

### Tarea 7.2: Componente StatsDashboard

- [ ] **Paso 1:** Crear `src/components/StatsDashboard.tsx`
```tsx
'use client';

import {useState, useEffect} from 'react';
import {useTranslations} from 'next-intl';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

interface Stats {
  totalScans: number;
  todayScans: number;
  byProduct: {slug: string; scans: number}[];
  byDate: {date: string; scans: number}[];
  recentScans: {slug: string; timestamp: string}[];
  emails: {email: string; slug: string; timestamp: string}[];
}

const COLORS = ['#15803d', '#22c55e', '#86efac', '#bbf7d0'];

export default function StatsDashboard({pin}: {pin: string}) {
  const t = useTranslations('Stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats', {headers: {'x-admin-pin': pin}})
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Cargando estadísticas...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Error al cargar estadísticas</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-sm font-medium text-gray-500">{t('totalScans')}</h2>
          <p className="text-3xl font-bold text-green-700 mt-1">{stats.totalScans}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-sm font-medium text-gray-500">{t('todayScans')}</h2>
          <p className="text-3xl font-bold text-green-700 mt-1">{stats.todayScans}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-4">{t('topProducts')}</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.byProduct}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="slug" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="scans" fill="#15803d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-4">{t('scansByDate')}</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.byDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="scans" stroke="#15803d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-4">{t('productBreakdown')}</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.byProduct}
                dataKey="scans"
                nameKey="slug"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {stats.byProduct.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-4">{t('recentScans')}</h2>
          <div className="overflow-y-auto max-h-48">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-2">{t('product')}</th>
                  <th className="pb-2">{t('date')}</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentScans.map((scan, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2">{scan.slug}</td>
                    <td className="py-2 text-gray-500">
                      {new Date(scan.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">{t('collectedEmails')}</h2>
        {stats.emails.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay correos registrados aún.</p>
        ) : (
          <div className="overflow-y-auto max-h-48">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-2">{t('email')}</th>
                  <th className="pb-2">{t('product')}</th>
                  <th className="pb-2">{t('date')}</th>
                </tr>
              </thead>
              <tbody>
                {stats.emails.map((e, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2">{e.email}</td>
                    <td className="py-2">{e.slug}</td>
                    <td className="py-2 text-gray-500">
                      {new Date(e.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
```
- [ ] **Paso 2:** Commit
```bash
git add src/components/StatsDashboard.tsx && git commit -m "feat: add StatsDashboard with charts"
```

### Tarea 7.3: Página de estadísticas protegida

- [ ] **Paso 1:** Crear `src/app/estadistica/page.tsx`
```tsx
'use client';

import {useState, useEffect} from 'react';
import PinAuth from '@/components/PinAuth';
import StatsDashboard from '@/components/StatsDashboard';

export default function EstadisticaPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_pin');
    if (stored) {
      setPin(stored);
      setAuthenticated(true);
    }
  }, []);

  if (!authenticated) {
    return <PinAuth onAuthenticated={() => setAuthenticated(true)} />;
  }

  return (
    <div>
      <StatsDashboard pin={pin} />
    </div>
  );
}
```
- [ ] **Paso 2:** Commit
```bash
mkdir -p src/app/estadistica
git add src/app/estadistica/page.tsx && git commit -m "feat: add protected estadistica page"
```

---

## Fase 8: Assets y Configuración Final (20 min)

### Tarea 8.1: Agregar imágenes placeholder

- [ ] **Paso 1:** Crear directorio de imágenes
```bash
mkdir -p public/images
```
- [ ] **Paso 2:** Descargar el logo del cluster
```bash
curl -o public/images/logo-cluster.png "https://agenda2030.puebla.gob.mx/logos-sociedades/Sociedad-Civil-cluster-innovacion-y20240813185646.png"
```
- [ ] **Paso 3:** Crear imágenes placeholder para productos (usar un servicio como placehold.co o crear un SVG)
```bash
# Placeholder manzanitas - reemplazar con imagen real
curl -o public/images/manzanitas.jpeg "https://placehold.co/600x600/15803d/ffffff?text=Manzanitas"
curl -o public/images/muchas_manzanitas.jpeg "https://placehold.co/600x600/22c55e/ffffff?text=Muchas+Manzanitas"
```
- [ ] **Paso 4:** Commit
```bash
git add public/images/ && git commit -m "chore: add placeholder images and logo"
```

### Tarea 8.2: Verificar build completo

- [ ] **Paso 1:** Ejecutar build
```bash
npm run build
```
- [ ] **Paso 2:** Corregir errores si existen
- [ ] **Paso 3:** Ejecutar dev y probar manualmente
```bash
npm run dev
```
- [ ] **Paso 4:** Verificar:
  - [ ] `/` muestra landing del cluster
  - [ ] `/products` muestra directorio
  - [ ] `/products/manzanitas` muestra ficha técnica
  - [ ] `/products/manzanitas/qr` muestra QR descargable
  - [ ] `/estadistica` pide PIN (1234)
  - [ ] Al escanear QR, registra el escaneo
  - [ ] Cambio de idioma ES/EN funciona
- [ ] **Paso 5:** Commit final
```bash
git add . && git commit -m "chore: complete POC verification and fixes"
```

---

## Resumen de Entregables

| # | Entregable | Descripción |
|---|-----------|-------------|
| 1 | Landing `/` | Página principal del cluster con logo y productos |
| 2 | Directorio `/products` | Grid de productos disponibles |
| 3 | Ficha técnica `/products/[slug]` | Detalle del producto + agradecimiento + captura de email |
| 4 | QR `/products/[slug]/qr` | Generador de QR descargable |
| 5 | API `/api/scan` | Registro de escaneos |
| 6 | API `/api/stats` | Estadísticas agregadas con PIN |
| 7 | Dashboard `/estadistica` | Panel protegido con gráficas |
| 8 | i18n | Soporte español/inglés |

## Notas Importantes

- **Imágenes**: Las imágenes `manzanitas.jpeg` y `muchas_manzanitas.jpeg` son placeholders. El usuario debe reemplazarlas con las fotos reales de los productos en `public/images/`.
- **PIN**: El PIN de acceso al dashboard es `1234` (configurable en `.env.local`).
- **URL base**: Para generación de QR, se usa `NEXT_PUBLIC_BASE_URL` de `.env.local`. En producción cambiar a dominio real.
- **Persistencia**: Los datos de escaneos y emails se guardan en archivos JSON en `data/`. Para producción migrar a base de datos.
- **Extensibilidad**: El POC está diseñado para escalar a SaaS. Los productos se agregan en `src/data/products.ts`.
