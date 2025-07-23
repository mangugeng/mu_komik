# 🌐 Panduan Sistem Multi-Bahasa MU Komik

## 📋 Overview
Website MU Komik sekarang mendukung dua bahasa: **Indonesia (id)** dan **English (en)** dengan auto-detect dan language switching.

## 🚀 Cara Menggunakan

### 1. **Akses Website**
- **Indonesia**: `http://localhost:3001/id`
- **English**: `http://localhost:3001/en`
- **Auto-detect**: `http://localhost:3001` (akan redirect berdasarkan browser language)

### 2. **Language Switcher**
- Klik dropdown di pojok kanan atas
- Pilih bahasa yang diinginkan
- URL akan otomatis berubah sesuai bahasa

### 3. **Navigasi**
Semua halaman sekarang menggunakan format URL dengan locale:
- `/id/komik` - Daftar komik (Indonesia)
- `/en/komik` - Daftar komik (English)
- `/id/videoKomik` - Video komik (Indonesia)
- `/en/videoKomik` - Video komik (English)
- dst.

## 🛠️ Struktur File

### Translation Files
```
messages/
├── id.json    # Terjemahan Indonesia
└── en.json    # Terjemahan English
```

### Layout Structure
```
app/
├── layout.tsx                    # Root layout
├── [locale]/
│   ├── layout.tsx               # Locale-specific layout
│   ├── page.tsx                 # Home page
│   ├── komik/page.tsx           # Comics page
│   ├── videoKomik/page.tsx      # Video comics page
│   └── ...                      # Other pages
└── components/
    ├── LanguageSwitcher.tsx     # Language dropdown
    └── BottomBar.tsx            # Navigation bar
```

## 🔧 Menambah Terjemahan Baru

### 1. **Di messages/id.json**
```json
{
  "newSection": {
    "title": "Judul Baru",
    "description": "Deskripsi dalam bahasa Indonesia"
  }
}
```

### 2. **Di messages/en.json**
```json
{
  "newSection": {
    "title": "New Title",
    "description": "Description in English"
  }
}
```

### 3. **Di Component**
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

## 🌍 SEO & Metadata

### Hreflang Tags
Website otomatis menambahkan hreflang tags untuk SEO:
```html
<link rel="alternate" hreflang="id" href="https://mu-komik.com/id" />
<link rel="alternate" hreflang="en" href="https://mu-komik.com/en" />
```

### Meta Tags
Setiap halaman memiliki meta tags yang sesuai dengan bahasa yang dipilih.

## 🚨 Troubleshooting

### Error: "useTranslations context not found"
- Pastikan komponen berada dalam `NextIntlClientProvider`
- Pastikan komponen di-render di dalam `[locale]` directory

### URL tidak berubah saat ganti bahasa
- Pastikan menggunakan `useLanguage` hook dari `LanguageContext`
- Pastikan `setLanguage` dipanggil dengan locale yang benar

### Build error
- Jalankan `rm -rf .next && npm run build` untuk clean build
- Pastikan semua import path sudah benar

## 📱 PWA Support

### Manifest.json
- `start_url`: `/id` (default ke Indonesia)
- `lang`: `id` (default language)
- Shortcuts menggunakan URL dengan locale

### Meta Tags
- `mobile-web-app-capable`: `yes`
- `apple-mobile-web-app-capable`: `yes`

## 🎯 Best Practices

1. **Selalu gunakan translation keys** - Jangan hardcode text
2. **Gunakan nested structure** - Organize translations dengan baik
3. **Test kedua bahasa** - Pastikan UI tidak rusak di kedua bahasa
4. **Gunakan semantic keys** - Nama key yang deskriptif
5. **Handle pluralization** - Gunakan format yang sesuai untuk plural

## 🔄 Deployment

Sistem multi-bahasa sudah siap untuk deployment:
```bash
npm run build
vercel --prod
```

Semua fitur akan berfungsi di production dengan URL:
- `https://mu-komik.com/id`
- `https://mu-komik.com/en` 