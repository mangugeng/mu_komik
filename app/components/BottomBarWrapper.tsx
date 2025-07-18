'use client';

import { usePathname } from 'next/navigation';
import BottomBar from './BottomBar';

export default function BottomBarWrapper() {
  const pathname = usePathname();
  // Hide BottomBar on landing page, comic detail page, and creator profile pages
  const isLanding = pathname === '/';
  const isComicDetail = /^\/[a-zA-Z0-9]+$/.test(pathname) && !['/komik','/unggulan','/bacaanku','/profil','/videoKomik'].includes(pathname);
  const isCreatorProfile = pathname.startsWith('/creator/');
  
  if (isLanding || isComicDetail || isCreatorProfile) return null;
  return <BottomBar />;
} 