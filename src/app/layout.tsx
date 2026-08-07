import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { GoogleTagManager } from '@next/third-parties/google';
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "UnboundYou | IGCSE Online Tuition & Elite 1-on-1 Tutors",
  description: "Master your exams with top IGCSE online tuition. We provide personalized 1-on-1 IGCSE online coaching, focused on intensive past paper practice and curriculum mastery.",
  keywords: [
    "igcse online tuition", "igcse maths tutor online", "igcse online tutor",
    "igcse online coaching", "igcse english tutor online", "igcse maths online tuition",
    "online tuition igcse", "igcse physics online tutor", "igcse english online tutor",
    "igcse biology online tutor", "igcse chemistry online tutor", "igcse chemistry tutor online",
    "online igcse maths tutor", "online igcse physics tutor", "physics igcse tutor online",
    "IB tutoring", "1-on-1 tutoring"
  ],
  authors: [{ name: "UnboundYou" }],
  openGraph: {
    title: "UnboundYou | Elite 1-on-1 IGCSE Tutoring",
    description: "Master IGCSE and IB with top 1% mentors. Personalized 1-on-1 online tutoring.",
    url: "https://unboundyou.com",
    siteName: "UnboundYou",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UnboundYou | Elite 1-on-1 IGCSE Tutoring",
    description: "Master IGCSE with top 1% mentors.",
  },
  metadataBase: new URL("https://unboundyou.com"),
  icons: {
    icon: [
      { url: '/logo-square.png' },
    ],
    apple: [
      { url: '/logo-square.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* DNS prefetch for 3rd-party domains */}
        <link rel="dns-prefetch" href="//connect.facebook.net" />
        <link rel="dns-prefetch" href="//www.clarity.ms" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//i.pravatar.cc" />
        {/* Preconnect for critical 3rd parties */}
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />

        {/* Microsoft Clarity - load lazily after page is interactive */}
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <Script id="clarity" strategy="lazyOnload">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
            `}
          </Script>
        )}

        {/* GTM - load after interactive */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        )}

        {/* Facebook Pixel - load lazily to not block LCP */}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
          <>
            <Script id="fb-pixel" strategy="lazyOnload">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FB_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </body>
    </html>
  );
}
