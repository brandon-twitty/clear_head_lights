"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Car, FileText, Calendar, LogOut, DollarSign, CheckCircle2, X } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { collection, query, where, orderBy, onSnapshot, doc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";
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

interface Appointment {
  id: string;
  dealerId: string;
  dealershipName: string;
  address: string;
  carsCount: number;
  status: string;
  createdAt: any;
}

export default function DealerPortal() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"schedule" | "billing" | "appointments">("schedule");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleStep, setScheduleStep] = useState<"form" | "calendar">("form");
  const [serviceAddress, setServiceAddress] = useState("");
  const [carsCount, setCarsCount] = useState("");
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getDoc(doc(db, "users", user.uid)).then(d => {
        if (d.exists()) {
          setUserData(d.data());
          if (d.data().address) {
            setServiceAddress(d.data().address);
          }
        }
      });

      const q = query(
        collection(db, "invoices"), 
        where("dealerId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      
      const unsubscribeInvoices = onSnapshot(q, (snapshot) => {
        setInvoices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Invoice[]);
      });

      const appointmentsQuery = query(
        collection(db, "appointments"),
        where("dealerId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const unsubscribeAppointments = onSnapshot(appointmentsQuery, (snapshot) => {
        setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[]);
      });

      return () => {
        unsubscribeInvoices();
        unsubscribeAppointments();
      };
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
            {appointments.length > 0 && (
              <button 
                onClick={() => setActiveTab("appointments")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition ${activeTab === 'appointments' ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <div className="flex items-center"><Calendar className="w-5 h-5 mr-3" /> Appointments</div>
                <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full font-bold">
                  {appointments.length}
                </span>
              </button>
            )}
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
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 text-center h-[400px] flex flex-col items-center justify-center">
                <Calendar className="w-16 h-16 text-amber-500 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Schedule an On-Lot Visit</h2>
                <p className="text-slate-400 mb-8 max-w-md">Book a time for our mobile technicians to come to your dealership and restore your inventory.</p>
                <button 
                  onClick={() => setShowScheduleModal(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-lg px-8 py-4 rounded-xl transition shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                >
                  Schedule Visit
                </button>
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

            {activeTab === 'appointments' && (
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <h2 className="text-xl font-bold text-white mb-6">Your Appointments</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {appointments.map(apt => (
                    <div key={apt.id} className="bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col justify-between hover:border-amber-500/30 transition group">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-white font-bold text-lg flex items-center">
                            <Car className="w-5 h-5 mr-2 text-amber-500" />
                            {apt.carsCount} Cars Planned
                          </p>
                          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                            Pending
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-4">{apt.address}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                        <span className="text-slate-500 text-xs">
                          Submitted {apt.createdAt ? new Date(apt.createdAt.toDate ? apt.createdAt.toDate() : apt.createdAt).toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden relative shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950/50">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-amber-500" />
                Schedule Your Service
              </h3>
              <button 
                onClick={() => {
                  setShowScheduleModal(false);
                  setScheduleStep("form");
                }}
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {scheduleStep === "form" ? (
              <div className="flex-1 p-8 flex flex-col items-center justify-center bg-slate-900">
                <div className="w-full max-w-md bg-slate-950 p-8 rounded-2xl border border-slate-800 shadow-xl">
                  <h4 className="text-2xl font-bold text-white mb-2">Service Details</h4>
                  <p className="text-slate-400 text-sm mb-6">Let us know where we're going and how many cars to expect.</p>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-1">Service Address</label>
                      <input 
                        type="text" 
                        value={serviceAddress}
                        onChange={(e) => setServiceAddress(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none transition" 
                        placeholder="123 Main St..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-1">Number of Cars Planned</label>
                      <input 
                        type="number" 
                        min="1"
                        value={carsCount}
                        onChange={(e) => setCarsCount(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none transition" 
                        placeholder="e.g. 5"
                      />
                    </div>
                    <button 
                      onClick={async () => {
                        if (!serviceAddress || !carsCount) return alert("Please fill out all fields");
                        try {
                          await addDoc(collection(db, "appointments"), {
                            dealerId: user.uid,
                            dealershipName: userData?.dealership || user.email,
                            address: serviceAddress,
                            carsCount: Number(carsCount),
                            status: "pending",
                            createdAt: serverTimestamp()
                          });
                          setScheduleStep("calendar");
                        } catch (err) {
                          console.error(err);
                          alert("Failed to save details");
                        }
                      }}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-4 rounded-xl transition shadow-[0_0_15px_rgba(245,158,11,0.2)] mt-2"
                    >
                      Proceed to Choose Time &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 relative bg-white">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <p className="text-slate-500">Loading Calendar...</p>
                </div>
                <iframe 
                  src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2wj_MPuipVnuRsVgwyMSv5jPZfVrekqICPJyiapzz3w5336ykdtJElsKavW9bZUm1ou79Fkqv7?gv=true" 
                  style={{ border: 0 }} 
                  width="100%" 
                  height="100%" 
                  className="absolute inset-0 z-10"
                  title="Schedule Service"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
