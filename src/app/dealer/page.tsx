"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Car, FileText, Calendar, LogOut, DollarSign, CheckCircle2 } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { createCheckoutSession } from "@/actions/stripe";

interface Invoice {
  id: string;
  dealerId: string;
  dealershipName: string;
  amount: number;
  description: string;
  status: string;
  createdAt: any;
}

export default function DealerPortal() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"schedule" | "billing">("schedule");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "invoices"), 
        where("dealerId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setInvoices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Invoice[]);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const outstandingBalance = invoices.filter(i => i.status === 'pending').reduce((a, b) => a + b.amount, 0);

  const handlePayNow = async (invoice: Invoice) => {
    setPayingInvoiceId(invoice.id);
    try {
      const result = await createCheckoutSession(
        invoice.id,
        invoice.amount,
        user?.email || "",
        invoice.description
      );

      if (result.url) {
        window.location.href = result.url; // Redirect to Stripe
      } else {
        alert("Payment Error: " + result.error);
        setPayingInvoiceId(null);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setPayingInvoiceId(null);
    }
  };

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
            <button 
              onClick={() => setActiveTab("schedule")}
              className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition ${activeTab === 'schedule' ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Calendar className="w-5 h-5 mr-3" /> Schedule Service
            </button>
            <button 
              onClick={() => setActiveTab("billing")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition ${activeTab === 'billing' ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <div className="flex items-center"><FileText className="w-5 h-5 mr-3" /> Billing</div>
              {outstandingBalance > 0 && (
                <span className="bg-amber-500 text-slate-950 text-xs px-2 py-0.5 rounded-full font-bold">
                  ${outstandingBalance}
                </span>
              )}
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to the Dealer Portal</h1>
            <p className="text-slate-400 mb-8">Manage your reconditioning workflow, schedule bulk services, and pay invoices.</p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h3 className="text-slate-400 font-medium text-sm mb-1">Outstanding Balance</h3>
                <p className={`text-3xl font-bold ${outstandingBalance > 0 ? 'text-amber-400' : 'text-white'}`}>
                  ${outstandingBalance.toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h3 className="text-slate-400 font-medium text-sm mb-1">Cars Restored (YTD)</h3>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
            </div>

            {activeTab === 'schedule' && (
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
            )}

            {activeTab === 'billing' && (
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <h2 className="text-xl font-bold text-white mb-6">Your Invoices</h2>
                <div className="space-y-4">
                  {invoices.length === 0 ? (
                    <div className="text-slate-500 text-center py-8 border-2 border-dashed border-slate-800 rounded-lg">
                      No invoices found.
                    </div>
                  ) : (
                    invoices.map(invoice => (
                      <div key={invoice.id} className="bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-lg font-bold text-white">{invoice.description}</h3>
                          <p className="text-slate-400 text-sm">Amount: <strong className="text-white">${invoice.amount.toFixed(2)}</strong></p>
                        </div>
                        <div>
                          {invoice.status === 'paid' ? (
                            <span className="flex items-center text-emerald-400 font-bold bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20">
                              <CheckCircle2 className="w-5 h-5 mr-2" /> Paid
                            </span>
                          ) : (
                            <button 
                              onClick={() => handlePayNow(invoice)}
                              disabled={payingInvoiceId === invoice.id}
                              className="flex items-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2 rounded-lg transition disabled:opacity-50"
                            >
                              {payingInvoiceId === invoice.id ? 'Redirecting...' : <><DollarSign className="w-4 h-4 mr-2" /> Pay Now</>}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
