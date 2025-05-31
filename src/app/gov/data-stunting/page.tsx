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

const provincialStuntingData = [
  { province: 'PAPUA TENGAH', rate: 39.4 },
  { province: 'NUSA TENGGARA TIMUR', rate: 37.9 },
  { province: 'PAPUA PEGUNUNGAN', rate: 37.3 },
  { province: 'PAPUA BARAT DAYA', rate: 31.0 },
  { province: 'SULAWESI BARAT', rate: 30.3 },
  { province: 'SULAWESI TENGGARA', rate: 30.0 },
  { province: 'ACEH', rate: 29.4 },
  { province: 'PAPUA', rate: 28.6 },
  { province: 'MALUKU', rate: 28.4 },
  { province: 'SULAWESI SELATAN', rate: 27.4 },
  { province: 'SULAWESI TENGAH', rate: 27.2 },
  { province: 'GORONTALO', rate: 26.9 },
  { province: 'PAPUA SELATAN', rate: 25.0 },
  { province: 'PAPUA BARAT', rate: 24.8 },
  { province: 'KALIMANTAN SELATAN', rate: 24.7 },
  { province: 'NUSA TENGGARA BARAT', rate: 24.6 },
  { province: 'KALIMANTAN BARAT', rate: 24.5 },
  { province: 'BANTEN', rate: 24.0 },
  { province: 'MALUKU UTARA', rate: 23.7 },
  { province: 'SUMATERA BARAT', rate: 23.6 },
  { province: 'KALIMANTAN TENGAH', rate: 23.5 },
  { province: 'KALIMANTAN TIMUR', rate: 22.9 },
  { province: 'JAWA BARAT', rate: 21.7 },
  { province: 'SULAWESI UTARA', rate: 21.3 },
  { province: 'JAWA TENGAH', rate: 20.7 },
  { province: 'KEPULAUAN BANGKA BELITUNG', rate: 20.6 },
  { province: 'SUMATERA SELATAN', rate: 20.3 },
  { province: 'BENGKULU', rate: 20.2 },
  { province: 'SUMATERA UTARA', rate: 18.9 },
  { province: 'DAERAH ISTIMEWA YOGYAKARTA', rate: 18.0 },
  { province: 'JAWA TIMUR', rate: 17.7 },
  { province: 'DKI JAKARTA', rate: 17.6 },
  { province: 'KALIMANTAN UTARA', rate: 17.4 },
  { province: 'KEPULAUAN RIAU', rate: 16.8 },
  { province: 'LAMPUNG', rate: 14.9 },
  { province: 'RIAU', rate: 13.6 },
  { province: 'JAMBI', rate: 13.5 },
  { province: 'BALI', rate: 7.2 },
];

const getBarColor = (rate: number) => {
  if (rate >= 30) return 'bg-red-500';
  if (rate >= 18) return 'bg-yellow-500';
  return 'bg-green-500';
};

const getTextColor = (rate: number) => {
  if (rate >= 30) return 'text-red-700';
  if (rate >= 18) return 'text-yellow-700';
  return 'text-green-700';
};

export default function DataStuntingPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
    script.async = true;

    script.onload = () => {
      // Handle first visualization (country-wide per province map)
      const divElement1 = document.getElementById('viz1748679246694');
      if (divElement1) {
        const vizElement1 = divElement1.getElementsByTagName('object')[0];
        if (vizElement1) {
          vizElement1.style.width = '100%';
          vizElement1.style.height = '100%';
        }
      }

      // Handle second visualization (district/city level)
      const divElement2 = document.getElementById('viz1748681242886');
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
      <div className='rounded-lg p-8 flex flex-col justify-center items-center w-full'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4 text-center'>
          Data Stunting
        </h1>
        <div
          className='w-[12rem] h-3'
          style={{ background: 'linear-gradient(to right, #D50B8B, #02B5AC)' }}
        />
      </div>

      <div className='bg-white rounded-lg shadow-sm p-6 pb-14'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
          Data Stunting Per Provinsi (2018-2023)
        </h2>
        <div className='flex gap-4 h-[600px]'>
          <div className='w-3/4'>
            <h3 className='text-md font-medium text-gray-700 mb-2'>
              Peta Prevalensi Stunting
            </h3>
            <div className='w-full h-full'>
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

          <div className='w-1/4'>
            <h3 className='text-md font-medium text-gray-700 mb-2'>
              Prevalensi per Provinsi (%)
            </h3>
            <div className='w-full h-full overflow-y-auto bg-gray-50 rounded-lg p-2'>
              <div className='space-y-1'>
                {provincialStuntingData.map((item, index) => {
                  const maxRate = Math.max(
                    ...provincialStuntingData.map((p) => p.rate)
                  );
                  const barWidth = (item.rate / maxRate) * 100;

                  return (
                    <div
                      key={index}
                      className='mb-2'
                    >
                      <div className='flex justify-between items-center mb-1'>
                        <span
                          className='text-xs font-medium text-gray-700 truncate'
                          title={item.province}
                        >
                          {item.province.length > 15
                            ? `${item.province.substring(0, 15)}...`
                            : item.province}
                        </span>
                        <span
                          className={`text-xs font-bold ${getTextColor(
                            item.rate
                          )}`}
                        >
                          {item.rate}%
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getBarColor(
                            item.rate
                          )}`}
                          style={{ width: `${barWidth}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className='mt-4 text-xs text-gray-600 border-t pt-2'>
                <div className='flex items-center gap-2 mb-1'>
                  <div className='w-3 h-2 bg-red-500 rounded'></div>
                  <span>≥30% (Tinggi)</span>
                </div>
                <div className='flex items-center gap-2 mb-1'>
                  <div className='w-3 h-2 bg-yellow-500 rounded'></div>
                  <span>18-29% (Sedang)</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-2 bg-green-500 rounded'></div>
                  <span>&lt;18% (Rendah)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-sm p-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
          Peta Prevalensi Stunting Kabupaten/Kota 2023
        </h2>
        <div className='w-full h-[600px]'>
          <div
            className='tableauPlaceholder'
            id='viz1748681242886'
            style={{ position: 'relative', width: '100%', height: '100%' }}
          >
            <noscript>
              <a href='#'>
                <img
                  alt='D Stunting'
                  src='https://public.tableau.com/static/images/Pe/PetaprevalensistuntingKabupatenKota2023/DStunting/1_rss.png'
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
                value='PetaprevalensistuntingKabupatenKota2023/DStunting'
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
                value='https://public.tableau.com/static/images/Pe/PetaprevalensistuntingKabupatenKota2023/DStunting/1.png'
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
