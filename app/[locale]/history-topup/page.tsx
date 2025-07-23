'use client'

import { getAuth } from 'firebase/auth';
import { collection, getDocs, getFirestore, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { app } from '../../../lib/firebase';
import { useRouter } from 'next/navigation';

interface TopupHistoryItem {
  id: string;
  amount: number;
  date: Date;
  paymentMethod: string;
}

export default function HistoryTopupPage() {
  const [history, setHistory] = useState<TopupHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      const auth = getAuth(app);
      const db = getFirestore(app);
      const user = auth.currentUser;
      if (!user) {
        router.push('/login');
        return;
      }
      const colRef = collection(db, 'users', user.uid, 'topupHistory');
      const snap = await getDocs(colRef);
      const items = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
        };
      });
      setHistory(items.sort((a, b) => b.date.getTime() - a.date.getTime()));
      setLoading(false);
    };
    fetchHistory();
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Riwayat Topup</h1>
      {loading ? (
        <div>Loading...</div>
      ) : history.length === 0 ? (
        <div className="text-gray-500">Belum ada riwayat topup.</div>
      ) : (
        <ul className="space-y-4">
          {history.map(item => (
            <li key={item.id} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold text-lg text-yellow-700">+{item.amount} Coin</div>
                <div className="text-xs text-gray-500">{item.date.toLocaleString('id-ID')}</div>
                <div className="text-xs text-gray-400">ID: {item.id}</div>
              </div>
              <div className="text-sm text-gray-700 mt-2 md:mt-0">Metode: {item.paymentMethod}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 