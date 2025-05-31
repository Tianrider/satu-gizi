'use client';

import { useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const stuntingData = [
  { month: 'Jan 2023', prevalence: 21.6, target: 20.0 },
  { month: 'Feb 2023', prevalence: 21.2, target: 19.8 },
  { month: 'Mar 2023', prevalence: 20.8, target: 19.6 },
  { month: 'Apr 2023', prevalence: 20.5, target: 19.4 },
  { month: 'May 2023', prevalence: 20.1, target: 19.2 },
  { month: 'Jun 2023', prevalence: 19.8, target: 19.0 },
  { month: 'Jul 2023', prevalence: 19.5, target: 18.8 },
  { month: 'Aug 2023', prevalence: 19.2, target: 18.6 },
  { month: 'Sep 2023', prevalence: 18.9, target: 18.4 },
  { month: 'Oct 2023', prevalence: 18.6, target: 18.2 },
  { month: 'Nov 2023', prevalence: 18.3, target: 18.0 },
  { month: 'Dec 2023', prevalence: 18.0, target: 17.8 },
];

export default function DataStuntingPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
    script.async = true;

    script.onload = () => {
      // Handle first visualization (country-wide per province)
      const divElement1 = document.getElementById('viz1748679246694');
      if (divElement1) {
        const vizElement1 = divElement1.getElementsByTagName('object')[0];
        if (vizElement1) {
          vizElement1.style.width = '100%';
          vizElement1.style.height = '100%';
        }
      }

      // Handle second visualization (detailed regional)
      const divElement2 = document.getElementById('viz1748678592497');
      if (divElement2) {
        const vizElement2 = divElement2.getElementsByTagName('object')[0];
        if (vizElement2) {
          vizElement2.style.width = '100%';
          vizElement2.style.height = '100%';
        }
      }
    };

    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://public.tableau.com/javascripts/api/viz_v1.js"]'
      );
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className='space-y-6'>
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>Data Stunting</h1>
        <p className='text-gray-600'>
          Analisis dan visualisasi data stunting secara real-time
        </p>
      </div>

      <div className='bg-white rounded-lg shadow-sm p-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>
          Peta Prevalensi Stunting Per Provinsi (2018-2023)
        </h2>
        <div className='w-full h-[600px]'>
          <div
            className='tableauPlaceholder'
            id='viz1748679246694'
            style={{ position: 'relative', width: '100%', height: '100%' }}
          >
            <noscript>
              <a href='#'>
                <img
                  alt='D Peta Stunting Prov'
                  src='https://public.tableau.com/static/images/Pe/PetaPrevalensiStuntingPer-Provinsi2018-2023/DPetaStuntingProv/1_rss.png'
                  style={{
                    border: 'none',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </a>
            </noscript>
            <object
              className='tableauViz'
              style={{ display: 'none', width: '100%', height: '100%' }}
            >
              <param
                name='host_url'
                value='https://public.tableau.com/'
              />
              <param
                name='embed_code_version'
                value='3'
              />
              <param
                name='site_root'
                value=''
              />
              <param
                name='name'
                value='PetaPrevalensiStuntingPer-Provinsi2018-2023/DPetaStuntingProv'
              />
              <param
                name='tabs'
                value='no'
              />
              <param
                name='toolbar'
                value='yes'
              />
              <param
                name='static_image'
                value='https://public.tableau.com/static/images/Pe/PetaPrevalensiStuntingPer-Provinsi2018-2023/DPetaStuntingProv/1.png'
              />
              <param
                name='animate_transition'
                value='yes'
              />
              <param
                name='display_static_image'
                value='yes'
              />
              <param
                name='display_spinner'
                value='yes'
              />
              <param
                name='display_overlay'
                value='yes'
              />
              <param
                name='display_count'
                value='yes'
              />
              <param
                name='language'
                value='en-US'
              />
            </object>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-sm p-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>
          Peta Prevalensi Stunting Indonesia (Detail Regional)
        </h2>
        <div className='w-full h-[600px]'>
          <div
            className='tableauPlaceholder'
            id='viz1748678592497'
            style={{ position: 'relative', width: '100%', height: '100%' }}
          >
            <noscript>
              <a href='#'>
                <img
                  alt='DB ALL'
                  src='https://public.tableau.com/static/images/Z7/Z77FJ8292/1_rss.png'
                  style={{
                    border: 'none',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </a>
            </noscript>
            <object
              className='tableauViz'
              style={{ display: 'none', width: '100%', height: '100%' }}
            >
              <param
                name='host_url'
                value='https://public.tableau.com/'
              />
              <param
                name='embed_code_version'
                value='3'
              />
              <param
                name='path'
                value='shared/Z77FJ8292'
              />
              <param
                name='toolbar'
                value='no'
              />
              <param
                name='static_image'
                value='https://public.tableau.com/static/images/Z7/Z77FJ8292/1.png'
              />
              <param
                name='animate_transition'
                value='yes'
              />
              <param
                name='display_static_image'
                value='yes'
              />
              <param
                name='display_spinner'
                value='yes'
              />
              <param
                name='display_overlay'
                value='yes'
              />
              <param
                name='display_count'
                value='yes'
              />
              <param
                name='language'
                value='en-US'
              />
            </object>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-sm p-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>
          Tren Prevalensi Stunting Nasional
        </h2>
        <div className='w-full h-96'>
          <ResponsiveContainer
            width='100%'
            height='100%'
          >
            <LineChart data={stuntingData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='month'
                angle={-45}
                textAnchor='end'
                height={80}
              />
              <YAxis
                label={{
                  value: 'Prevalensi (%)',
                  angle: -90,
                  position: 'insideLeft',
                }}
                domain={[15, 25]}
              />
              <Tooltip
                formatter={(value, name) => [
                  `${value}%`,
                  name === 'prevalence'
                    ? 'Prevalensi Aktual'
                    : 'Target Pemerintah',
                ]}
              />
              <Legend />
              <Line
                type='monotone'
                dataKey='prevalence'
                stroke='#ef4444'
                strokeWidth={3}
                name='Prevalensi Aktual'
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              />
              <Line
                type='monotone'
                dataKey='target'
                stroke='#22c55e'
                strokeWidth={2}
                strokeDasharray='5 5'
                name='Target Pemerintah'
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className='mt-4 text-sm text-gray-600'>
          <p>
            Data menunjukkan tren penurunan prevalensi stunting dari 21.6% pada
            Januari 2023 menjadi 18.0% pada Desember 2023. Target pemerintah
            untuk mencapai 17.8% hampir tercapai.
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h3 className='text-sm font-medium text-gray-500'>
            Prevalensi Saat Ini
          </h3>
          <p className='text-2xl font-bold text-red-600'>18.0%</p>
          <p className='text-xs text-gray-500'>Desember 2023</p>
        </div>

        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h3 className='text-sm font-medium text-gray-500'>
            Target Pemerintah
          </h3>
          <p className='text-2xl font-bold text-green-600'>17.8%</p>
          <p className='text-xs text-gray-500'>Target akhir 2023</p>
        </div>

        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h3 className='text-sm font-medium text-gray-500'>Penurunan YoY</h3>
          <p className='text-2xl font-bold text-blue-600'>-3.6%</p>
          <p className='text-xs text-gray-500'>Dibanding 2022</p>
        </div>
      </div>
    </div>
  );
}
