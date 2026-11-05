"use client";

import { useState } from "react";
import Link from "next/link";
import { VMSLogo } from "@/components/VMSLogo";
import { format } from "date-fns";

export default function CheckInPage() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ visitorName: string; hostName: string; roomNumber: string } | null>(null);
  const [form, setForm] = useState({
    visitorName: "",
    visitorPhone: "",
    hostName: "",
    roomNumber: "",
    purpose: "",
    timeOfVisit: "", // optional; empty = now
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.visitorName.trim() || !form.visitorPhone.trim() || !form.hostName.trim() || !form.roomNumber.trim())
      return;
    setLoading(true);
    try {
      const res = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorName: form.visitorName,
          visitorPhone: form.visitorPhone,
          hostName: form.hostName,
          roomNumber: form.roomNumber,
          purpose: form.purpose || undefined,
          timeOfVisit: form.timeOfVisit || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Check-in failed");
        return;
      }
      setDone({
        visitorName: data.visitorName,
        hostName: data.hostName,
        roomNumber: data.roomNumber,
      });
      setForm({
        visitorName: "",
        visitorPhone: "",
        hostName: "",
        roomNumber: "",
        purpose: "",
        timeOfVisit: "",
      });
    } finally {
      setLoading(false);
    }
  }

  const visitTimeDisplay = form.timeOfVisit
    ? format(new Date(form.timeOfVisit), "PPp")
    : format(new Date(), "PPp");

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-white to-violet-50/30">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-0 border-b border-white/40">
        <div className="max-w-[var(--container-max)] mx-auto pl-2 pr-4 sm:pl-3 sm:pr-6 py-4 flex items-center justify-between">
          <VMSLogo href="/" showBackArrow className="text-base font-medium" />
          <nav className="flex items-center gap-1">
            <Link
              href="/check-out"
              className="px-3 py-2 rounded-app text-sm font-medium text-stone-600 hover:text-violet-600 hover:bg-white/60 transition-colors"
            >
              Check out
            </Link>
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-app text-sm font-medium text-stone-600 hover:text-teal-600 hover:bg-white/60 transition-colors"
            >
              Dashboard Auto Deploy
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

      <main className="container-app pt-[4.5rem] pb-10 max-w-lg">
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight mb-2">
          Visitor check-in
        </h1>
        <p className="text-stone-500 mb-8">
          Enter your details to register your visit. Time of visit is recorded when you submit (or choose below).
        </p>

        {done && (
          <div className="mb-8 p-5 rounded-app-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800">
            <p className="font-semibold">Check-in recorded</p>
            <p className="text-sm mt-1 text-emerald-700">
              {done.visitorName} → visiting {done.hostName}, Room {done.roomNumber}. Please check out when you leave.
            </p>
            <button
              type="button"
              onClick={() => setDone(null)}
              className="mt-4 text-sm font-medium text-emerald-700 hover:underline"
            >
              Add another visitor
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card card p-6 md:p-8 space-y-5">
          <div className="p-3 rounded-app-lg bg-stone-50 border border-stone-200 text-sm text-stone-600">
            Time of visit: <strong className="text-stone-800">{visitTimeDisplay}</strong>
            {!form.timeOfVisit && <span className="text-stone-500"> (now)</span>}
          </div>
          <div>
            <label className="label-base">Your name</label>
            <input
              type="text"
              value={form.visitorName}
              onChange={(e) => setForm((f) => ({ ...f, visitorName: e.target.value }))}
              required
              className="input-base"
              placeholder="e.g. Jane Smith"
            />
          </div>
          <div>
            <label className="label-base">Your phone number</label>
            <input
              type="tel"
              value={form.visitorPhone}
              onChange={(e) => setForm((f) => ({ ...f, visitorPhone: e.target.value }))}
              required
              className="input-base"
              placeholder="e.g. 0244123456"
            />
          </div>
          <div>
            <label className="label-base">Who are you visiting?</label>
            <input
              type="text"
              value={form.hostName}
              onChange={(e) => setForm((f) => ({ ...f, hostName: e.target.value }))}
              required
              className="input-base"
              placeholder="Name of person or department"
            />
          </div>
          <div>
            <label className="label-base">Room number</label>
            <input
              type="text"
              value={form.roomNumber}
              onChange={(e) => setForm((f) => ({ ...f, roomNumber: e.target.value }))}
              required
              className="input-base"
              placeholder="e.g. 101, Block A-12"
            />
          </div>
          <div>
            <label className="label-base">Purpose of visit (optional)</label>
            <input
              type="text"
              value={form.purpose}
              onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
              className="input-base"
              placeholder="e.g. Meeting, delivery"
            />
          </div>
          <div>
            <label className="label-base">Time of visit (optional)</label>
            <input
              type="datetime-local"
              value={form.timeOfVisit}
              onChange={(e) => setForm((f) => ({ ...f, timeOfVisit: e.target.value }))}
              className="input-base"
            />
            <p className="text-xs text-stone-500 mt-1">Leave empty to use current time.</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-app-lg font-semibold bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/25 hover:from-teal-500 hover:to-teal-600 disabled:opacity-50 transition-all"
          >
            {loading ? "Checking in…" : "Check in"}
          </button>
        </form>

        <p className="mt-8 text-center text-stone-500 text-sm">
          When you leave, go to{" "}
          <Link href="/check-out" className="text-teal-600 font-medium hover:text-teal-700 hover:underline">
            Check out
          </Link>{" "}
          to sign out.
        </p>
      </main>
    </div>
  );
}
