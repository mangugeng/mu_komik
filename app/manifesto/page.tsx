import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Heart, Shield, Lightbulb, Eye, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Manifesto Etika AI & Komitmen Kreatif - MU Komik',
  description: 'Visi dan prinsip etika AI kami dalam pengembangan platform komik digital yang memberdayakan kreator tanpa menghilangkan peran manusia.',
  keywords: 'AI ethics, komik digital, kreator, etika AI, platform komik, mu-komik',
  openGraph: {
    title: 'Manifesto Etika AI & Komitmen Kreatif - MU Komik',
    description: 'Visi dan prinsip etika AI kami dalam pengembangan platform komik digital yang memberdayakan kreator.',
    type: 'website',
  },
}

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📜 Manifesto Etika AI & Komitmen Kreatif
          </h1>
          <p className="text-lg text-gray-600">
            Visi kami dalam memberdayakan kreator melalui teknologi yang bertanggung jawab
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Visi Kami */}
        <section className="mb-12">
          <div className="bg-white rounded-xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="w-6 h-6 mr-3 text-yellow-500" />
              ✨ Visi Kami
            </h2>
            <p className="text-gray-700 leading-relaxed">
              mu-komik.com adalah platform kreatif yang memanfaatkan teknologi kecerdasan buatan (AI) untuk mempercepat dan memperluas produksi komik digital, tanpa menghilangkan peran manusia sebagai inti dari proses kreatif. Kami percaya bahwa AI adalah alat bantu, bukan pengganti seniman. Kami hadir untuk memberdayakan penulis, ilustrator, pendidik, dan komunitas kreatif, agar bisa mewujudkan ide-ide mereka dalam bentuk visual dengan cara baru yang inklusif, cepat, dan kolaboratif.
            </p>
          </div>
        </section>

        {/* Prinsip-Prinsip Etika AI */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-blue-500" />
            🧭 Prinsip-Prinsip Etika AI Kami
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Kreativitas Manusia Adalah Inti</h3>
              <p className="text-gray-700">
                Kami menempatkan manusia—penulis cerita, pembuat konsep, ilustrator, editor—sebagai inti dari setiap karya. AI hanya membantu mewujudkan ide yang berasal dari manusia.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2. AI sebagai Mitra Kolaboratif</h3>
              <p className="text-gray-700">
                Kami memosisikan AI sebagai asisten kreatif, bukan mesin otomatis pembuat karya. Model kerja kami berbasis kolaborasi manusia + AI, bukan penghapusan salah satu pihak.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Transparansi dalam Proses Produksi</h3>
              <p className="text-gray-700 mb-3">
                Setiap komik di platform kami mencantumkan sumber keterlibatan:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Siapa penulis cerita</li>
                <li>Apakah menggunakan AI dalam visual</li>
                <li>Apakah visual di-retouch atau dikurasi oleh manusia</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Keadilan dan Penghargaan terhadap Kreator</h3>
              <p className="text-gray-700">
                Kreator tetap mendapatkan kredit dan potensi pendapatan berdasarkan peran dan kontribusinya, baik dari sisi cerita, arahan, maupun pengolahan akhir.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Menggunakan Model AI Secara Etis</h3>
              <p className="text-gray-700">
                Kami berkomitmen untuk menggunakan model AI yang tidak dilatih dari karya artis tanpa izin, dan memilih teknologi yang mematuhi prinsip hak cipta serta lisensi terbuka.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Ruang untuk Semua Gaya dan Teknik</h3>
              <p className="text-gray-700">
                Kami tidak hanya mendukung komik berbasis AI, tetapi juga manual, digital painting, sketsa, hingga mixed media. AI bukan satu-satunya jalan, tapi salah satu pilihan.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Tidak Mengejar Kuantitas Tanpa Kualitas</h3>
              <p className="text-gray-700">
                Meskipun AI memungkinkan produksi cepat, kami tetap melakukan kurasi terhadap konten agar tidak menjadi &ldquo;spam visual&rdquo; tanpa substansi. Cerita dan pesan tetap menjadi prioritas utama.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Komunitas sebagai Ruang Belajar</h3>
              <p className="text-gray-700">
                mu-komik.com terbuka sebagai ruang belajar bersama, di mana pengguna dapat mencoba, gagal, bereksperimen, dan bertumbuh—baik mereka ilustrator berpengalaman maupun penulis pemula.
              </p>
            </div>
          </div>
        </section>

        {/* Tanya Jawab */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <MessageCircle className="w-6 h-6 mr-3 text-green-500" />
            ❓ Tanya Jawab: Pro-Kontra AI di Dunia Komik
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Q1: &ldquo;Apakah AI akan menghancurkan profesi seniman?&rdquo;</h3>
              <p className="text-gray-700">
                <strong>Tidak.</strong> Seperti Photoshop atau tablet digital yang dulu ditolak, AI adalah alat baru. Justru banyak seniman kini memakai AI sebagai alat bantu referensi, pewarnaan, atau eksplorasi ide.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Q2: &ldquo;Apakah karya AI tidak punya jiwa?&rdquo;</h3>
              <p className="text-gray-700">
                <strong>Benar,</strong> jika murni dari mesin tanpa arahan manusia. Tapi di mu-komik.com, semua AI diarahkan oleh manusia—baik melalui prompt, naskah, layout, atau pilihan gaya visual.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Q3: &ldquo;Apakah mu-komik.com mencuri karya seniman dari internet?&rdquo;</h3>
              <p className="text-gray-700">
                <strong>Tidak.</strong> Kami tidak melatih model sendiri dari karya artis tanpa izin. Kami menggunakan model yang tersedia secara legal dan menjaga etika dalam penggunaan teknologi.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Q4: &ldquo;Kenapa tidak fokus saja pada komik manual?&rdquo;</h3>
              <p className="text-gray-700">
                Kami mendukung komik manual. Bahkan kami menyediakan ruang pamer untuk komik non-AI. Namun AI membuka akses bagi mereka yang tidak bisa menggambar tetapi punya cerita bagus.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Q5: &ldquo;Apakah hasil AI lebih rendah kualitasnya?&rdquo;</h3>
              <p className="text-gray-700">
                <strong>Belum tentu.</strong> Hasil AI yang diarahkan dengan konsep kuat bisa menyaingi karya manual. Kami memadukan AI dengan editing manual dan pengawasan kreator agar hasilnya berkualitas.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Q6: &ldquo;Bagaimana saya tahu mana komik yang dibuat AI?&rdquo;</h3>
              <p className="text-gray-700">
                Kami akan mencantumkan label pada karya berbasis AI. Transparansi adalah bagian dari etika kami.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Q7: &ldquo;Apakah saya bisa tetap berkarya tanpa AI di platform ini?&rdquo;</h3>
              <p className="text-gray-700">
                <strong>Tentu.</strong> Kami ingin merangkul semua jenis kreator. Silakan kirim karya manual, dan kami akan bantu mempromosikannya secara setara.
              </p>
            </div>
          </div>
        </section>

        {/* Komitmen Kami */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Heart className="w-6 h-6 mr-3 text-red-500" />
            🤝 Komitmen Kami ke Depan
          </h2>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-700 mb-4">
              Kami akan terus:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Melibatkan komunitas kreator dalam pengembangan fitur baru</li>
              <li>Membuka ruang diskusi dan pelatihan tentang penggunaan AI secara etis</li>
              <li>Memastikan pembagian pendapatan yang adil dan transparan</li>
              <li>Menyediakan versi open-call untuk seniman manual dan kolaborator naskah</li>
              <li>Mendorong budaya kolaborasi antara manusia dan teknologi</li>
            </ul>
          </div>
        </section>

        {/* Penutup */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-3" />
              🔓 Penutup: AI Bukan Ancaman, Tapi Kesempatan Baru
            </h2>
            <p className="text-lg leading-relaxed">
              Teknologi akan selalu berkembang. Yang menentukan arah penggunaannya adalah manusianya. Di mu-komik.com, kami ingin membuktikan bahwa AI bisa digunakan untuk menyuburkan ekosistem kreatif, bukan menghancurkannya.
            </p>
            <p className="text-xl font-semibold mt-6">
              Mari kita bertumbuh bersama.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-white rounded-xl p-8 shadow-sm border">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Siap Bergabung dengan Komunitas Kreatif Kami?
            </h3>
            <p className="text-gray-600 mb-6">
              Mulai berkarya dan eksplorasi bersama ribuan kreator lainnya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/komik" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Jelajahi Komik
              </Link>
              <Link 
                href="/unggulan" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Lihat Unggulan
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 