import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AudioProvider } from '@/context/AudioContext';
import MiniPlayer from '@/components/dashboard/MiniPlayer';
import InstallBanner from '@/components/ui/InstallBanner';
import { Toaster } from 'sonner';
import InstallPrompt from "@/components/InstallPrompt"; // 🚀 The new component
import RefreshHandler from '@/components/RefreshHandler'; // 🚀 Handles pull-to-refresh on mobile
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ["latin"] });

// 🚀 Professional Metadata for PWA & SEO
export const metadata: Metadata = {
  title: "HifzTracker | Earn Eternity Rewards",
  description: "Track your Quran journey and stay consistent during Ramadan.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // 🚀 Blends with the dark theme
    title: "HifzTracker",
  },
  icons: {
    apple: "/icons/icon-192.png", // Ensure this path matches your public folder
  },
};

// 🚀 Viewport Settings
export const viewport: Viewport = {
  // 🎨 Changed to Navy (#020617) so the status bar blends with your app background
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
          {/* Top Banner (Optional - you can keep or remove if using the new slide-up prompt) */}
          <RefreshHandler /> {/* 🚀 Simply add it here */}
          <InstallBanner /> 
          
          {children}

          <Toaster position="top-center" richColors />
          
          {/* Global Audio Player */}
          <MiniPlayer /> 
        </AudioProvider>
        
        {/* 🚀 The iOS Slide-Up Guide */}
        <InstallPrompt />
        
        {/* Vercel Speed Insights */}
        <SpeedInsights />
      </body>
    </html>
  );
}