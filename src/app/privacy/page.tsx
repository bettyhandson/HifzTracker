'use client';

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-600 relative overflow-hidden">
      
      {/* 🚀 Stylish Wave Divider (Top) */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-[0] z-0">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[80px] fill-[#020617]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="max-w-3xl mx-auto py-24 px-6 relative z-10">
        
        {/* Header */}
        <div className="mb-12">
          <Button variant="ghost" asChild className="mb-6 pl-0 text-emerald-600 hover:text-emerald-700 hover:bg-transparent">
            <Link href="/"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Home</Link>
          </Button>
          <div className="h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center border border-emerald-200 mb-6 shadow-sm">
            <ShieldCheck className="h-7 w-7 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-slate-500 font-medium">Last updated: February 5, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-slate max-w-none space-y-10">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700">1</span>
              Our Core Promise
            </h2>
            <p className="leading-relaxed">
              HifzTracker is built as a Sadaqah Jariyah (continuous charity) project. 
              <strong className="text-emerald-700"> We do not sell your data. We do not show ads.</strong> Your spiritual journey is private, and our goal is solely to help you track your Hifz progress.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700">2</span>
              Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-3 text-slate-600 marker:text-emerald-500">
              <li><strong className="text-slate-900">Account Information:</strong> If you sign up, we collect your email address via our authentication provider.</li>
              <li><strong className="text-slate-900">Progress Data:</strong> We store the Surahs and Ayahs you log to generate your heatmaps and statistics.</li>
              <li><strong className="text-slate-900">Guest Data:</strong> If you use Guest Mode, your data is stored locally on your device (LocalStorage) and is never sent to our servers.</li>
            </ul>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700">3</span>
              Payments & Donations
            </h2>
            <p className="leading-relaxed">
              We use <strong className="text-slate-900">Paystack</strong> to process donations securely. We do not store your credit card details on our servers. 
              Paystack handles all financial transactions according to their own privacy standards.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700">4</span>
              Data Security
            </h2>
            <p className="leading-relaxed">
              We use industry-standard encryption (SSL) and secure database practices (RLS) to protect your information. 
              However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700">5</span>
              Contact Us
            </h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at: <br />
              <a href="mailto:contact@hifztracker.space" className="text-emerald-600 hover:underline font-bold">support@optimistcx.space</a>
            </p>
          </section>
        </div>
        
        {/* Footer Credit */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-sm text-slate-500 text-center">
          Operated by <span className="text-emerald-600 font-bold">Geministudio Agency</span>.
        </div>
      </div>
    </div>
  );
}