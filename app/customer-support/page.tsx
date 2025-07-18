'use client'

import Link from 'next/link';
import { useState } from 'react';

export default function CustomerSupportPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-black flex flex-col items-center justify-center text-white w-full px-4 py-12">
      <div className="w-full max-w-lg mx-auto bg-black/80 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Customer Support</h1>
        <p className="text-center text-white/70 mb-6">Ada pertanyaan, kendala, atau butuh bantuan? Hubungi kami melalui form di bawah atau kontak langsung via WhatsApp/email.</p>
        <div className="flex flex-col gap-3 mb-6">
          <a href="mailto:support@mu-komik.com" className="px-4 py-3 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold text-center transition">Email: support@mu-komik.com</a>
          <a href="https://wa.me/6281320118218" target="_blank" rel="noopener" className="px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-center transition">WhatsApp: 0813-2011-8218</a>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
          <input
            type="text"
            placeholder="Nama Anda"
            className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Anda"
            className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Tulis pesan atau pertanyaan Anda..."
            className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
          <button type="submit" className="py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition">Kirim Pesan</button>
          {sent && <div className="text-green-400 text-center font-semibold">Pesan Anda sudah terkirim! Kami akan membalas secepatnya.</div>}
        </form>
        <div className="bg-white/5 rounded-lg p-4">
          <h2 className="text-lg font-bold mb-2">FAQ</h2>
          <ul className="text-white/80 text-sm space-y-2">
            <li><b>Bagaimana cara membaca komik premium?</b><br />Beli koin, lalu gunakan untuk membuka halaman komik premium.</li>
            <li><b>Saya lupa password, bagaimana reset?</b><br />Klik &quot;Lupa Password&quot; di halaman login, lalu ikuti instruksi di email.</li>
            <li><b>Koin saya tidak bertambah setelah topup?</b><br />Silakan hubungi WhatsApp support dengan bukti pembayaran.</li>
            <li><b>Bagaimana cara menjadi kreator di MU Komik?</b><br />Kirim portofolio dan data diri ke email support kami.</li>
          </ul>
        </div>
        <div className="mt-8 text-center">
          <Link href="/" className="text-purple-400 hover:underline">&larr; Kembali ke Beranda</Link>
        </div>
      </div>
    </main>
  );
} 