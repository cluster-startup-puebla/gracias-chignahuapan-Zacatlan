import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cluster Innovación',
  description: 'Productos artesanales Chignahuapan-Zacatlán',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return children;
}
