# Manual News Collection Setup Guide

## Quick Setup via Firebase Console

Since the automated script requires admin permissions, here's how to set up the news collection manually:

### Step 1: Access Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `mu-komik`
3. Navigate to **Firestore Database** in the left sidebar

### Step 2: Create News Collection

1. Click **"Start collection"** (if no collections exist)
2. Collection ID: `news`
3. Click **"Next"**

### Step 3: Add Sample News Documents

For each news item, create a new document with the following structure:

#### Document 1: Komikus Indonesia Raih Penghargaan Internasional
```json
{
  "title": "Komikus Indonesia Raih Penghargaan Internasional",
  "content": "Komikus lokal berhasil mengharumkan nama Indonesia di ajang komik internasional dengan karya yang mengangkat budaya Nusantara. Prestasi ini membuktikan bahwa talenta Indonesia tidak kalah dengan komikus internasional.",
  "imageUrl": "/images/logo.png",
  "author": "Tim MU Komik",
  "category": "Prestasi",
  "readTime": 3,
  "status": "published",
  "publishedAt": [Timestamp - Current Date],
  "createdAt": [Timestamp - Current Date],
  "updatedAt": [Timestamp - Current Date],
  "tags": ["prestasi", "internasional", "komikus"],
  "views": 1250,
  "likes": 89
}
```

#### Document 2: Fitur Baru: Video Komik Interaktif
```json
{
  "title": "Fitur Baru: Video Komik Interaktif",
  "content": "Nikmati pengalaman membaca komik yang lebih immersive dengan fitur video komik interaktif terbaru kami. Fitur ini menghadirkan pengalaman baru yang menggabungkan komik statis dengan elemen video.",
  "imageUrl": "/images/logo.png",
  "author": "Tim MU Komik",
  "category": "Fitur",
  "readTime": 2,
  "status": "published",
  "publishedAt": [Timestamp - 1 day ago],
  "createdAt": [Timestamp - Current Date],
  "updatedAt": [Timestamp - Current Date],
  "tags": ["fitur", "video", "interaktif"],
  "views": 2100,
  "likes": 156
}
```

#### Document 3: Komik Terpopuler Bulan Ini
```json
{
  "title": "Komik Terpopuler Bulan Ini",
  "content": "Simak daftar komik terpopuler yang paling banyak dibaca oleh pengguna MU Komik bulan ini. Dari genre action hingga romance, temukan komik favorit baru untuk dibaca.",
  "imageUrl": "/images/logo.png",
  "author": "Tim MU Komik",
  "category": "Trending",
  "readTime": 4,
  "status": "published",
  "publishedAt": [Timestamp - 2 days ago],
  "createdAt": [Timestamp - Current Date],
  "updatedAt": [Timestamp - Current Date],
  "tags": ["trending", "populer", "bulanan"],
  "views": 3400,
  "likes": 234
}
```

#### Document 4: Tips Menjadi Komikus Sukses
```json
{
  "title": "Tips Menjadi Komikus Sukses",
  "content": "Panduan lengkap untuk para komikus pemula yang ingin mengembangkan karir di industri komik digital. Dari teknik menggambar hingga strategi monetisasi, semua ada di sini.",
  "imageUrl": "/images/logo.png",
  "author": "Tim MU Komik",
  "category": "Tips",
  "readTime": 5,
  "status": "published",
  "publishedAt": [Timestamp - 3 days ago],
  "createdAt": [Timestamp - Current Date],
  "updatedAt": [Timestamp - Current Date],
  "tags": ["tips", "komikus", "karir"],
  "views": 1800,
  "likes": 145
}
```

#### Document 5: Event Komik Nasional 2024
```json
{
  "title": "Event Komik Nasional 2024",
  "content": "Jangan lewatkan event komik terbesar di Indonesia yang akan menghadirkan komikus-komikus ternama. Event ini akan menjadi ajang networking dan showcase karya terbaik.",
  "imageUrl": "/images/logo.png",
  "author": "Tim MU Komik",
  "category": "Event",
  "readTime": 3,
  "status": "published",
  "publishedAt": [Timestamp - 4 days ago],
  "createdAt": [Timestamp - Current Date],
  "updatedAt": [Timestamp - Current Date],
  "tags": ["event", "nasional", "komikus"],
  "views": 2900,
  "likes": 178
}
```

#### Document 6: Update Aplikasi MU Komik v2.0
```json
{
  "title": "Update Aplikasi MU Komik v2.0",
  "content": "Aplikasi MU Komik telah diperbarui dengan fitur-fitur baru yang lebih responsif dan user-friendly. Update ini membawa pengalaman membaca yang lebih baik.",
  "imageUrl": "/images/logo.png",
  "author": "Tim MU Komik",
  "category": "Update",
  "readTime": 2,
  "status": "published",
  "publishedAt": [Timestamp - 5 days ago],
  "createdAt": [Timestamp - Current Date],
  "updatedAt": [Timestamp - Current Date],
  "tags": ["update", "aplikasi", "fitur"],
  "views": 4200,
  "likes": 312
}
```

### Step 4: Setting Timestamps

For each document, set the timestamp fields:

1. **publishedAt**: Use different dates (current date for latest, older dates for others)
2. **createdAt**: Use current date/time
3. **updatedAt**: Use current date/time

To set a timestamp in Firebase Console:
1. Click on the field
2. Select **"timestamp"** type
3. Choose **"Server timestamp"** for current time
4. Or select a specific date/time

### Step 5: Verify Setup

After adding all documents:

1. Check that all documents have `status: "published"`
2. Verify timestamps are set correctly
3. Ensure all required fields are present

### Step 6: Test the Application

1. Run your development server: `npm run dev`
2. Navigate to the landing page
3. Check that news items appear in the news section
4. Verify that views and likes are displayed correctly

## Field Descriptions

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `title` | string | News headline | Yes |
| `content` | string | News content/body | Yes |
| `imageUrl` | string | Featured image URL | No |
| `author` | string | Author name | Yes |
| `category` | string | News category | Yes |
| `readTime` | number | Reading time in minutes | Yes |
| `status` | string | "published" or "draft" | Yes |
| `publishedAt` | timestamp | Publication date | Yes |
| `createdAt` | timestamp | Creation date | Yes |
| `updatedAt` | timestamp | Last update date | Yes |
| `tags` | array | Searchable tags | No |
| `views` | number | View count | Yes |
| `likes` | number | Like count | Yes |

## Categories Available

- **Prestasi** - Achievement/recognition news
- **Fitur** - New feature announcements  
- **Trending** - Popular content updates
- **Tips** - Tips and guides
- **Event** - Event announcements
- **Update** - App/platform updates
- **Wawancara** - Interview content
- **Analisis** - Analysis and insights

## Troubleshooting

**News not appearing:**
- Check that `status` is set to "published"
- Verify `publishedAt` timestamp is set
- Check browser console for errors

**Permission errors:**
- Ensure Firestore rules allow public read access
- Check that the news collection exists

**Missing fields:**
- All required fields must be present
- Check field names match exactly (case-sensitive) 