import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu Planner - Dashboard Pemerintah | SatuGizi',
  description:
    'Perencanaan menu bergizi dengan parameter yang dapat disesuaikan untuk pemerintah',
};

export default function MenuPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
