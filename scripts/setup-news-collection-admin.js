const admin = require('firebase-admin');

// Initialize Firebase Admin using environment variables
// You can set these environment variables or use the default config
const serviceAccount = {
  type: "service_account",
  project_id: "mu-komik",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};

// Check if we have the required environment variables
if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
  console.log('❌ Firebase Admin credentials not found in environment variables.');
  console.log('📝 Please set the following environment variables:');
  console.log('   FIREBASE_PRIVATE_KEY_ID');
  console.log('   FIREBASE_PRIVATE_KEY');
  console.log('   FIREBASE_CLIENT_EMAIL');
  console.log('   FIREBASE_CLIENT_ID');
  console.log('   FIREBASE_CLIENT_CERT_URL');
  console.log('');
  console.log('🔗 You can get these from Firebase Console > Project Settings > Service Accounts');
  console.log('💡 Or use the manual setup guide: MANUAL_NEWS_SETUP.md');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Sample news data
const sampleNews = [
  {
    title: "Komikus Indonesia Raih Penghargaan Internasional",
    content: "Komikus lokal berhasil mengharumkan nama Indonesia di ajang komik internasional dengan karya yang mengangkat budaya Nusantara. Prestasi ini membuktikan bahwa talenta Indonesia tidak kalah dengan komikus internasional.",
    imageUrl: "/images/logo.png",
    author: "Tim MU Komik",
    category: "Prestasi",
    readTime: 3,
    status: "published",
    publishedAt: admin.firestore.Timestamp.now(),
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    tags: ["prestasi", "internasional", "komikus"],
    views: 1250,
    likes: 89
  },
  {
    title: "Fitur Baru: Video Komik Interaktif",
    content: "Nikmati pengalaman membaca komik yang lebih immersive dengan fitur video komik interaktif terbaru kami. Fitur ini menghadirkan pengalaman baru yang menggabungkan komik statis dengan elemen video.",
    imageUrl: "/images/logo.png",
    author: "Tim MU Komik",
    category: "Fitur",
    readTime: 2,
    status: "published",
    publishedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000)),
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    tags: ["fitur", "video", "interaktif"],
    views: 2100,
    likes: 156
  },
  {
    title: "Komik Terpopuler Bulan Ini",
    content: "Simak daftar komik terpopuler yang paling banyak dibaca oleh pengguna MU Komik bulan ini. Dari genre action hingga romance, temukan komik favorit baru untuk dibaca.",
    imageUrl: "/images/logo.png",
    author: "Tim MU Komik",
    category: "Trending",
    readTime: 4,
    status: "published",
    publishedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 172800000)),
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    tags: ["trending", "populer", "bulanan"],
    views: 3400,
    likes: 234
  },
  {
    title: "Tips Menjadi Komikus Sukses",
    content: "Panduan lengkap untuk para komikus pemula yang ingin mengembangkan karir di industri komik digital. Dari teknik menggambar hingga strategi monetisasi, semua ada di sini.",
    imageUrl: "/images/logo.png",
    author: "Tim MU Komik",
    category: "Tips",
    readTime: 5,
    status: "published",
    publishedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 259200000)),
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    tags: ["tips", "komikus", "karir"],
    views: 1800,
    likes: 145
  },
  {
    title: "Event Komik Nasional 2024",
    content: "Jangan lewatkan event komik terbesar di Indonesia yang akan menghadirkan komikus-komikus ternama. Event ini akan menjadi ajang networking dan showcase karya terbaik.",
    imageUrl: "/images/logo.png",
    author: "Tim MU Komik",
    category: "Event",
    readTime: 3,
    status: "published",
    publishedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 345600000)),
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    tags: ["event", "nasional", "komikus"],
    views: 2900,
    likes: 178
  },
  {
    title: "Update Aplikasi MU Komik v2.0",
    content: "Aplikasi MU Komik telah diperbarui dengan fitur-fitur baru yang lebih responsif dan user-friendly. Update ini membawa pengalaman membaca yang lebih baik.",
    imageUrl: "/images/logo.png",
    author: "Tim MU Komik",
    category: "Update",
    readTime: 2,
    status: "published",
    publishedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 432000000)),
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    tags: ["update", "aplikasi", "fitur"],
    views: 4200,
    likes: 312
  }
];

async function setupNewsCollection() {
  try {
    console.log('🚀 Starting news collection setup with Admin SDK...');
    
    const newsCollection = db.collection('news');
    
    for (const newsItem of sampleNews) {
      const docRef = await newsCollection.add(newsItem);
      console.log(`✅ Added news: "${newsItem.title}" with ID: ${docRef.id}`);
    }
    
    console.log('🎉 News collection setup completed successfully!');
    console.log(`📊 Total news items added: ${sampleNews.length}`);
    
  } catch (error) {
    console.error('❌ Error setting up news collection:', error);
  } finally {
    process.exit(0);
  }
}

// Run the setup
setupNewsCollection(); 