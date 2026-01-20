'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BTCTicker } from './BTCTicker';

export function NavBar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/basics', label: 'Basics' },
    { href: '/tour', label: 'Tour' },
    { href: '/playground', label: 'Playground' },
    { href: '/glossary', label: 'Glossary' },
    { href: '/myths', label: 'Myths' },
  ];

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation */}
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              BTC Visualizer
            </Link>
            <div className="flex gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <BTCTicker />
        </div>
      </div>
    </nav>
  );
}
