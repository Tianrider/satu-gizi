'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/app/shared/navbar';

export default function FoodResultPage() {
  const router = useRouter();
  const [isComicModalOpen, setIsComicModalOpen] = useState(false);

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-400 to-white'>
      {/* Header */}
      <div className='px-4 py-6 text-white'>
        <button
          onClick={() => router.back()}
          className='mb-4'
        >
          <ArrowLeft className='h-6 w-6' />
        </button>
        <h1 className='text-xl font-bold mb-2'>
          Hai, makanan bergizimu sudah siap disajikan!
        </h1>
        <p className='text-sm opacity-90'>
          Silakan dinikmati, pilihanmu mendukung pertumbuhan yang sehat!
        </p>
      </div>

      {/* Content */}
      <div className='px-4 pb-24 space-y-6'>
        {/* Food Card with background image */}
        <div className='flex flex-col w-full'>
          <div className='relative rounded-lg shadow-lg overflow-hidden h-48'>
            <Image
              src='/food-image/food-image-1.jpg'
              alt='Nasi Ayam Goreng Sayur'
              fill
              className='object-cover'
            />
            {/* Overlay gradient */}
            <div className='absolute inset-0 bg-gradient-to-b from-teal-500/90 to-transparent'></div>
            {/* Text content */}
            <div className='absolute inset-0 p-6 flex flex-col text-white'>
              <h2 className='text-lg font-bold mb-2'>
                Makanan aman dan sesuai kebutuhan gizi!
              </h2>
            </div>
          </div>

          {/* Food Details */}
          <div className='bg-white rounded-b-lg -mt-2 shadow-lg p-4'>
            <h3 className='text-xl font-bold text-gray-800'>
              Nasi Ayam Goreng Sayur
            </h3>
            <div className='text-sm text-gray-600'>
              <p>
                Nasi: 300 gr, Ayam (dada): 150 gr, Buncis: 50 gr, Wortel: 100
                gr, Susu: 250 ml, Jeruk: 50 gr
              </p>
            </div>
          </div>
        </div>

        {/* Analysis Section */}
        <div className='bg-white rounded-lg shadow-lg p-6'>
          <h3 className='text-lg font-bold text-gray-800 mb-6'>
            Analisis Konsumsi
          </h3>

          <div className='grid grid-cols-2 gap-6'>
            {/* AKG Terpenuhi */}
            <div className='text-center'>
              <div className='relative w-20 h-20 mx-auto mb-3'>
                <svg
                  className='w-20 h-20 transform -rotate-90'
                  viewBox='0 0 36 36'
                >
                  <path
                    d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                    fill='none'
                    stroke='#e5e7eb'
                    strokeWidth='3'
                  />
                  <path
                    d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                    fill='none'
                    stroke='#10b981'
                    strokeWidth='3'
                    strokeDasharray='75, 100'
                  />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='text-2xl font-bold text-green-600'>75%</span>
                </div>
              </div>
              <p className='text-sm font-semibold text-gray-800'>
                AKG Terpenuhi
              </p>
              <p className='text-xs text-gray-500'>Lihat Lebih</p>
            </div>

            {/* Nutrisi Meningkat */}
            <div className='text-center'>
              <div className='relative w-20 h-20 mx-auto mb-3'>
                <svg
                  className='w-20 h-20 transform -rotate-90'
                  viewBox='0 0 36 36'
                >
                  <path
                    d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                    fill='none'
                    stroke='#e5e7eb'
                    strokeWidth='3'
                  />
                  <path
                    d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                    fill='none'
                    stroke='#fbbf24'
                    strokeWidth='3'
                    strokeDasharray='60, 100'
                  />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='text-2xl font-bold text-yellow-500'>
                    60%
                  </span>
                </div>
              </div>
              <p className='text-sm font-semibold text-gray-800'>
                Nutrisi Meningkat
              </p>
              <p className='text-xs text-gray-500'>Lihat Lebih</p>
            </div>
          </div>

          <div className='mt-6 text-xs text-gray-600'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='font-medium'>
                  Menu ini memberikan energi yang tinggi untuk aktivitas anak
                  sehari-hari, terisi nutrisi lengkap untuk berperan asupan yang
                  optimal.
                </p>
              </div>
              <div>
                <p className='font-medium'>
                  Adanya dari nutrisi kalsium dari susu maupun protein untuk
                  membantu pertumbuhan anak yang optimal untuk tumbuh kembang
                  anak.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comic Story Visual Modal Here */}
        <div className='bg-white rounded-lg shadow-lg p-6'>
          <h3 className='text-lg font-bold text-gray-800 mb-4'>
            Cerita Edukatif
          </h3>

          <div
            className='relative rounded-lg p-4 h-32 overflow-hidden shadow-md'
            style={{
              backgroundImage: 'url(/comic/comic-1.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className='absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 rounded-lg'></div>

            <div className='relative z-10 h-full flex flex-col justify-between text-white'>
              <div>
                <h4 className='text-sm font-bold mb-1'>
                  Prajurit Nutrisi: Penyelamat Tubuh Rina
                </h4>
                <p className='text-xs opacity-90 mb-2'>
                  Cerita seru tentang petualangan nutrisi dalam tubuh
                </p>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-xs font-medium bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm'>
                  2 Halaman
                </span>
                <button
                  onClick={() => setIsComicModalOpen(true)}
                  className='bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full transition-colors shadow-lg'
                >
                  Baca Cerita
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comic Story Modal */}
      {isComicModalOpen && (
        <div className='fixed inset-0 !z-[100] flex items-center justify-center'>
          <div
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            onClick={() => setIsComicModalOpen(false)}
          ></div>

          <div className='relative z-10 w-full max-w-md mx-4 max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden'>
            <button
              onClick={() => setIsComicModalOpen(false)}
              className='absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors'
            >
              <X className='h-5 w-5' />
            </button>

            <div className='overflow-y-auto max-h-[90vh]'>
              <div className='relative'>
                <Image
                  src='/comic/comic-1.png'
                  alt='Comic Page 1'
                  width={400}
                  height={600}
                  className='w-full h-auto'
                />
              </div>

              <div className='relative'>
                <Image
                  src='/comic/comic-2.png'
                  alt='Comic Page 2'
                  width={400}
                  height={600}
                  className='w-full h-auto'
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}
