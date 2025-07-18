'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Star, Video, User as UserIcon, LogIn } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../../lib/firebase';

export default function BottomBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const isActive = (path: string) => {
    if (path === '/komik') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    { href: '/komik', label: 'Komik', icon: BookOpen },
    { href: '/videoKomik', label: 'Video', icon: Video },
    { href: '/unggulan', label: 'Unggulan', icon: Star },
    { href: '/bacaanku', label: 'Bacaanku', icon: BookOpen },
    user
      ? { href: '/profil', label: 'Profil', icon: UserIcon }
      : { href: '/login', label: 'Login', icon: LogIn },
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