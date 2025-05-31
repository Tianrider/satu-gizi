import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard Pemerintah - SatuGizi',
  description:
    'Dashboard untuk perencanaan menu bergizi dan analisis data stunting real-time',
};

export default function GovLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header untuk Dashboard Pemerintah */}
      <header className='bg-white shadow-sm border-b'>
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

            <nav className='flex space-x-8'>
              <Link
                href='/gov/data-stunting'
                className='text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium'
              >
                Data Stunting
              </Link>
              <Link
                href='/gov/menu-planner'
                className='text-gray-700 hover:text-third px-3 py-2 text-sm font-medium'
              >
                Menu Planner
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
              <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
                <span className='text-white text-sm font-medium'>A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
        {children}
      </main>
    </div>
  );
}
