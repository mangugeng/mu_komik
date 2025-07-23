'use client'

import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function CustomerSupportPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const params = useParams();
  const locale = params?.locale as string || 'id';
  
  // Translation function
  const t = (key: string) => {
    const translations = {
      id: {
        // Page Title
        'support.title': 'Customer Support',
        'support.subtitle': 'Ada pertanyaan, kendala, atau butuh bantuan? Hubungi kami melalui form di bawah atau kontak langsung via WhatsApp/email.',
        
        // Contact Info
        'support.email': 'Email: support@mu-komik.com',
        'support.whatsapp': 'WhatsApp: 0813-2011-8218',
        
        // Form
        'support.namePlaceholder': 'Nama Anda',
        'support.emailPlaceholder': 'Email Anda',
        'support.messagePlaceholder': 'Tulis pesan atau pertanyaan Anda...',
        'support.sendMessage': 'Kirim Pesan',
        'support.messageSent': 'Pesan Anda sudah terkirim! Kami akan membalas secepatnya.',
        
        // FAQ
        'support.faq': 'FAQ',
        'support.faq1.question': 'Bagaimana cara membaca komik premium?',
        'support.faq1.answer': 'Beli koin, lalu gunakan untuk membuka halaman komik premium.',
        'support.faq2.question': 'Saya lupa password, bagaimana reset?',
        'support.faq2.answer': 'Klik "Lupa Password" di halaman login, lalu ikuti instruksi di email.',
        'support.faq3.question': 'Koin saya tidak bertambah setelah topup?',
        'support.faq3.answer': 'Silakan hubungi WhatsApp support dengan bukti pembayaran.',
        'support.faq4.question': 'Bagaimana cara menjadi kreator di MU Komik?',
        'support.faq4.answer': 'Kirim portofolio dan data diri ke email support kami.',
        
        // Navigation
        'support.backHome': '← Kembali ke Beranda'
      },
      en: {
        // Page Title
        'support.title': 'Customer Support',
        'support.subtitle': 'Have questions, issues, or need help? Contact us through the form below or contact directly via WhatsApp/email.',
        
        // Contact Info
        'support.email': 'Email: support@mu-komik.com',
        'support.whatsapp': 'WhatsApp: 0813-2011-8218',
        
        // Form
        'support.namePlaceholder': 'Your Name',
        'support.emailPlaceholder': 'Your Email',
        'support.messagePlaceholder': 'Write your message or question...',
        'support.sendMessage': 'Send Message',
        'support.messageSent': 'Your message has been sent! We will reply as soon as possible.',
        
        // FAQ
        'support.faq': 'FAQ',
        'support.faq1.question': 'How to read premium comics?',
        'support.faq1.answer': 'Buy coins, then use them to unlock premium comic pages.',
        'support.faq2.question': 'I forgot my password, how to reset?',
        'support.faq2.answer': 'Click "Forgot Password" on the login page, then follow the instructions in the email.',
        'support.faq3.question': 'My coins didn\'t increase after topup?',
        'support.faq3.answer': 'Please contact WhatsApp support with payment proof.',
        'support.faq4.question': 'How to become a creator at MU Komik?',
        'support.faq4.answer': 'Send portfolio and personal data to our support email.',
        
        // Navigation
        'support.backHome': '← Back to Home'
      }
    };
    
    return (translations[locale as keyof typeof translations] as any)?.[key] || (translations.id as any)[key] || key;
  };

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
        <h1 className="text-3xl font-bold mb-2 text-center">{t('support.title')}</h1>
        <p className="text-center text-white/70 mb-6">{t('support.subtitle')}</p>
        <div className="flex flex-col gap-3 mb-6">
          <a href="mailto:support@mu-komik.com" className="px-4 py-3 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold text-center transition">{t('support.email')}</a>
          <a href="https://wa.me/6281320118218" target="_blank" rel="noopener" className="px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-center transition">{t('support.whatsapp')}</a>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
          <input
            type="text"
            placeholder={t('support.namePlaceholder')}
            className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder={t('support.emailPlaceholder')}
            className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder={t('support.messagePlaceholder')}
            className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
          <button type="submit" className="py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition">{t('support.sendMessage')}</button>
          {sent && <div className="text-green-400 text-center font-semibold">{t('support.messageSent')}</div>}
        </form>
        <div className="bg-white/5 rounded-lg p-4">
          <h2 className="text-lg font-bold mb-2">{t('support.faq')}</h2>
          <ul className="text-white/80 text-sm space-y-2">
            <li><b>{t('support.faq1.question')}</b><br />{t('support.faq1.answer')}</li>
            <li><b>{t('support.faq2.question')}</b><br />{t('support.faq2.answer')}</li>
            <li><b>{t('support.faq3.question')}</b><br />{t('support.faq3.answer')}</li>
            <li><b>{t('support.faq4.question')}</b><br />{t('support.faq4.answer')}</li>
          </ul>
        </div>
        <div className="mt-8 text-center">
          <Link href={`/${locale}`} className="text-purple-400 hover:underline">{t('support.backHome')}</Link>
        </div>
      </div>
    </main>
  );
} 