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
    image: '/images/Refresco-2-scaled-768x1152.jpg',
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
