'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GovLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header untuk Dashboard Pemerintah */}
      <header className='fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b backdrop-blur-sm bg-white/95'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <h1 className='text-xl font-semibold text-gray-900'>
                SatuGizi Dashboard
              </h1>
              <span className='ml-2 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full'>
                Pemerintah
              </span>
            </div>

            <nav className='flex space-x-2'>
              <Link
                href='/gov/data-stunting'
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive('/gov/data-stunting')
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                }`}
              >
                <span className='relative z-10'>Data Stunting</span>
                {isActive('/gov/data-stunting') && (
                  <div className='absolute inset-0 bg-primary rounded-lg shadow-lg'></div>
                )}
              </Link>
              <Link
                href='/gov/menu-planner'
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive('/gov/menu-planner')
                    ? 'bg-third text-white shadow-md'
                    : 'text-gray-700 hover:text-third hover:bg-third/5'
                }`}
              >
                <span className='relative z-10'>Menu Planner</span>
                {isActive('/gov/menu-planner') && (
                  <div className='absolute inset-0 bg-third rounded-lg shadow-lg'></div>
                )}
              </Link>
            </nav>

            <div className='flex items-center space-x-4'>
              <div className='text-right'>
                <div className='text-sm font-medium text-gray-900'>
                  Admin (Pemerintah)
                </div>
                <div className='text-xs text-gray-500'>
                  admin1@satugizi.gov.id
                </div>
              </div>
              <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200'>
                <span className='text-white text-sm font-medium'>A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto pt-20 py-6 px-4 sm:px-6 lg:px-8'>
        {children}
      </main>
    </div>
  );
}
