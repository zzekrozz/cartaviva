import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CartaViva | Carta digital con fotos y QR',
  description: 'Crea una carta digital visual para restaurantes con fotos, menú del día, idiomas y QR para mesas.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
