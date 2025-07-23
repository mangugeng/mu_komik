import { notFound } from 'next/navigation';
import { locales } from '../../i18n';
import BottomBarWrapper from '../components/BottomBarWrapper';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as typeof locales[number])) {
    notFound();
  }

  return (
    <>
      {children}
      <BottomBarWrapper />
    </>
  );
} 