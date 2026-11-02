"use client";

import { useState, useEffect } from "react";
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
  isNotified: boolean;
  isCollected: boolean;
};

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [collectingId, setCollectingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    residentName: "",
    residentPhone: "",
    roomNumber: "",
    senderName: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function load() {
    setLoading(true);
    const q = filter === "pending" ? "?collected=false" : "";
    fetch(`/api/packages${q}`)
      .then((r) => r.json())
      .then((data) => setPackages(Array.isArray(data) ? data : []))
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => load(), [filter]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!form.residentName.trim() || !form.residentPhone.trim() || !form.roomNumber.trim() || !form.senderName.trim())
      return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          residentName: form.residentName,
          residentPhone: form.residentPhone,
          roomNumber: form.roomNumber,
          senderName: form.senderName,
          description: form.description || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to register package");
        return;
      }
      setForm({ residentName: "", residentPhone: "", roomNumber: "", senderName: "", description: "" });
      setShowForm(false);
      load();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleNotify(id: string) {
    setNotifyingId(id);
    try {
      const res = await fetch(`/api/packages/${id}/notify`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to send alert");
        return;
      }
      setPackages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isNotified: true, notifiedAt: new Date().toISOString() } : p))
      );
    } finally {
      setNotifyingId(null);
    }
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
      if (filter === "pending") load();
    } finally {
      setCollectingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-white to-violet-50/30">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-0 border-b border-white/40">
        <div className="max-w-[var(--container-max)] mx-auto pl-2 pr-4 sm:pl-3 sm:pr-6 py-4 flex items-center justify-between">
          <VMSLogo href="/" showBackArrow className="text-base font-medium" />
          <span className="text-stone-500 text-sm font-medium">Packages (Porter)</span>
          <nav className="flex items-center gap-1">
            <Link href="/check-in" className="px-3 py-2 rounded-app text-sm font-medium text-stone-600 hover:text-teal-600 hover:bg-white/60 transition-colors">
              Check in
            </Link>
            <Link href="/check-out" className="px-3 py-2 rounded-app text-sm font-medium text-stone-600 hover:text-violet-600 hover:bg-white/60 transition-colors">
              Check out
            </Link>
            <Link href="/dashboard" className="px-3 py-2 rounded-app text-sm font-medium text-stone-600 hover:text-teal-600 hover:bg-white/60 transition-colors">
              Dashboard
            </Link>
            <Link href="/packages/for-me" className="px-3 py-2 rounded-app text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors">
              My packages
            </Link>
          </nav>
        </div>
      </header>

      <main className="container-app pt-[4.5rem] pb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Package log
            </h1>
            <p className="text-stone-500 text-sm mt-0.5">
              Register packages left at the desk. Send alert to resident, then mark collected when they pick up.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 p-1 rounded-app-lg glass-card">
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-app text-sm font-medium transition-all ${
                  filter === "pending" ? "bg-amber-500 text-white shadow-md shadow-amber-500/25" : "text-stone-600 hover:text-amber-600 hover:bg-white/60"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-app text-sm font-medium transition-all ${
                  filter === "all" ? "bg-stone-600 text-white shadow-md" : "text-stone-600 hover:bg-white/60"
                }`}
              >
                All
              </button>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 rounded-app-lg font-semibold bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/25 hover:from-teal-500 hover:to-teal-600 transition-all"
            >
              Register package
            </button>
          </div>
        </div>

        {showForm && (
          <div className="glass-card card p-6 mb-8">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Register new package</h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-base">Resident name</label>
                  <input
                    type="text"
                    value={form.residentName}
                    onChange={(e) => setForm((f) => ({ ...f, residentName: e.target.value }))}
                    required
                    className="input-base"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="label-base">Resident phone (for alert)</label>
                  <input
                    type="tel"
                    value={form.residentPhone}
                    onChange={(e) => setForm((f) => ({ ...f, residentPhone: e.target.value }))}
                    required
                    className="input-base"
                    placeholder="e.g. 0244123456"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-base">Room number</label>
                  <input
                    type="text"
                    value={form.roomNumber}
                    onChange={(e) => setForm((f) => ({ ...f, roomNumber: e.target.value }))}
                    required
                    className="input-base"
                    placeholder="e.g. 101"
                  />
                </div>
                <div>
                  <label className="label-base">Sender / carrier name</label>
                  <input
                    type="text"
                    value={form.senderName}
                    onChange={(e) => setForm((f) => ({ ...f, senderName: e.target.value }))}
                    required
                    className="input-base"
                    placeholder="e.g. DHL, Jane Smith"
                  />
                </div>
              </div>
              <div>
                <label className="label-base">Description (optional)</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="input-base"
                  placeholder="e.g. Small box, fragile"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary rounded-app-lg px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white disabled:opacity-50"
                >
                  {submitting ? "Saving…" : "Save package"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-app-lg border border-stone-300 text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="glass-card card p-10 text-center">
            <p className="text-stone-500 font-medium">Loading…</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="glass-card card p-10 text-center">
            <p className="font-semibold text-stone-800">
              {filter === "pending" ? "No pending packages" : "No packages yet"}
            </p>
            <p className="text-stone-500 text-sm mt-1">
              {filter === "pending" ? "All packages have been collected." : "Register a package to get started."}
            </p>
            {filter === "pending" && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-6 inline-block rounded-app-lg px-5 py-2.5 font-semibold bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/25"
              >
                Register package
              </button>
            )}
          </div>
        ) : (
          <ul className="space-y-3">
            {packages.map((p) => (
              <li key={p.id} className="glass-card card p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-stone-900">
                    For {p.residentName} · Room {p.roomNumber}
                  </p>
                  <p className="text-sm text-stone-500 mt-0.5">
                    From {p.senderName}
                    {p.description ? ` · ${p.description}` : ""}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    Received {format(new Date(p.receivedAt), "PPp")}
                    {p.notifiedAt && ` · Alert sent ${format(new Date(p.notifiedAt), "PP")}`}
                    {p.collectedAt && ` · Collected ${format(new Date(p.collectedAt), "PP")}`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!p.isNotified && (
                    <button
                      onClick={() => handleNotify(p.id)}
                      disabled={notifyingId === p.id}
                      className="px-3 py-1.5 rounded-app text-sm font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 disabled:opacity-50"
                    >
                      {notifyingId === p.id ? "Sending…" : "Send alert to resident"}
                    </button>
                  )}
                  {!p.isCollected && (
                    <button
                      onClick={() => handleCollect(p.id)}
                      disabled={collectingId === p.id}
                      className="px-3 py-1.5 rounded-app text-sm font-medium bg-emerald-100 text-emerald-800 hover:bg-emerald-200 disabled:opacity-50"
                    >
                      {collectingId === p.id ? "…" : "Mark collected"}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
