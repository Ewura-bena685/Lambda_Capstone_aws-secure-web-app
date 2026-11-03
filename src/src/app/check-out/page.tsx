"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { VMSLogo } from "@/components/VMSLogo";

type Visit = {
  id: string;
  visitorName: string;
  visitorPhone: string;
  hostName: string;
  roomNumber: string;
  purpose: string;
  checkInAt: string;
  checkOutAt: string | null;
  isActive: boolean;
};

export default function CheckOutPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOutId, setCheckingOutId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/visits?status=active")
      .then((r) => r.json())
      .then((data) => setVisits(Array.isArray(data) ? data : []))
      .catch(() => setVisits([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleCheckOut(id: string) {
    setCheckingOutId(id);
    try {
      const res = await fetch(`/api/visits/${id}/checkout`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Check-out failed");
        return;
      }
      setVisits((prev) => prev.filter((v) => v.id !== id));
    } finally {
      setCheckingOutId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-white to-violet-50/30">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-0 border-b border-white/40">
        <div className="max-w-[var(--container-max)] mx-auto pl-2 pr-4 sm:pl-3 sm:pr-6 py-4 flex items-center justify-between">
          <VMSLogo href="/" showBackArrow className="text-base font-medium" />
          <nav className="flex items-center gap-1">
            <Link
              href="/check-in"
              className="px-3 py-2 rounded-app text-sm font-medium text-stone-600 hover:text-teal-600 hover:bg-white/60 transition-colors"
            >
              Check in
            </Link>
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-app text-sm font-medium text-stone-600 hover:text-violet-600 hover:bg-white/60 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/packages"
              className="px-3 py-2 rounded-app text-sm font-medium text-stone-600 hover:text-amber-600 hover:bg-white/60 transition-colors"
            >
              Packages
            </Link>
          </nav>
        </div>
      </header>

      <main className="container-app pt-[4.5rem] pb-10">
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight mb-2">
          Visitor check-out
        </h1>
        <p className="text-stone-500 mb-8">
          Select a visitor to check them out when they leave.
        </p>

        {loading ? (
          <div className="glass-card card p-8 text-center">
            <p className="text-stone-500 font-medium">Loading…</p>
          </div>
        ) : visits.length === 0 ? (
          <div className="glass-card card p-10 text-center">
            <p className="font-semibold text-stone-800">No active visitors</p>
            <p className="text-stone-500 text-sm mt-1">Everyone is checked out.</p>
            <Link href="/check-in" className="mt-6 inline-block rounded-app-lg px-5 py-2.5 font-semibold bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/25 hover:from-teal-500 hover:to-teal-600 transition-all">
              Check in a visitor
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {visits.map((v) => (
              <li
                key={v.id}
                className="glass-card card p-5 flex items-center justify-between gap-4 flex-wrap transition-all"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-stone-900">{v.visitorName}</p>
                  <p className="text-sm text-stone-500 mt-0.5">
                    {v.visitorPhone} · Visiting {v.hostName}, Room {v.roomNumber || "—"}
                    {v.purpose ? ` · ${v.purpose}` : ""}
                  </p>
                  <p className="text-xs text-stone-400 mt-1.5">
                    In: {format(new Date(v.checkInAt), "PPp")}
                  </p>
                </div>
                <button
                  onClick={() => handleCheckOut(v.id)}
                  disabled={checkingOutId === v.id}
                  className="flex-shrink-0 text-sm py-2 rounded-app-lg font-medium px-4 border-2 border-amber-200 bg-amber-50/80 text-amber-800 hover:bg-amber-100 hover:border-amber-300 disabled:opacity-50 transition-colors"
                >
                  {checkingOutId === v.id ? "Checking out…" : "Check out"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
