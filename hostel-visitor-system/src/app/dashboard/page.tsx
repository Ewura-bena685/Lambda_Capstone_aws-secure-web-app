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
  createdAt: string;
};

export default function DashboardPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active">("all");
  const [checkingOutId, setCheckingOutId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const status = filter === "active" ? "active" : "all";
    fetch(`/api/visits?status=${status}`)
      .then((r) => r.json())
      .then((data) => setVisits(Array.isArray(data) ? data : []))
      .catch(() => setVisits([]))
      .finally(() => setLoading(false));
  }, [filter]);

  async function handleCheckOut(id: string) {
    setCheckingOutId(id);
    try {
      const res = await fetch(`/api/visits/${id}/checkout`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Check-out failed");
        return;
      }
      setVisits((prev) =>
        prev.map((v) =>
          v.id === id
            ? { ...v, isActive: false, checkOutAt: new Date().toISOString() }
            : v
        )
      );
    } finally {
      setCheckingOutId(null);
    }
  }

  const activeCount = visits.filter((v) => v.isActive).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-white to-violet-50/30">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-0 border-b border-white/40">
        <div className="max-w-[var(--container-max)] mx-auto pl-2 pr-4 sm:pl-3 sm:pr-6 py-4 flex items-center justify-between">
          <VMSLogo href="/" showBackArrow className="text-base font-medium" />
          <span className="text-stone-500 text-sm font-medium">Dashboard</span>
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
          </nav>
        </div>
      </header>

      <main className="container-app pt-[4.5rem] pb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Visitor log
            </h1>
            <p className="text-stone-500 text-sm mt-0.5">
              View and manage current and past visits.
            </p>
          </div>
          <div className="flex items-center gap-2 p-1 rounded-app-lg glass-card">
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-app text-sm font-medium transition-all ${
                filter === "active"
                  ? "bg-teal-500 text-white shadow-md shadow-teal-500/25"
                  : "text-stone-600 hover:text-teal-600 hover:bg-white/60"
              }`}
            >
              Active {filter === "active" ? `(${visits.length})` : `(${activeCount})`}
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-app text-sm font-medium transition-all ${
                filter === "all"
                  ? "bg-violet-500 text-white shadow-md shadow-violet-500/25"
                  : "text-stone-600 hover:text-violet-600 hover:bg-white/60"
              }`}
            >
              All
            </button>
          </div>
        </div>

        {loading ? (
          <div className="glass-card card p-10 text-center">
            <p className="text-stone-500 font-medium">Loading…</p>
          </div>
        ) : visits.length === 0 ? (
          <div className="glass-card card p-10 text-center">
            <p className="font-semibold text-stone-800">No visits yet</p>
            <p className="text-stone-500 text-sm mt-1">
              {filter === "active" ? "No active visitors." : "No visit records."}
            </p>
            <Link href="/check-in" className="mt-6 inline-block rounded-app-lg px-5 py-2.5 font-semibold bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/25 hover:from-teal-500 hover:to-teal-600 transition-all">
              Check in a visitor
            </Link>
          </div>
        ) : (
          <div className="glass-card card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50/80">
                    <th className="px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Visitor
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Visiting
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Purpose
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Check-in
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Check-out
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider w-28">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((v) => (
                    <tr
                      key={v.id}
                      className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-medium text-stone-900">
                        {v.visitorName}
                      </td>
                      <td className="px-5 py-3.5 text-stone-600 text-sm">
                        {v.visitorPhone}
                      </td>
                      <td className="px-5 py-3.5 text-stone-600 text-sm">
                        {v.hostName}
                      </td>
                      <td className="px-5 py-3.5 text-stone-600 text-sm">
                        {v.roomNumber || "—"}
                      </td>
                      <td className="px-5 py-3.5 text-stone-500 text-sm">
                        {v.purpose || "—"}
                      </td>
                      <td className="px-5 py-3.5 text-stone-500 text-sm whitespace-nowrap">
                        {format(new Date(v.checkInAt), "PPp")}
                      </td>
                      <td className="px-5 py-3.5 text-stone-500 text-sm whitespace-nowrap">
                        {v.checkOutAt
                          ? format(new Date(v.checkOutAt), "PPp")
                          : v.isActive ? (
                              <span className="badge-success">Active</span>
                            ) : (
                              "—"
                            )}
                      </td>
                      <td className="px-5 py-3.5">
                        {v.isActive && (
                          <button
                            onClick={() => handleCheckOut(v.id)}
                            disabled={checkingOutId === v.id}
                            className="text-xs py-1.5 px-3 rounded-app font-medium border border-amber-200 bg-amber-50/80 text-amber-800 hover:bg-amber-100 disabled:opacity-50 transition-colors"
                          >
                            {checkingOutId === v.id ? "…" : "Check out"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
