# Sistem Multi-Bahasa MU Komik

## Overview

MU Komik sekarang mendukung dua bahasa: **Indonesia (id)** dan **Inggris (en)** dengan auto-detect bahasa berdasarkan pengaturan browser pengguna.

## Fitur

- ✅ Auto-detect bahasa browser
- ✅ Dukungan bahasa Indonesia dan Inggris
- ✅ Language switcher dengan UI yang menarik
- ✅ URL routing berdasarkan bahasa (`/id`, `/en`)
- ✅ Terjemahan lengkap untuk semua komponen
- ✅ SEO-friendly dengan hreflang tags

## Struktur File

```
├── i18n.ts                    # Konfigurasi i18n
├── middleware.ts              # Middleware untuk routing
├── messages/
│   ├── id.json               # Terjemahan bahasa Indonesia
│   └── en.json               # Terjemahan bahasa Inggris
├── app/
│   ├── [locale]/             # Dynamic routing untuk bahasa
│   │   ├── layout.tsx        # Layout dengan NextIntlClientProvider
│   │   └── page.tsx          # Halaman utama dengan terjemahan
│   ├── context/
│   │   └── LanguageContext.tsx # Context untuk manajemen bahasa
│   └── components/
│       ├── LanguageSwitcher.tsx # Komponen untuk ganti bahasa
│       └── BottomBar.tsx     # Bottom bar dengan terjemahan
```

## Cara Penggunaan

### 1. Menambahkan Terjemahan Baru

Tambahkan key baru di kedua file:
- `messages/id.json` (bahasa Indonesia)
- `messages/en.json` (bahasa Inggris)

```json
{
  "newSection": {
    "title": "Judul Baru",
    "description": "Deskripsi dalam bahasa Indonesia"
  }
}
```

### 2. Menggunakan Terjemahan di Komponen

```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('newSection');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### 3. Menggunakan Language Switcher

```tsx
import LanguageSwitcher from './components/LanguageSwitcher';

export default function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}
```

### 4. Menggunakan Language Context

```tsx
import { useLanguage } from './context/LanguageContext';

export default function MyComponent() {
  const { currentLocale, setLanguage, availableLocales } = useLanguage();
  
  return (
    <div>
      <p>Bahasa saat ini: {currentLocale}</p>
      <button onClick={() => setLanguage('en')}>
        Ganti ke Inggris
      </button>
    </div>
  );
}
```

## Routing

- `/` → Redirect ke `/id` (bahasa default)
- `/id` → Halaman dalam bahasa Indonesia
- `/en` → Halaman dalam bahasa Inggris
- `/id/komik` → Halaman komik dalam bahasa Indonesia
- `/en/komik` → Halaman komik dalam bahasa Inggris

## Auto-Detect

Sistem akan secara otomatis mendeteksi bahasa browser pengguna:
- Jika browser diset ke Indonesia → `/id`
- Jika browser diset ke Inggris → `/en`
- Jika bahasa lain → `/id` (default)

## Menambahkan Bahasa Baru

1. Tambahkan locale baru di `i18n.ts`:
```ts
export const locales = ['en', 'id', 'ja'] as const;
```

2. Buat file terjemahan baru:
```bash
touch messages/ja.json
```

3. Update middleware matcher:
```ts
matcher: ['/', '/(id|en|ja)/:path*']
```

## SEO

Sistem multi-bahasa sudah dioptimalkan untuk SEO dengan:
- Hreflang tags di metadata
- URL yang SEO-friendly
- Structured data yang mendukung multi-bahasa
- Meta tags yang sesuai untuk setiap bahasa

## Deployment

Sistem multi-bahasa sudah siap untuk deployment di Vercel atau platform lain. Pastikan semua file terjemahan sudah lengkap sebelum deploy.

## Troubleshooting

### Error: "useTranslations must be used within a NextIntlClientProvider"

Pastikan komponen berada dalam struktur routing `[locale]` atau gunakan `NextIntlClientProvider` secara manual.

### Error: "Locale not found"

Pastikan locale sudah didefinisikan di `i18n.ts` dan file terjemahan sudah dibuat.

### Language switcher tidak berfungsi

Pastikan `LanguageProvider` sudah membungkus aplikasi di `layout.tsx`.

## Best Practices

1. **Gunakan namespace yang konsisten** untuk mengelompokkan terjemahan
2. **Gunakan key yang deskriptif** untuk memudahkan maintenance
3. **Test terjemahan** di kedua bahasa sebelum deploy
4. **Gunakan fallback** untuk terjemahan yang belum ada
5. **Optimalkan bundle size** dengan lazy loading terjemahan jika diperlukan 