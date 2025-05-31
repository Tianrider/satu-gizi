'use client';

import { useState } from 'react';
import Marquee from 'react-fast-marquee';
import Image from 'next/image';
import { sendHelloRequest } from './azure-openai';

export default function MenuPlannerPage() {
  const [budget, setBudget] = useState(12000);
  const [carbs, setCarbs] = useState(55);
  const [protein, setProtein] = useState(20);
  const [fat, setFat] = useState(25);
  const [distance, setDistance] = useState(50);
  const [season, setSeason] = useState('hujan');
  const [currentMonth, setCurrentMonth] = useState('Januari');
  const [currentProvince, setCurrentProvince] = useState('Jawa Barat');
  const [isGenerating, setIsGenerating] = useState(false);
  const [testResponse, setTestResponse] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const provinces = [
    'Aceh',
    'Sumatera Utara',
    'Sumatera Barat',
    'Riau',
    'Jambi',
    'Sumatera Selatan',
    'Bengkulu',
    'Lampung',
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Tengah',
    'DI Yogyakarta',
    'Jawa Timur',
    'Banten',
    'Bali',
    'Nusa Tenggara Barat',
    'Nusa Tenggara Timur',
    'Kalimantan Barat',
    'Kalimantan Tengah',
    'Kalimantan Selatan',
    'Kalimantan Timur',
    'Kalimantan Utara',
    'Sulawesi Utara',
    'Sulawesi Tengah',
    'Sulawesi Selatan',
    'Sulawesi Tenggara',
    'Gorontalo',
    'Sulawesi Barat',
    'Maluku',
    'Maluku Utara',
    'Papua',
    'Papua Barat',
    'Papua Selatan',
    'Papua Tengah',
    'Papua Pegunungan',
  ];

  const foodImages = Array.from(
    { length: 11 },
    (_, i) => `/food-image/food-image-${i + 1}.jpg`
  );

  const generateMenu = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  const testAzureOpenAI = async () => {
    setIsTesting(true);
    setTestResponse('');
    try {
      const response = await sendHelloRequest();
      setTestResponse(response);
    } catch (error) {
      setTestResponse(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
    setIsTesting(false);
  };

  const getMenuForDate = (date: number) => {
    const menus = [
      'Nasi + Ayam Bumbu',
      'Nasi + Ikan Bakar',
      'Nasi + Tempe Goreng',
      'Nasi + Telur Dadar',
      'Nasi + Daging Sapi',
      'Nasi + Tahu Isi',
    ];
    return menus[date % menus.length];
  };

  const getPriceForDate = (date: number) => {
    const basePrice = budget;
    const variation = Math.floor(Math.random() * 3000) - 1500;
    return Math.max(5000, basePrice + variation);
  };

  const totalBudget = budget * 31;
  const averageCalories = Math.floor(1800 + (budget - 5000) / 100);

  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <div className='space-y-8'>
      <div className='rounded-lg p-8 flex flex-col justify-center items-center w-full'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4 text-center'>
          Menu Planner
        </h1>
        <div
          className='w-[12rem] h-3 mb-6'
          style={{ background: 'linear-gradient(to right, #02B5AC, #D2DD25)' }}
        />

        <div className='w-full mt-4 -mb-2'>
          <Marquee
            speed={40}
            gradient={true}
            gradientColor='#F9FAFB'
            gradientWidth={100}
          >
            {foodImages.map((image, index) => (
              <div
                key={index}
                className='mx-3'
              >
                <Image
                  src={image}
                  alt={`Food ${index + 1}`}
                  width={160}
                  height={120}
                  className='rounded-lg object-cover shadow-md'
                />
              </div>
            ))}
          </Marquee>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-lg p-8'>
        <h2 className='text-2xl font-semibold text-gray-900 mb-6'>
          Azure OpenAI Test
        </h2>
        <div className='flex items-center space-x-4 mb-4'>
          <button
            onClick={testAzureOpenAI}
            disabled={isTesting}
            className='bg-blue-600 text-white px-6 py-3 text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isTesting ? 'Testing...' : 'Test Hello Request'}
          </button>
        </div>
        {testResponse && (
          <div className='bg-gray-50 p-4 rounded-lg border'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Response:
            </h3>
            <p className='text-gray-700 whitespace-pre-wrap'>{testResponse}</p>
          </div>
        )}
      </div>

      <div className='bg-white rounded-lg shadow-lg p-8'>
        <h2 className='text-2xl font-semibold text-gray-900 mb-6'>
          Parameter Kontrol
        </h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='space-y-4'>
            <label className='block text-lg font-medium text-gray-700'>
              Anggaran per Porsi
            </label>
            <div className='flex items-center space-x-6'>
              <span className='text-base text-gray-600 font-medium'>
                Rp 5,000
              </span>
              <input
                type='range'
                min='5000'
                max='25000'
                step='1000'
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className='flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer'
              />
              <span className='text-base text-gray-600 font-medium'>
                Rp 25,000
              </span>
            </div>
            <div className='text-center bg-primary/10 p-3 rounded-lg'>
              <span className='text-2xl font-bold text-primary'>
                Rp {formatCurrency(budget)}
              </span>
            </div>
          </div>

          <div className='space-y-4'>
            <label className='block text-lg font-medium text-gray-700'>
              Target Makronutrien (% per hari)
            </label>
            <div className='space-y-4'>
              <div>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-base font-medium'>Karbohidrat</span>
                  <span className='text-base font-semibold text-primary'>
                    {carbs}%
                  </span>
                </div>
                <input
                  type='range'
                  min='45'
                  max='65'
                  value={carbs}
                  onChange={(e) => setCarbs(Number(e.target.value))}
                  className='w-full h-3 bg-gray-200 rounded-lg'
                />
              </div>

              <div>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-base font-medium'>Protein</span>
                  <span className='text-base font-semibold text-primary'>
                    {protein}%
                  </span>
                </div>
                <input
                  type='range'
                  min='15'
                  max='30'
                  value={protein}
                  onChange={(e) => setProtein(Number(e.target.value))}
                  className='w-full h-3 bg-gray-200 rounded-lg'
                />
              </div>

              <div>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-base font-medium'>Lemak</span>
                  <span className='text-base font-semibold text-primary'>
                    {fat}%
                  </span>
                </div>
                <input
                  type='range'
                  min='20'
                  max='35'
                  value={fat}
                  onChange={(e) => setFat(Number(e.target.value))}
                  className='w-full h-3 bg-gray-200 rounded-lg'
                />
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <label className='block text-lg font-medium text-gray-700'>
              Jarak Distribusi Maksimal
            </label>
            <div className='flex items-center space-x-6'>
              <span className='text-base text-gray-600 font-medium'>10 km</span>
              <input
                type='range'
                min='10'
                max='100'
                step='5'
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className='flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer'
              />
              <span className='text-base text-gray-600 font-medium'>
                100 km
              </span>
            </div>
            <div className='text-center bg-third/10 p-3 rounded-lg'>
              <span className='text-2xl font-bold text-third'>
                {distance} km
              </span>
            </div>
          </div>

          <div className='space-y-4'>
            <label className='block text-lg font-medium text-gray-700'>
              Ketersediaan Musiman
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className='w-full p-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
            >
              <option value='hujan'>Musim Hujan (Nov - Mar)</option>
              <option value='kemarau'>Musim Kemarau (Apr - Oct)</option>
              <option value='sepanjang'>Sepanjang Tahun</option>
            </select>
            <div className='text-sm text-gray-600 bg-gray-50 p-3 rounded-lg'>
              *Berdasarkan data satelit dan forecast panen
            </div>
          </div>
        </div>

        <div className='mt-8 flex justify-between items-center'>
          <div className='flex items-center space-x-8 bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg border border-gray-200'>
            <div className='flex items-center space-x-3'>
              <label className='text-lg font-semibold text-gray-800'>
                Province:
              </label>
              <select
                value={currentProvince}
                onChange={(e) => setCurrentProvince(e.target.value)}
                className='p-3 text-base border-2 border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white shadow-sm font-medium'
              >
                {provinces.map((province) => (
                  <option
                    key={province}
                    value={province}
                  >
                    {province}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex items-center space-x-3'>
              <label className='text-lg font-semibold text-gray-800'>
                Bulan:
              </label>
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(e.target.value)}
                className='p-3 text-base border-2 border-secondary/30 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary bg-white shadow-sm font-medium'
              >
                {months.map((month) => (
                  <option
                    key={month}
                    value={month}
                  >
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={generateMenu}
            disabled={isGenerating}
            className='bg-primary text-white px-8 py-4 text-lg font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isGenerating ? 'Generating...' : 'Generate Menu Bulanan'}
          </button>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-lg p-8'>
        <h2 className='text-2xl font-semibold text-gray-900 mb-6'>
          Preview Menu {currentMonth} 2025
        </h2>

        <div className='grid grid-cols-7 gap-3'>
          {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
            <div
              key={day}
              className='p-4 text-center text-lg font-semibold text-gray-600 bg-gray-100 rounded-lg'
            >
              {day}
            </div>
          ))}

          {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
            <div
              key={date}
              className='p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'
            >
              <div className='text-lg font-bold text-gray-900 mb-2'>{date}</div>
              <div className='text-base text-gray-700 mb-3 leading-tight'>
                {getMenuForDate(date)}
              </div>
              <div className='bg-red-600 text-white px-3 py-1 rounded-md text-base font-bold text-center'>
                Rp {formatCurrency(getPriceForDate(date))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-lg shadow-lg p-8 text-center'>
          <h3 className='text-lg font-medium text-gray-600 mb-2'>
            Total Anggaran Bulanan
          </h3>
          <p className='text-4xl font-bold text-primary mb-2'>
            Rp {formatCurrency(totalBudget)}
          </p>
          <p className='text-base text-gray-600'>Per anak per bulan</p>
        </div>

        <div className='bg-white rounded-lg shadow-lg p-8 text-center'>
          <h3 className='text-lg font-medium text-gray-600 mb-2'>
            Rata-rata Kalori
          </h3>
          <p className='text-4xl font-bold text-third mb-2'>
            {formatCurrency(averageCalories)} kcal
          </p>
          <p className='text-base text-gray-600'>
            Sesuai AKG anak usia 7-9 tahun
          </p>
        </div>

        <div className='bg-white rounded-lg shadow-lg p-8 text-center'>
          <h3 className='text-lg font-medium text-gray-600 mb-2'>
            Vendor Terlibat
          </h3>
          <p className='text-4xl font-bold text-secondary mb-2'>12 vendor</p>
          <p className='text-base text-gray-600'>Dengan rating keamanan A</p>
        </div>
      </div>
    </div>
  );
}
