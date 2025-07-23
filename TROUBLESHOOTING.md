# 🔧 Troubleshooting Guide

## 🚨 Masalah Umum & Solusi

### 1. **Port 3000 Tidak Tersedia**
**Gejala:** Server berjalan di port 3001 atau port lain
**Solusi:**
```bash
# Kill semua proses Next.js
pkill -f "next dev"

# Atau gunakan script yang sudah dibuat
./start-dev.sh
```

### 2. **404 Error di Root Path `/`**
**Gejala:** `GET http://localhost:3000/ 404 (Not Found)`
**Solusi:**
- Pastikan middleware.ts sudah benar
- Pastikan app/page.tsx ada dan berisi redirect
- Clear cache: `rm -rf .next && npm run dev`

### 3. **Icon Files 404**
**Gejala:** `GET /icons/icon-96x96.png 404`
**Solusi:**
- Manifest.json sudah diperbaiki untuk menggunakan icon yang ada
- Icon yang tersedia: 16x16, 32x32, 144x144, 192x192, 512x512

### 4. **Translation Context Error**
**Gejala:** `Failed to call useTranslations because the context was not found`
**Solusi:**
- Pastikan komponen berada dalam `NextIntlClientProvider`
- Pastikan komponen di-render di dalam `[locale]` directory
- Pastikan `BottomBar` berada dalam locale layout

### 5. **Build Error**
**Gejala:** Build gagal dengan error TypeScript atau ESLint
**Solusi:**
```bash
# Clean build
rm -rf .next
npm run build

# Atau fix ESLint errors
npm run lint -- --fix
```

### 6. **Firebase Initialization Error**
**Gejala:** Error saat Firebase di-initialize di server-side
**Solusi:**
- Pastikan environment variables sudah benar
- Firebase hanya di-initialize di client-side components
- Gunakan dynamic import untuk Firebase di server components

## 🛠️ Script Utilitas

### Start Development Server
```bash
./start-dev.sh
```

### Clean Build
```bash
rm -rf .next && npm run build
```

### Fix ESLint
```bash
npm run lint -- --fix
```

## 🔍 Debug Checklist

### Sebelum Report Bug:
- [ ] Clear Next.js cache (`rm -rf .next`)
- [ ] Restart development server
- [ ] Check browser console untuk error
- [ ] Check terminal untuk error messages
- [ ] Pastikan semua dependencies terinstall (`npm install`)

### Untuk Multi-Language Issues:
- [ ] Test di `/id` dan `/en`
- [ ] Test language switcher
- [ ] Check URL routing
- [ ] Verify translation files ada dan valid

## 📞 Support

Jika masalah masih berlanjut:
1. Check error logs di terminal
2. Check browser console
3. Pastikan semua file sudah sesuai dengan dokumentasi
4. Test dengan clean installation

## 🎯 Quick Fixes

### Port Issues:
```bash
# Kill semua proses di port 3000
lsof -ti:3000 | xargs kill -9
```

### Cache Issues:
```bash
# Clear semua cache
rm -rf .next node_modules/.cache
npm install
```

### Translation Issues:
```bash
# Restart dengan clean cache
rm -rf .next
npm run dev
``` 