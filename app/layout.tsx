import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import BottomBarWrapper from './components/BottomBarWrapper'
import Script from 'next/script'
import { PreferencesProvider } from './context/PreferencesContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MU Komik - Baca Komik Indonesia Terbaik',
  description: 'Baca komik digital karya kreator Indonesia. Gratis, update setiap hari, dan dukung komikus lokal di mu-komik.com!',
  keywords: 'komik indonesia, komik digital, komik online, komik gratis, komikus indonesia, baca komik, webtoon indonesia, komik lokal',
  authors: [{ name: 'MU Komik Team' }],
  creator: 'MU Komik',
  publisher: 'MU Komik',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  metadataBase: new URL('https://mu-komik.com'),
  alternates: {
    canonical: 'https://mu-komik.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MU Komik',
  },
  openGraph: {
    title: 'MU Komik - Baca Komik Indonesia Terbaik',
    description: 'Baca komik digital karya kreator Indonesia. Gratis, update setiap hari, dan dukung komikus lokal di mu-komik.com!',
    url: 'https://mu-komik.com',
    siteName: 'MU Komik',
    images: [
      {
        url: '/images/logo.png',
        width: 512,
        height: 512,
        alt: 'MU Komik Logo',
        type: 'image/png',
      },
      {
        url: '/images/cover-mukomik-v2.png',
        width: 1200,
        height: 630,
        alt: 'MU Komik - Komik Indonesia',
        type: 'image/png',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@mu_komik',
    creator: '@mu_komik',
    title: 'MU Komik - Baca Komik Indonesia Terbaik',
    description: 'Baca komik digital karya kreator Indonesia. Gratis, update setiap hari, dan dukung komikus lokal di mu-komik.com!',
    images: ['/images/cover-mukomik-v2.png'],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'MU Komik',
    'application-name': 'MU Komik',
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/browserconfig.xml',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MU Komik" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Logo Meta Tags */}
        <meta property="og:image" content="https://mu-komik.com/images/logo.png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:alt" content="MU Komik Logo" />
        <meta name="twitter:image" content="https://mu-komik.com/images/logo.png" />
        <meta name="twitter:image:alt" content="MU Komik Logo" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MU Komik",
              "description": "Platform baca komik digital karya kreator Indonesia",
              "url": "https://mu-komik.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://mu-komik.com/komik?search={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "MU Komik",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://mu-komik.com/images/logo.png"
                }
              }
            })
          }}
        />
        
        {/* Structured Data: Organization with Social Links */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "MU Komik",
              "url": "https://mu-komik.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://mu-komik.com/images/logo.png",
                "width": 512,
                "height": 512
              },
              "image": "https://mu-komik.com/images/logo.png",
              "sameAs": [
                "https://www.instagram.com/mu_komik/",
                "https://www.facebook.com/mu.komik.reader/",
                "https://www.youtube.com/@mu-komik"
              ],
              "description": "Platform baca komik digital karya kreator Indonesia. Gratis, update setiap hari, dan dukung komikus lokal di mu-komik.com!",
              "foundingDate": "2024",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "url": "https://mu-komik.com/customer-support"
              }
            })
          }}
        />
        
        <Script
          src="https://app.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="beforeInteractive"
        />
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XG2L641N1P"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XG2L641N1P');
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-black min-h-screen`}>
        <PreferencesProvider>
          <main className="w-full md:w-1/2 mx-auto px-0 py-0">
            <div className="w-full">
              {children}
            </div>
          </main>
          <BottomBarWrapper />
          <Toaster position="bottom-center" />
        </PreferencesProvider>
      </body>
    </html>
  )
} 