"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Car, FileText, Calendar, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";

export default function DealerPortal() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <div className="p-8 text-slate-400">Loading portal...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-8">
        <Link href="/" className="font-bold text-lg text-white flex items-center">
          <span className="text-amber-400 mr-2">⚡</span> CLEAR HEADLIGHTS | DEALER
        </Link>
        <button 
          onClick={() => signOut(auth)}
          className="text-slate-400 hover:text-white flex items-center text-sm font-medium transition"
        >
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </button>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 hidden md:block">
          <nav className="space-y-2">
            <a href="#" className="flex items-center px-4 py-3 bg-amber-500/10 text-amber-500 rounded-lg font-medium">
              <Calendar className="w-5 h-5 mr-3" /> Schedule Service
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition">
              <Car className="w-5 h-5 mr-3" /> Service History
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition">
              <FileText className="w-5 h-5 mr-3" /> Billing & Invoices
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to the Dealer Portal</h1>
            <p className="text-slate-400 mb-8">Manage your reconditioning workflow, schedule bulk services, and pay invoices.</p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h3 className="text-slate-400 font-medium text-sm mb-1">Active Requests</h3>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h3 className="text-slate-400 font-medium text-sm mb-1">Outstanding Balance</h3>
                <p className="text-3xl font-bold text-white">$0.00</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h3 className="text-slate-400 font-medium text-sm mb-1">Cars Restored (YTD)</h3>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden h-[700px] relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <p className="text-slate-500">Loading Calendar...</p>
              </div>
              <iframe 
                src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2wj_MPuipVnuRsVgwyMSv5jPZfVrekqICPJyiapzz3w5336ykdtJElsKavW9bZUm1ou79Fkqv7?gv=true" 
                style={{ border: 0 }} 
                width="100%" 
                height="100%" 
                className="absolute inset-0 z-10 bg-white"
                title="Schedule Service"
              ></iframe>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
