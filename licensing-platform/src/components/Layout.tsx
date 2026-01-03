import { ReactNode } from 'react';
import Head from 'next/head';
import Navigation from './Navigation';

type LayoutProps = {
  children: ReactNode;
  title?: string;
  showNavigation?: boolean;
};

export default function Layout({ 
  children, 
  title = 'Licensing Platform', 
  showNavigation = true 
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Secure software licensing platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {showNavigation && <Navigation />}
      <main>{children}</main>
    </div>
  );
}