import type { Metadata } from 'next';
import '../globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Bradley Savoy | DevOps & SRE',
  description: 'Thoughts on DevOps, SRE, infrastructure, and building reliable systems — by Bradley Savoy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
