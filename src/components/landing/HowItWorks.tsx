'use client';

import { UserPlus, ClipboardCheck, LayoutDashboard } from "lucide-react";
import Link from "next/link"; // 🚀 Import Link

const steps = [
  {
    name: "Create an Account",
    description: "Create your secure account with just an email and password. No complicated setup—get started in seconds.",
    icon: UserPlus,
    href: "/login", // 🚀 Add the destination
  },
  {
    name: "Log Daily Progress",
    description: "Enter the Surah and Ayah range you recited. It takes less than 30 seconds to update your stats.",
    icon: ClipboardCheck,
  },
  {
    name: "Visualize Growth",
    description: "Watch your streak grow and see your Heatmap fill up green as you build your consistency.",
    icon: LayoutDashboard,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-slate-50 pt-32 pb-24 -mt-12 rounded-t-[3rem] z-20">
      
      {/* 1. Top Border Accent (The Bridge) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-emerald-500/20 rounded-b-full" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-bold leading-7 text-emerald-600 uppercase tracking-widest">
            Simplicity for the Ummah
          </h2>
          <p className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Start Your Journey in <span className="text-emerald-600">3 Steps</span>
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            We stripped away the complexity. No ads, no distractions—just you and the Quran.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-3 relative">
            
            {/* 2. Desktop Connector Line (The Path) */}
            <div className="hidden lg:block absolute top-12 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-emerald-200 -z-10" />

            {steps.map((step, index) => {
              // 🚀 Create a wrapper component logic
              const content = (
                <div className={`relative flex flex-col items-center text-center group ${step.href ? 'cursor-pointer' : ''}`}>
                  {/* Step Icon Wrapper */}
                  <div className="relative mb-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-emerald-600 shadow-xl shadow-emerald-900/5 ring-1 ring-emerald-100 transition-all duration-300 group-hover:-translate-y-2 group-hover:ring-emerald-500 group-hover:shadow-emerald-900/10">
                      <step.icon className="h-10 w-10" aria-hidden="true" />
                    </div>
                    {/* Step Number Badge */}
                    <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white shadow-lg border-2 border-white">
                      {index + 1}
                    </div>
                  </div>
                  
                  <dt className={`text-xl font-bold leading-7 text-slate-900 ${step.href ? 'group-hover:text-emerald-600 transition-colors' : ''}`}>
                    {step.name}
                    {step.href && <span className="block text-[10px] text-emerald-500 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Click to Start</span>}
                  </dt>
                  
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">{step.description}</p>
                  </dd>
                </div>
              );

              // 🚀 Wrap in Link if href exists, otherwise just return content
              return (
                <div key={step.name}>
                  {step.href ? (
                    <Link href={step.href}>
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}