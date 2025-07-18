// Tambahkan ini di <Head> atau _document.js:
// <script src="https://sandbox.doku.com/scripts/snap/snap.js" data-client-key="YOUR_DOKU_CLIENT_KEY"></script>

import { useState } from 'react';

export default function DokuSnapButton({ amount, user, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    const res = await fetch('/api/doku/snap-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        name: user?.displayName || 'User Sandbox',
        email: user?.email || 'user@example.com',
      })
    });
    const data = await res.json();
    setLoading(false);
    if (data.token) {
      if (window.doku && window.doku.snap) {
        window.doku.snap.pay(data.token, {
          onSuccess: function(result){
            alert('Pembayaran sukses!');
            if (onSuccess) onSuccess(result);
          },
          onPending: function(){ alert('Menunggu pembayaran...'); },
          onError: function(){ alert('Pembayaran gagal!'); }
        });
      } else {
        alert('DOKU SNAP belum ter-load. Pastikan script SNAP sudah dipasang di <Head>.');
      }
    } else {
      alert('Gagal mendapatkan token pembayaran DOKU');
    }
  };

  return (
    <button onClick={handlePay} disabled={loading} style={{padding: '12px 24px', background: '#e11d48', color: 'white', borderRadius: 8, fontWeight: 'bold'}}>
      {loading ? 'Memproses...' : 'Bayar dengan DOKU SNAP'}
    </button>
  );
} 