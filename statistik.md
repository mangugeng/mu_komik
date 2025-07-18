# Statistik & Tracking Data Chapter Komik

## Field Statistik di Dokumen Chapter

Setiap dokumen chapter di koleksi `komik/[idKomik]/chapters/[chapterId]` menyimpan statistik berikut:

- **Statistik Pembelian**
  - `totalPurchases`: Total pembelian halaman di chapter ini
  - `totalRevenue`: Total pendapatan dari pembelian halaman di chapter ini
  - `lastPurchaseTime`: Waktu pembelian terakhir (ISO string)
  - `purchaseCount`: Jumlah pembelian (counter)

- **Statistik View**
  - `viewCount`: Jumlah view terbaru
  - `lastViewTime`: Waktu view terakhir (ISO string)
  - `totalViews`: Total seluruh view

- **Statistik Komentar**
  - `commentCount`: Jumlah komentar terbaru
  - `lastCommentTime`: Waktu komentar terakhir (ISO string)
  - `totalComments`: Total seluruh komentar

- **Data Dasar Chapter**
  - `title`: Judul chapter
  - `pages`: Array data halaman (PageData[])
  - `isComment`: Status komentar aktif/tidak
  - `order`: Urutan chapter

## Subkoleksi di Chapter

- `views/` — Menyimpan detail setiap view (userId, deviceId, time)
- `comments/` — Menyimpan semua komentar (user, userName, text, createdAt)
- `likes/` — Menyimpan data like (deviceId/userId)

## Contoh Struktur Dokumen Chapter

```
komik/{idKomik}/chapters/{chapterId} {
  title: string,
  pages: PageData[],
  isComment: boolean,
  order: number,
  // Statistik
  totalPurchases: number,
  totalRevenue: number,
  lastPurchaseTime: string,
  purchaseCount: number,
  viewCount: number,
  lastViewTime: string,
  totalViews: number,
  commentCount: number,
  lastCommentTime: string,
  totalComments: number
}
```

## Cara Melihat Data di Firebase Console
1. Buka koleksi: `komik/[idKomik]/chapters/[chapterId]`
2. Lihat field statistik di dokumen utama
3. Lihat subkoleksi untuk detail views, comments, dan likes

---

**Catatan:**
- Statistik otomatis bertambah saat ada pembelian, view, atau komentar baru.
- Subkoleksi menyimpan detail per event (misal: siapa yang membeli, siapa yang view, isi komentar, dll). 