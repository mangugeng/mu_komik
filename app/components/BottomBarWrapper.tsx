'use client';

import { usePathname } from 'next/navigation';
import BottomBar from './BottomBar';

export default function BottomBarWrapper() {
  const pathname = usePathname();
  // Hide BottomBar on landing page, comic detail page, and creator profile pages
  const isLanding = pathname === '/' || pathname === '/id' || pathname === '/en';
  const isComicDetail = /^\/(id|en)\/[a-zA-Z0-9]+$/.test(pathname) && !['/komik','/unggulan','/bacaanku','/profil','/videoKomik'].some(path => pathname.includes(path));
  const isCreatorProfile = pathname.includes('/creator/');
  const isChapterPage = pathname.includes('/chapter/');
  
  if (isLanding || isComicDetail || isCreatorProfile || isChapterPage) return null;
  return <BottomBar />;
} 