import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Sidebar from '@/components/sidebar';

const nunito = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sworker',
  description: 'Sworker | Gerenciador de serviços e colaboradores'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <Providers>
        <body className={nunito.className + ' bg-base-1 h-screen w-screen overflow-y-auto overflow-x-hidden flex flex-col md:flex-row'}>
          {/* <Navbar /> */}
          <Sidebar />
          <div className="flex-1 h-full w-full overflow-x-hidden overflow-y-auto ">{children}</div>
        </body>
      </Providers>
    </html>
  );
}
