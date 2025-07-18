const admin = require('firebase-admin');

// Firebase service account credentials
const serviceAccount = {
  type: "service_account",
  project_id: "mu-komik",
  private_key_id: "f83edf25ddb11e590beeb071be8b7df585b172d3",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC1rAXtvqlGnzKr\nKRMF0VORjHKJdHp5fDZ0o6BRS+1QoK7LN1L+AOrj6YYWBCa92skzHrNyLLUz/1UL\nS4BETQ00gAsBuC4OUQKM+GCw5DvuYxWgu65kG2e/dKC9F5Khj2QKZFt/QiodSrNj\nivXDHJV7xqQrtT8RiRsz+s4LdR19Ub1TCha0qNFU9b+xmPNLHjpwnbolBta97B1V\nfFBg4DdeCch7RSzWPCbrERLQCm4+uvu7pYM3wHcE4g5fuF+ae5VR8h5cHODBTsEo\nphHfD6bMrfBZsABaMrxiiopDv4xnvccVkYudtryiszoTiBNjq4I/q/e1UyzFKaPm\nAZuWu7CzAgMBAAECggEAARNp0F/pK7bLCFI/2RbfJx6Z5qN7pP2HawbPCIkDeKjc\nibqKcZOhNt4aqHjrOJ0zkZ7UbDaRXVbDphBf5ZRy1N7cC21DF8JpQMF1yezIFOAE\nVqvV2z6B5xNybwkIZsMgUglvG0brVFOta63Jr8qbCtBN1GGh5BSX3/JtYIoxTwOR\nNoIKRJ1TuO1sdZLat3wqCjVCgMoKeqAG9YP596vSVllPK7HK3GfzCAvjeoVYkigE\n3dGOjsP8NtkUwH8yP6I8AkvotiPPrE/3wkDzKjxsneEjnOnqx0m29mPuDb/EtJg0\n5K59woad8r+cRlqdpRX0RP9YbNwYvNybPGtISQ7TNQKBgQD/1N65yWAMn4QRKXmZ\nUCFPhK8lACSWdmXBPMYRo+C2ix4alz6sFaAPxJDzYTnZmybFdkHBONua0MlTgIiQ\nrdWP460yJLKMx5ASsaJ03sR6qAKO1Yx++XWnW17EDw8g6vMyeJnF6HWZY6GLzfem\n5vdNKgs377t2+lH5ePmeB0KePQKBgQC1yqaYtf1qPQhIW5a/7qph3r1eCH2t7mfU\nYjyOQethDKxGyf6d6KRggNsRgjEF5RYTrpWTNqt8eF7p+8hZbPTiUX9tEx79jJ24\nJa1BlirQ6jChRFVP5xvFV5WMgKnJo+YpKw+fkgu5qdLNoJkykjVTQt5G7ORLSmJz\nue5k5ZzprwKBgQDyxB+ukWdx0xVR69eWIrHZcYF6TQ5rMWMR4gfayXX+AznH5en1\nBnhjPhaGvaZV1qMOElAHeVr7KFFDyd7N3AeiiVzbDnPYn68Z7jLJUHOGKVR0EjVG\ncJay/0OILPogNJQfOs5BPXwK2L59mi/904KtWM5YgEeWeae8Yo4M5brTyQKBgDea\nNRxuRYVSB4+CG/i2efyXURpKxI4HZlCKf3UPanvzkVnRfIQ13Nj7cIXJaU8hQ4Bf\nnLY7OXZHptgwP5ZCgiAaxzvIZmkssizZsUVnNc9SYe9hZCqdSFwyrrYbwFLBQ6uB\n1TR8SgPOkoB8R381QwQlZrEQ0b7JkJVO4ECSDk1XAoGBAJ3CvsC4FEhG0UDAENMY\nswOlOxCztNo31XhPxveIUrNA9HKGDKQzoGElcEz/QPaZs7mJIvIZMjWUXhQhBAar\nAEWAHwU+ajvXsdcEw9J0IPqN+BjQHTOR6lo+Zd2WXc7t8iryNx7obwC3AmziYMsi\nEtbGUfwInT1IVvhaqvHLmyJY\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@mu-komik.iam.gserviceaccount.com",
  client_id: "117000630858049619016",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mu-komik.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Initialize Firebase Admin
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
    console.log('🚀 Starting news collection setup with provided credentials...');
    
    const newsCollection = db.collection('news');
    
    for (const newsItem of sampleNews) {
      const docRef = await newsCollection.add(newsItem);
      console.log(`✅ Added news: "${newsItem.title}" with ID: ${docRef.id}`);
    }
    
    console.log('🎉 News collection setup completed successfully!');
    console.log(`📊 Total news items added: ${sampleNews.length}`);
    console.log('🌐 You can now run "npm run dev" to see the news on your landing page!');
    
  } catch (error) {
    console.error('❌ Error setting up news collection:', error);
  } finally {
    process.exit(0);
  }
}

// Run the setup
setupNewsCollection(); 