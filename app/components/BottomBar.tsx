'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Star, Video, User as UserIcon, LogIn } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../../lib/firebase';
import { useParams } from 'next/navigation';

export default function BottomBar() {
  const pathname = usePathname();
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const locale = params?.locale as string || 'id';
  
  // Translation function
  const t = (key: string) => {
    const translations = {
      id: {
        'comics': 'Komik',
        'videoComics': 'Video Komik',
        'favorites': 'Unggulan',
        'readingList': 'Bacaanku',
        'profile': 'Profil',
        'login': 'Masuk'
      },
      en: {
        'comics': 'Comics',
        'videoComics': 'Video Comics',
        'favorites': 'Featured',
        'readingList': 'My Reads',
        'profile': 'Profile',
        'login': 'Login'
      }
    };
    
    const localeTranslations = translations[locale as keyof typeof translations];
    return localeTranslations?.[key as keyof typeof localeTranslations] || translations.id[key as keyof typeof translations.id] || key;
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const isActive = (path: string) => {
    const pathWithoutLocale = path.replace(`/${locale}`, '');
    if (pathWithoutLocale === '/komik') {
      return pathname.includes('/komik');
    }
    return pathname.includes(pathWithoutLocale);
  };

  const navItems = [
    { href: `/${locale}/komik`, label: t('comics'), icon: BookOpen },
    { href: `/${locale}/videoKomik`, label: t('videoComics'), icon: Video },
    { href: `/${locale}/unggulan`, label: t('favorites'), icon: Star },
    { href: `/${locale}/bacaanku`, label: t('readingList'), icon: BookOpen },
    user
      ? { href: `/${locale}/profil`, label: t('profile'), icon: UserIcon }
      : { href: `/${locale}/login`, label: t('login'), icon: LogIn },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full ${
                  active ? 'text-blue-500' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
} 