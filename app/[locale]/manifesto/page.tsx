'use client'

import Link from 'next/link'
import { ArrowLeft, Heart, Shield, Lightbulb, Eye, MessageCircle } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function ManifestoPage() {
  const params = useParams();
  const locale = params?.locale as string || 'id';
  
  // Translation function
  const t = (key: string) => {
    const translations = {
      id: {
        // Metadata
        'manifesto.title': 'Manifesto Etika AI & Komitmen Kreatif - MU Komik',
        'manifesto.description': 'Visi dan prinsip etika AI kami dalam pengembangan platform komik digital yang memberdayakan kreator tanpa menghilangkan peran manusia.',
        
        // Header
        'manifesto.backToHome': 'Kembali ke Beranda',
        'manifesto.mainTitle': '📜 Manifesto Etika AI & Komitmen Kreatif',
        'manifesto.subtitle': 'Visi kami dalam memberdayakan kreator melalui teknologi yang bertanggung jawab',
        
        // Vision Section
        'manifesto.vision.title': '✨ Visi Kami',
        'manifesto.vision.content': 'mu-komik.com adalah platform kreatif yang memanfaatkan teknologi kecerdasan buatan (AI) untuk mempercepat dan memperluas produksi komik digital, tanpa menghilangkan peran manusia sebagai inti dari proses kreatif. Kami percaya bahwa AI adalah alat bantu, bukan pengganti seniman. Kami hadir untuk memberdayakan penulis, ilustrator, pendidik, dan komunitas kreatif, agar bisa mewujudkan ide-ide mereka dalam bentuk visual dengan cara baru yang inklusif, cepat, dan kolaboratif.',
        
        // Principles Section
        'manifesto.principles.title': '🧭 Prinsip-Prinsip Etika AI Kami',
        'manifesto.principles.1.title': '1. Kreativitas Manusia Adalah Inti',
        'manifesto.principles.1.content': 'Kami menempatkan manusia—penulis cerita, pembuat konsep, ilustrator, editor—sebagai inti dari setiap karya. AI hanya membantu mewujudkan ide yang berasal dari manusia.',
        'manifesto.principles.2.title': '2. AI sebagai Mitra Kolaboratif',
        'manifesto.principles.2.content': 'Kami memosisikan AI sebagai asisten kreatif, bukan mesin otomatis pembuat karya. Model kerja kami berbasis kolaborasi manusia + AI, bukan penghapusan salah satu pihak.',
        'manifesto.principles.3.title': '3. Transparansi dalam Proses Produksi',
        'manifesto.principles.3.content': 'Setiap komik di platform kami mencantumkan sumber keterlibatan:',
        'manifesto.principles.3.list.1': 'Siapa penulis cerita',
        'manifesto.principles.3.list.2': 'Apakah menggunakan AI dalam visual',
        'manifesto.principles.3.list.3': 'Apakah visual di-retouch atau dikurasi oleh manusia',
        'manifesto.principles.4.title': '4. Keadilan dan Penghargaan terhadap Kreator',
        'manifesto.principles.4.content': 'Kreator tetap mendapatkan kredit dan potensi pendapatan berdasarkan peran dan kontribusinya, baik dari sisi cerita, arahan, maupun pengolahan akhir.',
        'manifesto.principles.5.title': '5. Menggunakan Model AI Secara Etis',
        'manifesto.principles.5.content': 'Kami berkomitmen untuk menggunakan model AI yang tidak dilatih dari karya artis tanpa izin, dan memilih teknologi yang mematuhi prinsip hak cipta serta lisensi terbuka.',
        'manifesto.principles.6.title': '6. Ruang untuk Semua Gaya dan Teknik',
        'manifesto.principles.6.content': 'Kami tidak hanya mendukung komik berbasis AI, tetapi juga manual, digital painting, sketsa, hingga mixed media. AI bukan satu-satunya jalan, tapi salah satu pilihan.',
        'manifesto.principles.7.title': '7. Tidak Mengejar Kuantitas Tanpa Kualitas',
        'manifesto.principles.7.content': 'Meskipun AI memungkinkan produksi cepat, kami tetap melakukan kurasi terhadap konten agar tidak menjadi "spam visual" tanpa substansi. Cerita dan pesan tetap menjadi prioritas utama.',
        'manifesto.principles.8.title': '8. Komunitas sebagai Ruang Belajar',
        'manifesto.principles.8.content': 'mu-komik.com terbuka sebagai ruang belajar bersama, di mana pengguna dapat mencoba, gagal, bereksperimen, dan bertumbuh—baik mereka ilustrator berpengalaman maupun penulis pemula.',
        
        // FAQ Section
        'manifesto.faq.title': '❓ Tanya Jawab: Pro-Kontra AI di Dunia Komik',
        'manifesto.faq.q1.title': 'Q1: "Apakah AI akan menghancurkan profesi seniman?"',
        'manifesto.faq.q1.content': 'Tidak. Seperti Photoshop atau tablet digital yang dulu ditolak, AI adalah alat baru. Justru banyak seniman kini memakai AI sebagai alat bantu referensi, pewarnaan, atau eksplorasi ide.',
        'manifesto.faq.q2.title': 'Q2: "Apakah karya AI tidak punya jiwa?"',
        'manifesto.faq.q2.content': 'Benar, jika murni dari mesin tanpa arahan manusia. Tapi di mu-komik.com, semua AI diarahkan oleh manusia—baik melalui prompt, naskah, layout, atau pilihan gaya visual.',
        'manifesto.faq.q3.title': 'Q3: "Apakah mu-komik.com mencuri karya seniman dari internet?"',
        'manifesto.faq.q3.content': 'Tidak. Kami tidak melatih model sendiri dari karya artis tanpa izin. Kami menggunakan model yang tersedia secara legal dan menjaga etika dalam penggunaan teknologi.',
        'manifesto.faq.q4.title': 'Q4: "Kenapa tidak fokus saja pada komik manual?"',
        'manifesto.faq.q4.content': 'Kami mendukung komik manual. Bahkan kami menyediakan ruang pamer untuk komik non-AI. Namun AI membuka akses bagi mereka yang tidak bisa menggambar tetapi punya cerita bagus.',
        'manifesto.faq.q5.title': 'Q5: "Apakah hasil AI lebih rendah kualitasnya?"',
        'manifesto.faq.q5.content': 'Belum tentu. Hasil AI yang diarahkan dengan konsep kuat bisa menyaingi karya manual. Kami memadukan AI dengan editing manual dan pengawasan kreator agar hasilnya berkualitas.',
        'manifesto.faq.q6.title': 'Q6: "Bagaimana saya tahu mana komik yang dibuat AI?"',
        'manifesto.faq.q6.content': 'Kami akan mencantumkan label pada karya berbasis AI. Transparansi adalah bagian dari etika kami.',
        'manifesto.faq.q7.title': 'Q7: "Apakah saya bisa tetap berkarya tanpa AI di platform ini?"',
        'manifesto.faq.q7.content': 'Tentu. Kami ingin merangkul semua jenis kreator. Silakan kirim karya manual, dan kami akan bantu mempromosikannya secara setara.',
        
        // Commitment Section
        'manifesto.commitment.title': '🤝 Komitmen Kami ke Depan',
        'manifesto.commitment.intro': 'Kami akan terus:',
        'manifesto.commitment.list.1': 'Melibatkan komunitas kreator dalam pengembangan fitur baru',
        'manifesto.commitment.list.2': 'Membuka ruang diskusi dan pelatihan tentang penggunaan AI secara etis',
        'manifesto.commitment.list.3': 'Memastikan pembagian pendapatan yang adil dan transparan',
        'manifesto.commitment.list.4': 'Menyediakan versi open-call untuk seniman manual dan kolaborator naskah',
        'manifesto.commitment.list.5': 'Mendorong budaya kolaborasi antara manusia dan teknologi',
        
        // Closing Section
        'manifesto.closing.title': '🔓 Penutup: AI Bukan Ancaman, Tapi Kesempatan Baru',
        'manifesto.closing.content': 'Teknologi akan selalu berkembang. Yang menentukan arah penggunaannya adalah manusianya. Di mu-komik.com, kami ingin membuktikan bahwa AI bisa digunakan untuk menyuburkan ekosistem kreatif, bukan menghancurkannya.',
        'manifesto.closing.ending': 'Mari kita bertumbuh bersama.',
        
        // CTA Section
        'manifesto.cta.title': 'Siap Bergabung dengan Komunitas Kreatif Kami?',
        'manifesto.cta.subtitle': 'Mulai berkarya dan eksplorasi bersama ribuan kreator lainnya',
        'manifesto.cta.explore': 'Jelajahi Komik',
        'manifesto.cta.featured': 'Lihat Unggulan'
      },
      en: {
        // Metadata
        'manifesto.title': 'AI Ethics Manifesto & Creative Commitment - MU Komik',
        'manifesto.description': 'Our vision and AI ethics principles in developing a digital comic platform that empowers creators without eliminating human roles.',
        
        // Header
        'manifesto.backToHome': 'Back to Home',
        'manifesto.mainTitle': '📜 AI Ethics Manifesto & Creative Commitment',
        'manifesto.subtitle': 'Our vision in empowering creators through responsible technology',
        
        // Vision Section
        'manifesto.vision.title': '✨ Our Vision',
        'manifesto.vision.content': 'mu-komik.com is a creative platform that leverages artificial intelligence (AI) technology to accelerate and expand digital comic production, without eliminating the human role as the core of the creative process. We believe that AI is a tool, not a replacement for artists. We are here to empower writers, illustrators, educators, and creative communities, so they can realize their ideas in visual form through new ways that are inclusive, fast, and collaborative.',
        
        // Principles Section
        'manifesto.principles.title': '🧭 Our AI Ethics Principles',
        'manifesto.principles.1.title': '1. Human Creativity is the Core',
        'manifesto.principles.1.content': 'We place humans—story writers, concept creators, illustrators, editors—as the core of every work. AI only helps realize ideas that come from humans.',
        'manifesto.principles.2.title': '2. AI as a Collaborative Partner',
        'manifesto.principles.2.content': 'We position AI as a creative assistant, not an automatic work-generating machine. Our working model is based on human + AI collaboration, not the elimination of either party.',
        'manifesto.principles.3.title': '3. Transparency in Production Process',
        'manifesto.principles.3.content': 'Every comic on our platform includes source involvement:',
        'manifesto.principles.3.list.1': 'Who is the story writer',
        'manifesto.principles.3.list.2': 'Whether using AI in visuals',
        'manifesto.principles.3.list.3': 'Whether visuals are retouched or curated by humans',
        'manifesto.principles.4.title': '4. Fairness and Recognition for Creators',
        'manifesto.principles.4.content': 'Creators still receive credit and potential income based on their role and contribution, whether from story, direction, or final processing.',
        'manifesto.principles.5.title': '5. Using AI Models Ethically',
        'manifesto.principles.5.content': 'We are committed to using AI models that are not trained from artists\' work without permission, and choosing technology that adheres to copyright principles and open licenses.',
        'manifesto.principles.6.title': '6. Space for All Styles and Techniques',
        'manifesto.principles.6.content': 'We don\'t just support AI-based comics, but also manual, digital painting, sketches, to mixed media. AI is not the only path, but one option.',
        'manifesto.principles.7.title': '7. Not Pursuing Quantity Without Quality',
        'manifesto.principles.7.content': 'Although AI enables fast production, we still curate content to avoid becoming "visual spam" without substance. Story and message remain the top priority.',
        'manifesto.principles.8.title': '8. Community as a Learning Space',
        'manifesto.principles.8.content': 'mu-komik.com is open as a collaborative learning space, where users can try, fail, experiment, and grow—whether they are experienced illustrators or novice writers.',
        
        // FAQ Section
        'manifesto.faq.title': '❓ Q&A: AI Pros and Cons in the Comic World',
        'manifesto.faq.q1.title': 'Q1: "Will AI destroy the artist profession?"',
        'manifesto.faq.q1.content': 'No. Like Photoshop or digital tablets that were once rejected, AI is a new tool. In fact, many artists now use AI as a reference tool, coloring, or idea exploration.',
        'manifesto.faq.q2.title': 'Q2: "Do AI works have no soul?"',
        'manifesto.faq.q2.content': 'True, if purely from machines without human direction. But at mu-komik.com, all AI is directed by humans—whether through prompts, scripts, layouts, or visual style choices.',
        'manifesto.faq.q3.title': 'Q3: "Does mu-komik.com steal artist work from the internet?"',
        'manifesto.faq.q3.content': 'No. We don\'t train our own models from artists\' work without permission. We use legally available models and maintain ethics in technology use.',
        'manifesto.faq.q4.title': 'Q4: "Why not just focus on manual comics?"',
        'manifesto.faq.q4.content': 'We support manual comics. We even provide exhibition space for non-AI comics. However, AI opens access for those who can\'t draw but have good stories.',
        'manifesto.faq.q5.title': 'Q5: "Are AI results lower quality?"',
        'manifesto.faq.q5.content': 'Not necessarily. AI results directed with strong concepts can rival manual work. We combine AI with manual editing and creator supervision for quality results.',
        'manifesto.faq.q6.title': 'Q6: "How do I know which comics are made with AI?"',
        'manifesto.faq.q6.content': 'We will include labels on AI-based works. Transparency is part of our ethics.',
        'manifesto.faq.q7.title': 'Q7: "Can I still create without AI on this platform?"',
        'manifesto.faq.q7.content': 'Of course. We want to embrace all types of creators. Please send manual work, and we will help promote it equally.',
        
        // Commitment Section
        'manifesto.commitment.title': '🤝 Our Future Commitments',
        'manifesto.commitment.intro': 'We will continue to:',
        'manifesto.commitment.list.1': 'Involve the creator community in developing new features',
        'manifesto.commitment.list.2': 'Open discussion and training spaces about ethical AI use',
        'manifesto.commitment.list.3': 'Ensure fair and transparent revenue sharing',
        'manifesto.commitment.list.4': 'Provide open-call versions for manual artists and script collaborators',
        'manifesto.commitment.list.5': 'Encourage collaboration culture between humans and technology',
        
        // Closing Section
        'manifesto.closing.title': '🔓 Closing: AI is Not a Threat, But a New Opportunity',
        'manifesto.closing.content': 'Technology will always evolve. What determines the direction of its use is humans. At mu-komik.com, we want to prove that AI can be used to nurture the creative ecosystem, not destroy it.',
        'manifesto.closing.ending': 'Let\'s grow together.',
        
        // CTA Section
        'manifesto.cta.title': 'Ready to Join Our Creative Community?',
        'manifesto.cta.subtitle': 'Start creating and exploring with thousands of other creators',
        'manifesto.cta.explore': 'Explore Comics',
        'manifesto.cta.featured': 'View Featured'
      }
    };
    
         const localeTranslations = translations[locale as keyof typeof translations];
         return localeTranslations?.[key as keyof typeof localeTranslations] || translations.id[key as keyof typeof translations.id] || key;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href={`/${locale}`} className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('manifesto.backToHome')}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('manifesto.mainTitle')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('manifesto.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Visi Kami */}
        <section className="mb-12">
          <div className="bg-white rounded-xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="w-6 h-6 mr-3 text-yellow-500" />
              {t('manifesto.vision.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('manifesto.vision.content')}
            </p>
          </div>
        </section>

        {/* Prinsip-Prinsip Etika AI */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-blue-500" />
            {t('manifesto.principles.title')}
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('manifesto.principles.1.title')}</h3>
              <p className="text-gray-700">
                {t('manifesto.principles.1.content')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('manifesto.principles.2.title')}</h3>
              <p className="text-gray-700">
                {t('manifesto.principles.2.content')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('manifesto.principles.3.title')}</h3>
              <p className="text-gray-700 mb-3">
                {t('manifesto.principles.3.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>{t('manifesto.principles.3.list.1')}</li>
                <li>{t('manifesto.principles.3.list.2')}</li>
                <li>{t('manifesto.principles.3.list.3')}</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('manifesto.principles.4.title')}</h3>
              <p className="text-gray-700">
                {t('manifesto.principles.4.content')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('manifesto.principles.5.title')}</h3>
              <p className="text-gray-700">
                {t('manifesto.principles.5.content')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('manifesto.principles.6.title')}</h3>
              <p className="text-gray-700">
                {t('manifesto.principles.6.content')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('manifesto.principles.7.title')}</h3>
              <p className="text-gray-700">
                {t('manifesto.principles.7.content')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('manifesto.principles.8.title')}</h3>
              <p className="text-gray-700">
                {t('manifesto.principles.8.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Tanya Jawab */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <MessageCircle className="w-6 h-6 mr-3 text-green-500" />
            {t('manifesto.faq.title')}
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('manifesto.faq.q1.title')}</h3>
              <p className="text-gray-700">
                {t('manifesto.faq.q1.content')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('manifesto.faq.q2.title')}</h3>
              <p className="text-gray-700">
                {t('manifesto.faq.q2.content')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('manifesto.faq.q3.title')}</h3>
              <p className="text-gray-700">
                {t('manifesto.faq.q3.content')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('manifesto.faq.q4.title')}</h3>
              <p className="text-gray-700">
                {t('manifesto.faq.q4.content')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('manifesto.faq.q5.title')}</h3>
              <p className="text-gray-700">
                {t('manifesto.faq.q5.content')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('manifesto.faq.q6.title')}</h3>
              <p className="text-gray-700">
                {t('manifesto.faq.q6.content')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('manifesto.faq.q7.title')}</h3>
              <p className="text-gray-700">
                {t('manifesto.faq.q7.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Komitmen Kami */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Heart className="w-6 h-6 mr-3 text-red-500" />
            {t('manifesto.commitment.title')}
          </h2>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-gray-700 mb-4">
              {t('manifesto.commitment.intro')}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>{t('manifesto.commitment.list.1')}</li>
              <li>{t('manifesto.commitment.list.2')}</li>
              <li>{t('manifesto.commitment.list.3')}</li>
              <li>{t('manifesto.commitment.list.4')}</li>
              <li>{t('manifesto.commitment.list.5')}</li>
            </ul>
          </div>
        </section>

        {/* Penutup */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-3" />
              {t('manifesto.closing.title')}
            </h2>
            <p className="text-lg leading-relaxed">
              {t('manifesto.closing.content')}
            </p>
            <p className="text-xl font-semibold mt-6">
              {t('manifesto.closing.ending')}
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-white rounded-xl p-8 shadow-sm border">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {t('manifesto.cta.title')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('manifesto.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href={`/${locale}/komik`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {t('manifesto.cta.explore')}
              </Link>
              <Link 
                href={`/${locale}/unggulan`}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {t('manifesto.cta.featured')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 