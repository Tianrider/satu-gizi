/* eslint-disable @next/next/no-img-element */
'use client';
import { IconDownload, IconSearch } from '@tabler/icons-react';
import Sidebar from '@/components/Sidebar';
import { Table, Tab, TabList, Tabs, TabPanel, tabClasses } from '@mui/joy';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import lineChartData from './data/lineChartData';
import LineChart from '@/components/LineChart';
// import dummyTableData from './data/dummyTableData';
import CustomTable from '@/components/CustomTable';
import { db } from './utils/firebase/firebase';
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useProfileState } from '@/stores/globalState';
import { useSearchParams } from 'next/navigation';

export interface TempatTinggal {
	provinsi: string;
	kota: string;
}

export interface ProfileData {
	scanned?: boolean;
	tempatTinggal?: TempatTinggal;
	akg?: number;
	jenisKelamin?: string;
	nama?: string;
	nik?: string;
	tanggalLahir?: string;
	umur?: number;
	tanggal?: string;
	waktu?: string;
	menu?: string;
}

export default function Home() {
	const [dummyTableData, setDummyTableData] = useState<ProfileData[]>([]);
	const { profileIndex, setProfileIndex } = useProfileState();

	// Search params
	const searchParams = useSearchParams();
	const isSetProfile1 = searchParams.get('p1') === 'true';

	useEffect(() => {
		if (isSetProfile1) {
			setProfileIndex(1);
		}
	}, [isSetProfile1, setProfileIndex]);

	useEffect(() => {
		const fetchData = async () => {
			// If the profileIndex is 1 (NTT), then empty the table data
			if (profileIndex == 1) {
				// Empty the table data
				setDummyTableData([]);
				return;
			}
			
			const q = query(collection(db, 'profiles'), where('scanned', '==', true));

			const qSnapShot = await getDocs(q);

			const data: ProfileData[] = []; // Declare the array with ProfileData type

			qSnapShot.forEach((doc) => {
				const profileData = doc.data() as ProfileData; // Cast doc.data() to ProfileData type
				data.push(profileData);
			});

			console.log(data);

			setDummyTableData(data);
		};

		fetchData();
	}, [profileIndex]);

	return (
		<div className="flex h-full w-full flex-row bg-white">
			<Sidebar location="/" />

			{/* Main content */}
			<div className="md:ml-60 flex h-full w-full flex-col space-y-6 px-10 py-8">
				<div className="flex w-full flex-row items-center justify-between">
					<p className="text-lg font-semibold text-custgray1">
						Selamat datang, Admin <span className="font-bold text-custblue">{profileIndex == 0 ? 'Jawa Barat' : 'Nusa Tenggara Timur'}</span> 👋🏻
					</p>
					<button className="flex flex-row items-center rounded-md bg-custblue px-3 py-[6px] pr-3 text-sm font-semibold text-white hover:bg-[#3156a3] active:bg-[#1f3e7d]">
						<IconDownload
							size={16}
							stroke={2.5}
							className="mr-2"
						/>
						<p>Download PDF</p>
					</button>
				</div>

				<div className="flex w-full flex-row items-center justify-between">
					<p className="text-3xl font-bold">Hasil Scan</p>
					<p className="text-sm text-custgray1">Last updated: 12/11/2024 - 13.30 WIB</p>
				</div>

				<Tabs
					aria-label="tabs"
					defaultValue={0}
					sx={{ bgcolor: 'transparent' }}
				>
					<div className="flex w-full justify-center"></div>
					<TabList
						disableUnderline
						sx={{
							p: 0.5,
							gap: 0.5,
							borderRadius: 'xl',
							bgcolor: 'background.level1',
							justifyContent: 'center',
							width: 'fit-content',
							boxShadow: 'sm',
							[`& .${tabClasses.root}[aria-selected="true"]`]: {
								boxShadow: 'sm',
								bgcolor: 'background.surface',
							},
						}}
					>
						<Tab disableIndicator>Tab Utama</Tab>
						<Tab disableIndicator>Tab Grafik</Tab>
						<Tab disableIndicator>Tab Tabel</Tab>
					</TabList>

					<TabPanel
						// Tab Utama
						value={0}
						sx={{
							p: 0,
							pt: 3,
						}}
					>
						<div className="mb-8 h-[400px] w-full">
							<LineChart
								lineChartData={lineChartData}
								height="400px"
							/>
						</div>

						<CustomTable data={dummyTableData} />
					</TabPanel>

					<TabPanel
						// Tab Grafik
						value={1}
						sx={{
							p: 0,
							pt: 3,
						}}
					>
						<LineChart lineChartData={lineChartData} height='500px' />
					</TabPanel>

					<TabPanel
						// Tab Tabel
						value={2}
						sx={{
							p: 0,
							pt: 3,
						}}
					>
						<CustomTable data={dummyTableData} />
					</TabPanel>
				</Tabs>
			</div>
		</div>
	);
}
