"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users, FileText, Calendar, LogOut, BarChart, Phone, Mail, Link as LinkIcon, CheckCircle2, DollarSign, Send } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, setDoc, serverTimestamp, updateDoc, addDoc } from "firebase/firestore";
import Link from "next/link";
import { sendInviteEmail } from "@/actions/sendEmail";
import { sendInvoiceReminder } from "@/actions/sendReminder";

interface Lead {
  id: string;
  name: string;
  dealership: string;
  email: string;
  phone: string;
  inventorySize: string;
  notes: string;
  status: string;
  createdAt: any;
}

interface UserDoc {
  id: string;
  name: string;
  dealership: string;
  email: string;
  role: string;
}

interface Invoice {
  id: string;
  dealerId: string;
  dealershipName: string;
  dealerEmail: string;
  amount: number;
  description: string;
  status: string;
  createdAt: any;
}

export default function AdminPortal() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dashboard" | "dealerships" | "invoices">("dashboard");
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [dealers, setDealers] = useState<UserDoc[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  
  // Create Invoice State
  const [newInvoiceAmount, setNewInvoiceAmount] = useState("");
  const [newInvoiceDesc, setNewInvoiceDesc] = useState("");
  const [creatingInvoiceFor, setCreatingInvoiceFor] = useState<string | null>(null);
  const [remindingInvoiceId, setRemindingInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || role !== 'admin')) {
      router.push("/login");
    }
  }, [user, role, loading, router]);

  // Fetch Data
  useEffect(() => {
    if (user && role === 'admin') {
      const qLeads = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      const unsubLeads = onSnapshot(qLeads, (snapshot) => {
        setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Lead[]);
      });

      const qUsers = query(collection(db, "users"));
      const unsubUsers = onSnapshot(qUsers, (snapshot) => {
        setDealers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter((u: any) => u.role === 'dealer') as UserDoc[]);
      });

      const qInvoices = query(collection(db, "invoices"), orderBy("createdAt", "desc"));
      const unsubInvoices = onSnapshot(qInvoices, (snapshot) => {
        setInvoices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Invoice[]);
      });

      return () => { unsubLeads(); unsubUsers(); unsubInvoices(); };
    }
  }, [user, role]);

  const generateInvite = async (lead: Lead) => {
    setProcessingId(lead.id);
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    try {
      await setDoc(doc(db, "invites", token), {
        email: lead.email,
        dealership: lead.dealership,
        name: lead.name,
        leadId: lead.id,
        createdAt: serverTimestamp()
      });
      
      const appUrl = window.location.origin;
      const emailResult = await sendInviteEmail(lead.email, lead.dealership, token, appUrl);

      if (!emailResult.success) {
        alert("Invite generated, but email failed to send: " + emailResult.error);
      }
      
      await updateDoc(doc(db, "leads", lead.id), { status: "contacted" });

      const inviteLink = `${appUrl}/register?token=${token}`;
      await navigator.clipboard.writeText(inviteLink);
      setCopiedToken(lead.id);
      setTimeout(() => setCopiedToken(null), 3000);
    } catch (error) {
      console.error("Error generating invite:", error);
      alert("Failed to generate invite. Check console.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleCreateInvoice = async (dealer: UserDoc) => {
    if (!newInvoiceAmount || isNaN(Number(newInvoiceAmount))) return alert("Invalid amount");
    
    try {
      await addDoc(collection(db, "invoices"), {
        dealerId: dealer.id,
        dealershipName: dealer.dealership || dealer.name,
        dealerEmail: dealer.email,
        amount: Number(newInvoiceAmount),
        description: newInvoiceDesc || "Headlight Restoration Service",
        status: "pending",
        createdAt: serverTimestamp()
      });
      setCreatingInvoiceFor(null);
      setNewInvoiceAmount("");
      setNewInvoiceDesc("");
    } catch (err) {
      console.error(err);
      alert("Failed to create invoice");
    }
  };

  const handleSendReminder = async (invoice: Invoice) => {
    setRemindingInvoiceId(invoice.id);
    try {
      const appUrl = window.location.origin;
      const result = await sendInvoiceReminder(invoice.dealerEmail, invoice.amount, invoice.id, appUrl);
      if (result.success) {
        alert("Reminder sent!");
      } else {
        alert("Failed to send: " + result.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRemindingInvoiceId(null);
    }
  };

  if (loading) return <div className="p-8 text-slate-400">Loading admin CRM...</div>;
  if (!user || role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-8">
        <Link href="/" className="font-bold text-lg text-white flex items-center">
          <span className="text-amber-400 mr-2">⚡</span> ADMIN CRM
        </Link>
        <button onClick={() => signOut(auth)} className="text-slate-400 hover:text-white flex items-center text-sm font-medium transition">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </button>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 hidden md:block">
          <nav className="space-y-2">
            <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition ${activeTab === 'dashboard' ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <BarChart className="w-5 h-5 mr-3" /> Dashboard
            </button>
            <button onClick={() => setActiveTab("dealerships")} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition ${activeTab === 'dealerships' ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Users className="w-5 h-5 mr-3" /> Dealerships
            </button>
            <button onClick={() => setActiveTab("invoices")} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition ${activeTab === 'invoices' ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <FileText className="w-5 h-5 mr-3" /> Invoices
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            
            {activeTab === 'dashboard' && (
              <>
                <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
                <p className="text-slate-400 mb-8">Monitor revenue, upcoming appointments, and new dealership leads.</p>

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-slate-400 font-medium text-sm mb-1">Total Unpaid</h3>
                    <p className="text-3xl font-bold text-white">${invoices.filter(i => i.status === 'pending').reduce((a, b) => a + b.amount, 0).toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-slate-400 font-medium text-sm mb-1">Total Paid</h3>
                    <p className="text-3xl font-bold text-emerald-400">${invoices.filter(i => i.status === 'paid').reduce((a, b) => a + b.amount, 0).toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-slate-400 font-medium text-sm mb-1">Pending Leads</h3>
                    <p className="text-3xl font-bold text-amber-400">{leads.filter(l => l.status === "new").length}</p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-slate-400 font-medium text-sm mb-1">Active Dealerships</h3>
                    <p className="text-3xl font-bold text-white">{dealers.length}</p>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col h-[500px]">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
                    Recent Leads 
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">{leads.length} Total</span>
                  </h2>
                  
                  <div className="overflow-y-auto pr-2 space-y-4 flex-1">
                    {leads.length === 0 ? (
                      <div className="text-slate-500 text-sm py-8 text-center border-2 border-dashed border-slate-800 rounded-lg">No new leads found.</div>
                    ) : (
                      leads.map(lead => (
                        <div key={lead.id} className={`bg-slate-950 p-4 rounded-lg border transition ${lead.status === 'contacted' ? 'border-slate-800 opacity-70' : 'border-amber-500/30'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-white font-bold">{lead.dealership}</h4>
                              <p className="text-slate-400 text-sm">{lead.name}</p>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded border ${lead.status === 'contacted' ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                              {lead.status === 'contacted' ? 'Invited' : 'New Lead'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-slate-500 mb-3">
                            <a href={`tel:${lead.phone}`} className="flex items-center hover:text-amber-400 transition"><Phone className="w-3 h-3 mr-1" /> {lead.phone}</a>
                            <a href={`mailto:${lead.email}`} className="flex items-center hover:text-amber-400 transition"><Mail className="w-3 h-3 mr-1" /> {lead.email}</a>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => generateInvite(lead)}
                              disabled={processingId === lead.id}
                              className="flex-1 flex items-center justify-center bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-bold py-2 rounded transition disabled:opacity-50"
                            >
                              {processingId === lead.id ? "Sending..." : copiedToken === lead.id ? "Sent & Copied!" : "Gen Invite & Email"}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'dealerships' && (
              <>
                <h1 className="text-3xl font-bold text-white mb-6">Registered Dealerships</h1>
                <div className="space-y-4">
                  {dealers.map(dealer => (
                    <div key={dealer.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-white">{dealer.dealership || dealer.name}</h3>
                        <p className="text-slate-400 text-sm">{dealer.email}</p>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex flex-col items-end">
                        {creatingInvoiceFor === dealer.id ? (
                          <div className="flex gap-2 items-center">
                            <input type="text" placeholder="Desc (e.g. 3 cars)" value={newInvoiceDesc} onChange={(e) => setNewInvoiceDesc(e.target.value)} className="bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded text-sm w-40" />
                            <input type="number" placeholder="$ Amount" value={newInvoiceAmount} onChange={(e) => setNewInvoiceAmount(e.target.value)} className="bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded text-sm w-28" />
                            <button onClick={() => handleCreateInvoice(dealer)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-sm font-bold transition">Send Bill</button>
                            <button onClick={() => setCreatingInvoiceFor(null)} className="text-slate-400 hover:text-white px-2 py-2 text-sm">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setCreatingInvoiceFor(dealer.id)} className="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-500/30 px-4 py-2 rounded-lg text-sm font-bold transition flex items-center">
                            <DollarSign className="w-4 h-4 mr-2" /> Bill Dealership
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'invoices' && (
              <>
                <h1 className="text-3xl font-bold text-white mb-6">All Invoices</h1>
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-950 text-xs uppercase border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-4">Dealership</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map(invoice => (
                        <tr key={invoice.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50">
                          <td className="px-6 py-4 font-medium text-white">{invoice.dealershipName}</td>
                          <td className="px-6 py-4">{invoice.description}</td>
                          <td className="px-6 py-4 font-bold text-white">${invoice.amount.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${invoice.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                              {invoice.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {invoice.status === 'pending' && (
                              <button 
                                onClick={() => handleSendReminder(invoice)}
                                disabled={remindingInvoiceId === invoice.id}
                                className="flex items-center text-indigo-400 hover:text-indigo-300 text-xs font-bold transition disabled:opacity-50"
                              >
                                <Send className="w-3 h-3 mr-1" /> {remindingInvoiceId === invoice.id ? 'Sending...' : 'Remind'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {invoices.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center">No invoices found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
