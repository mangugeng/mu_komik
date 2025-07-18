const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCN80VJw2wPKZpZnMdkKu4JuKw9dqwsfhk",
  authDomain: "mu-komik.firebaseapp.com",
  projectId: "mu-komik",
  storageBucket: "mu-komik.firebasestorage.app",
  messagingSenderId: "880724806230",
  appId: "1:880724806230:web:94c478a14f473ee61889f7",
  measurementId: "G-XG2L641N1P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    publishedAt: new Date(),
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
    publishedAt: new Date(Date.now() - 86400000), // 1 day ago
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
    publishedAt: new Date(Date.now() - 172800000), // 2 days ago
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
    publishedAt: new Date(Date.now() - 259200000), // 3 days ago
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
    publishedAt: new Date(Date.now() - 345600000), // 4 days ago
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
    publishedAt: new Date(Date.now() - 432000000), // 5 days ago
    tags: ["update", "aplikasi", "fitur"],
    views: 4200,
    likes: 312
  },
  {
    title: "Wawancara Eksklusif dengan Komikus Terkenal",
    content: "Simak wawancara eksklusif dengan salah satu komikus terkenal Indonesia yang membagikan perjalanan karir dan tips untuk komikus pemula.",
    imageUrl: "/images/logo.png",
    author: "Tim MU Komik",
    category: "Wawancara",
    readTime: 6,
    status: "published",
    publishedAt: new Date(Date.now() - 518400000), // 6 days ago
    tags: ["wawancara", "eksklusif", "komikus"],
    views: 1600,
    likes: 98
  },
  {
    title: "Genre Komik yang Paling Diminati",
    content: "Analisis mendalam tentang genre komik yang paling diminati oleh pembaca Indonesia. Data ini membantu komikus memahami preferensi pasar.",
    imageUrl: "/images/logo.png",
    author: "Tim MU Komik",
    category: "Analisis",
    readTime: 4,
    status: "published",
    publishedAt: new Date(Date.now() - 604800000), // 7 days ago
    tags: ["analisis", "genre", "pasar"],
    views: 2200,
    likes: 167
  }
];

async function setupNewsCollection() {
  try {
    console.log('🚀 Starting news collection setup...');
    
    const newsCollection = collection(db, 'news');
    
    for (const newsItem of sampleNews) {
      const docData = {
        ...newsItem,
        publishedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(newsCollection, docData);
      console.log(`✅ Added news: "${newsItem.title}" with ID: ${docRef.id}`);
    }
    
    console.log('🎉 News collection setup completed successfully!');
    console.log(`📊 Total news items added: ${sampleNews.length}`);
    
  } catch (error) {
    console.error('❌ Error setting up news collection:', error);
  }
}

// Run the setup
setupNewsCollection(); 