import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Stunting - Dashboard Pemerintah | SatuGizi',
  description:
    'Dashboard analisis dan visualisasi data stunting secara real-time untuk pemerintah',
};

export default function DataStuntingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
