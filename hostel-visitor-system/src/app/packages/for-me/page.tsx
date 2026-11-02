"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { VMSLogo } from "@/components/VMSLogo";

type Package = {
  id: string;
  residentName: string;
  residentPhone: string;
  roomNumber: string;
  senderName: string;
  description: string;
  receivedAt: string;
  notifiedAt: string | null;
  collectedAt: string | null;
  isCollected: boolean;
};

export default function MyPackagesPage() {
  const [phone, setPhone] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [collectingId, setCollectingId] = useState<string | null>(null);

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setSearched(true);
    fetch(`/api/packages?phone=${encodeURIComponent(phone.trim())}`)
      .then((r) => r.json())
      .then((data) => setPackages(Array.isArray(data) ? data : []))
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }

  async function handleCollect(id: string) {
    setCollectingId(id);
    try {
      const res = await fetch(`/api/packages/${id}/collect`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to mark collected");
        return;
      }
      setPackages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isCollected: true, collectedAt: new Date().toISOString() } : p))
      );
    } finally {
      setCollectingId(null);
    }
  }

  const pending = packages.filter((p) => !p.isCollected);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-white to-violet-50/30">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-0 border-b border-white/40">
        <div className="max-w-[var(--container-max)] mx-auto pl-2 pr-4 sm:pl-3 sm:pr-6 py-4 flex items-center justify-between">
          <VMSLogo href="/" showBackArrow className="text-base font-medium" />
          <nav className="flex items-center gap-1">
            <Link href="/check-in" className="px-3 py-2 rounded-app text-sm font-medium text-stone-600 hover:text-teal-600 hover:bg-white/60 transition-colors">
              Check in
            </Link>
            <Link href="/check-out" className="px-3 py-2 rounded-app text-sm font-medium text-stone-600 hover:text-violet-600 hover:bg-white/60 transition-colors">
              Check out
            </Link>
            <Link href="/packages" className="px-3 py-2 rounded-app text-sm font-medium text-stone-600 hover:text-amber-600 hover:bg-white/60 transition-colors">
              Packages (staff)
            </Link>
          </nav>
        </div>
      </header>

      <main className="container-app pt-[4.5rem] pb-10 max-w-lg">
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight mb-2">
          My packages
        </h1>
        <p className="text-stone-500 mb-8">
          Enter your phone number to see packages waiting for you. Mark as collected when you pick them up.
        </p>

        <form onSubmit={handleLookup} className="glass-card card p-6 mb-8">
          <label className="label-base">Your phone number</label>
          <div className="flex gap-2 mt-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="input-base flex-1"
              placeholder="e.g. 0244123456"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-app-lg font-semibold bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/25 hover:from-teal-500 hover:to-teal-600 disabled:opacity-50 transition-all"
            >
              {loading ? "Looking up…" : "Look up"}
            </button>
          </div>
        </form>

        {searched && (
          <>
            {loading ? (
              <p className="text-stone-500 font-medium">Loading…</p>
            ) : packages.length === 0 ? (
              <div className="glass-card card p-8 text-center">
                <p className="font-semibold text-stone-800">No packages found</p>
                <p className="text-stone-500 text-sm mt-1">No packages are registered for this number.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pending.length > 0 && (
                  <>
                    <h2 className="text-lg font-semibold text-stone-900">Waiting for you ({pending.length})</h2>
                    <ul className="space-y-3">
                      {pending.map((p) => (
                        <li key={p.id} className="glass-card card p-5">
                          <p className="font-semibold text-stone-900">
                            From {p.senderName}
                            {p.description ? ` · ${p.description}` : ""}
                          </p>
                          <p className="text-sm text-stone-500 mt-0.5">
                            Room {p.roomNumber} · Received {format(new Date(p.receivedAt), "PPp")}
                          </p>
                          <button
                            onClick={() => handleCollect(p.id)}
                            disabled={collectingId === p.id}
                            className="mt-3 px-3 py-1.5 rounded-app text-sm font-medium bg-emerald-100 text-emerald-800 hover:bg-emerald-200 disabled:opacity-50"
                          >
                            {collectingId === p.id ? "…" : "I collected this"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {packages.filter((p) => p.isCollected).length > 0 && (
                  <>
                    <h2 className="text-lg font-semibold text-stone-700 mt-6">Already collected</h2>
                    <ul className="space-y-2">
                      {packages
                        .filter((p) => p.isCollected)
                        .map((p) => (
                          <li key={p.id} className="glass-card card p-4 opacity-80">
                            <p className="font-medium text-stone-700">
                              From {p.senderName}
                              {p.description ? ` · ${p.description}` : ""}
                            </p>
                            <p className="text-xs text-stone-500 mt-0.5">
                              Collected {p.collectedAt && format(new Date(p.collectedAt), "PPp")}
                            </p>
                          </li>
                        ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
