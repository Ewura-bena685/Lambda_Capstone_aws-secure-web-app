"use client";

import Link from "next/link";
import { Typewriter } from "@/components/Typewriter";
import { VMSLogo } from "@/components/VMSLogo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white via-40% to-violet-50 to-90% relative overflow-hidden">
      {/* Subtle background orbs for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-teal-200/30 blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-violet-200/25 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full bg-amber-100/40 blur-3xl" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 glass border-0 border-b border-white/40">
        <div className="max-w-[var(--container-max)] mx-auto pl-2 pr-4 sm:pl-3 sm:pr-6 py-4 flex items-center justify-between">
          <VMSLogo href="/" className="text-lg" />
          <nav className="flex items-center gap-1">
            <Link
              href="/check-in"
              className="px-3 py-2 rounded-app text-sm font-medium text-stone-600 hover:text-teal-600 hover:bg-white/60 transition-colors"
            >
              Check in
            </Link>
            <Link
              href="/check-out"
              className="px-3 py-2 rounded-app text-sm font-medium text-stone-600 hover:text-violet-600 hover:bg-white/60 transition-colors"
            >
              Check out
            </Link>
            <Link
              href="/packages"
              className="px-3 py-2 rounded-app text-sm font-medium text-stone-600 hover:text-amber-600 hover:bg-white/60 transition-colors"
            >
              Packages
            </Link>
            <Link
              href="/dashboard"
              className="ml-2 px-4 py-2 rounded-app text-sm font-semibold bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/25 hover:from-teal-500 hover:to-teal-600 transition-all"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="container-app pt-[4.5rem] pb-16 md:pt-24 md:pb-24 relative">
        <div className="max-w-2xl mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight text-balance mb-4 min-h-[1.2em]">
            <Typewriter
              text="Visitor management system."
              speed={50}
              className="inline"
              cursorClassName="bg-teal-500"
            />
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed mt-2">
            Check in online with your details, who you&apos;re visiting, and room number. Check out when you leave. Porters can register packages and send alerts to residents.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          <Link
            href="/check-in"
            className="group block p-6 rounded-app-2xl glass-card transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
          >
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-app-lg bg-gradient-to-br from-teal-400 to-teal-600 text-white text-xl shadow-lg shadow-teal-500/30 mb-4 group-hover:shadow-teal-500/40 transition-shadow">
              📝
            </span>
            <h2 className="text-lg font-semibold text-stone-900 mb-2 group-hover:text-teal-700 transition-colors">
              Check in
            </h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Register your visit: name, phone, who you&apos;re visiting, room number, and time.
            </p>
          </Link>
          <Link
            href="/check-out"
            className="group block p-6 rounded-app-2xl glass-card transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
          >
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-app-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xl shadow-lg shadow-amber-500/30 mb-4 group-hover:shadow-amber-500/40 transition-shadow">
              👋
            </span>
            <h2 className="text-lg font-semibold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors">
              Check out
            </h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Sign out when you leave. Select your visit and confirm check-out.
            </p>
          </Link>
          <Link
            href="/dashboard"
            className="group block p-6 rounded-app-2xl glass-card transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
          >
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-app-lg bg-gradient-to-br from-violet-400 to-violet-600 text-white text-xl shadow-lg shadow-violet-500/30 mb-4 group-hover:shadow-violet-500/40 transition-shadow">
              📋
            </span>
            <h2 className="text-lg font-semibold text-stone-900 mb-2 group-hover:text-violet-700 transition-colors">
              Dashboard
            </h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              View active visitors and visit history. For reception and security.
            </p>
          </Link>
          <Link
            href="/packages"
            className="group block p-6 rounded-app-2xl glass-card transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
          >
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-app-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xl shadow-lg shadow-amber-500/30 mb-4 group-hover:shadow-amber-500/40 transition-shadow">
              📦
            </span>
            <h2 className="text-lg font-semibold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors">
              Packages (staff)
            </h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Register packages left at the desk. Send alert to resident&apos;s phone, mark collected.
            </p>
          </Link>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/check-in"
            className="inline-flex items-center rounded-app-lg px-6 py-3 text-base font-semibold bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/25 hover:from-teal-500 hover:to-teal-600 hover:shadow-teal-500/30 transition-all"
          >
            Check in as visitor
          </Link>
          <Link
            href="/packages/for-me"
            className="inline-flex items-center rounded-app-lg px-6 py-3 text-base font-medium bg-amber-50 border-2 border-amber-200 text-amber-800 hover:bg-amber-100 hover:border-amber-300 transition-all"
          >
            My packages
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-app-lg border-2 border-stone-300 bg-white/80 backdrop-blur-sm px-6 py-3 text-base font-medium text-stone-700 hover:bg-white hover:border-teal-300 hover:text-teal-700 transition-all"
          >
            Open dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
