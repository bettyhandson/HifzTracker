import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AudioProvider } from '@/context/AudioContext';
import MiniPlayer from '@/components/dashboard/MiniPlayer';
import InstallBanner from '@/components/ui/InstallBanner';
import { Toaster } from 'sonner';
import InstallPrompt from "@/components/InstallPrompt"; // 🚀 The new component
import RefreshHandler from '@/components/RefreshHandler'; // 🚀 Handles pull-to-refresh on mobile

const inter = Inter({ subsets: ["latin"] });

// 🚀 Professional Metadata for PWA, SEO & Social Sharing
export const metadata: Metadata = {
  title: "HifzTracker | Quranic Consistency & Hifz Tracker",
  description: "Secure your eternity journey. Track your Quran progress, join the Verse Master challenges, and build unbreakable daily habits.",
  manifest: "/manifest.json",
  
  // 🚀 Open Graph (WhatsApp, LinkedIn, Facebook)
  openGraph: {
    title: "HifzTracker | Crafting Unbreakable Quran Habits",
    description: "The modern companion for Quranic consistency. Start your journey today.",
    url: "https://optimistcx.space",
    siteName: "HifzTracker",
    images: [
      {
        // 🚀 Using Absolute URL to ensure WhatsApp/X can crawl the image properly
        url: "https://optimistcx.space/Hifz.jpg", 
        width: 512,
        height: 512,
        alt: "HifzTracker App Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // 🚀 Twitter/X Metadata
  twitter: {
    card: "summary_large_image",
    title: "HifzTracker | Quranic Consistency",
    description: "Track your Hifz and master your verses with interactive challenges.",
    // 🚀 Using Absolute URL here as well
    images: ["https://optimistcx.space/Hifz.jpg"],
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HifzTracker",
    // 🚀 Helps iOS recognize the app icon during the "Add to Home Screen" process
    startupImage: [
      '/icons/icon-512.png', 
    ],
  },

  // 🚀 Explicitly defined icons
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

// 🚀 Viewport Settings
export const viewport: Viewport = {
  themeColor: "#020617", 
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // 🚀 Prevents zooming on inputs (App-like feel)
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#020617] text-white`}>
        <AudioProvider>
          <RefreshHandler /> 
          <InstallBanner /> 
          
          {children}

          <Toaster position="top-center" richColors />
          
          <MiniPlayer /> 
        </AudioProvider>
        
        <InstallPrompt /> 
      </body>
    </html>
  );
}