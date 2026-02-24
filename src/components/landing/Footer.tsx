'use client';

import Link from "next/link";
import { BookOpen, Github, Twitter, Mail, Heart, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020617] border-t border-white/5 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8 mb-12">
          
          {/* Brand and Mission */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 font-black text-white text-xl tracking-tight">
              <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                <BookOpen className="h-5 w-5 text-emerald-500" />
              </div>
              <span>HifzTracker</span>
            </Link>
            <p className="text-sm leading-6 text-slate-400 max-w-xs">
              A Sadaqah Jariyah project built to help the Ummah stay consistent with the Quran. 
              May Allah accept it from us all.
            </p>
            <div className="flex space-x-5">
              <Link href="https://github.com/Oprimecloud" className="text-slate-500 hover:text-emerald-400 transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://x.com/easedwell" className="text-slate-500 hover:text-emerald-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://www.linkedin.com/in/solagbade-abdulmalik-662962309" className="text-slate-500 hover:text-emerald-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-xs font-bold text-white tracking-widest uppercase mb-6">Platform</h3>
                <ul role="list" className="space-y-4">
                  <li><Link href="#features" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Smart Features</Link></li>
                  <li><Link href="#how-it-works" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">How it Works</Link></li>
                  <li><Link href="/login" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Login / Sign Up</Link></li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-xs font-bold text-white tracking-widest uppercase mb-6">Support</h3>
                <ul role="list" className="space-y-4">
                  <li><Link href="#donate" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Donate (Sadaqah)</Link></li>
                  <li><Link href="/privacy" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Agency Credit */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 flex items-center gap-1">
            &copy; {currentYear} HifzTracker. Built with <Heart className="h-3 w-3 text-emerald-500 fill-emerald-500" /> for the Ummah.
          </p>
          <div className="flex items-center gap-2">
          </div>
        </div>
      </div>
    </footer>
  );
}