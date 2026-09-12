export interface Product {
  slug: string;
  name: {es: string; en: string};
  description: {es: string; en: string};
  image: string;
  category: {es: string; en: string};
  origin: {es: string; en: string};
}

export const products: Product[] = [
  {
    slug: 'refresco-delison-manzana',
    name: {
      es: 'Refresco Delison de Manzana',
      en: 'Delison Apple Soda',
    },
    description: {
      es: 'Refresco artesanal de manzana elaborado con frutas frescas de la región de Chignahuapan. Sin conservadores artificiales, elaborado con recetas tradicionales que preservan el sabor auténtico de la manzana. Un producto del Clúster Innovación y experiencias turísticas.',
      en: 'Artisanal apple soda made with fresh fruits from the Chignahuapan region. No artificial preservatives, made with traditional recipes that preserve the authentic flavor of apple. A product of the Innovation Cluster & Tourism Experiences.',
    },
    image: '/images/Refresco-2-scaled-768x1152.jpg',
    category: {es: 'Bebidas Artesanales', en: 'Artisanal Beverages'},
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
