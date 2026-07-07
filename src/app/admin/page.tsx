"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users, FileText, Calendar, LogOut, BarChart, Phone, Mail, Link as LinkIcon, CheckCircle2, DollarSign, Send, Trash2, ExternalLink } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, setDoc, serverTimestamp, updateDoc, addDoc, deleteDoc, where, getDocs, writeBatch } from "firebase/firestore";
import Link from "next/link";
import { sendInviteEmail } from "@/actions/sendEmail";
import { sendInvoiceReminder } from "@/actions/sendReminder";
import { deleteDealer } from "@/actions/deleteDealer";

interface Lead {
  id: string;
  name: string;
  dealership: string;
  email: string;
  phone: string;
  address?: string;
  inventorySize: string;
  notes: string;
  status: string;
  createdAt: any;
  invitedAt?: any;
}

interface UserDoc {
  id: string;
  name: string;
  dealership: string;
  email: string;
  role: string;
  createdAt?: any;
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

interface Appointment {
  id: string;
  dealerId: string;
  dealershipName: string;
  address: string;
  carsCount: number;
  status: string;
  createdAt: any;
}

export default function AdminPortal() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dashboard" | "dealerships" | "invoices" | "appointments">("dashboard");
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [dealers, setDealers] = useState<UserDoc[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  
  // Create Invoice State
  const [newInvoiceAmount, setNewInvoiceAmount] = useState("");
  const [newInvoiceDesc, setNewInvoiceDesc] = useState("");
  const [creatingInvoiceFor, setCreatingInvoiceFor] = useState<string | null>(null);
  const [selectedDealer, setSelectedDealer] = useState<UserDoc | null>(null);
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

      const qAppointments = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
      const unsubAppointments = onSnapshot(qAppointments, (snapshot) => {
        setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[]);
      });

      return () => { unsubLeads(); unsubUsers(); unsubInvoices(); unsubAppointments(); };
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
        address: lead.address || "",
        leadId: lead.id,
        createdAt: serverTimestamp()
      });
      
      const appUrl = window.location.origin;
      const emailResult = await sendInviteEmail(lead.email, lead.dealership, token, appUrl);

      if (!emailResult.success) {
        alert("Invite generated, but email failed to send: " + emailResult.error);
      }
      
      await updateDoc(doc(db, "leads", lead.id), { status: "contacted", invitedAt: serverTimestamp() });

      const inviteLink = `${appUrl}/register?token=${token}`;
      try {
        await navigator.clipboard.writeText(inviteLink);
        setCopiedToken(lead.id);
        setTimeout(() => setCopiedToken(null), 3000);
      } catch (clipErr) {
        console.warn("Clipboard access denied/failed", clipErr);
        // Still show success since it generated
        setCopiedToken(lead.id);
        setTimeout(() => setCopiedToken(null), 3000);
        alert(`Invite generated successfully!\nLink: ${inviteLink}`);
      }
    } catch (error: any) {
      console.error("Error generating invite:", error);
      alert("Failed to generate invite: " + (error?.message || "Unknown error"));
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

  const handleDeleteLead = async (leadId: string) => {
    if (confirm("Are you sure you want to delete this lead? This will also revoke any active invites.")) {
      try {
        const q = query(collection(db, "invites"), where("leadId", "==", leadId));
        const inviteDocs = await getDocs(q);
        const batch = writeBatch(db);
        inviteDocs.forEach(d => {
          batch.delete(doc(db, "invites", d.id));
        });
        batch.delete(doc(db, "leads", leadId));
        await batch.commit();
      } catch (err) {
        console.error("Error deleting lead:", err);
        alert("Failed to delete lead.");
      }
    }
  };

  const handleDeleteDealership = async (dealerId: string) => {
    if (confirm("Are you sure you want to completely delete this dealership? This action cannot be undone and they will lose all access.")) {
      try {
        const result = await deleteDealer(dealerId);
        if (!result.success) throw new Error(result.error);
        alert("Dealership deleted.");
      } catch (err: any) {
        console.error("Error deleting dealership:", err);
        alert(err.message || "Failed to delete dealership.");
      }
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
            <button onClick={() => { setActiveTab("dashboard"); setSelectedDealer(null); }} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition ${activeTab === 'dashboard' ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <BarChart className="w-5 h-5 mr-3" /> Dashboard
            </button>
            <button onClick={() => { setActiveTab("dealerships"); setSelectedDealer(null); }} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition ${activeTab === 'dealerships' ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Users className="w-5 h-5 mr-3" /> Dealerships
            </button>
            <button onClick={() => { setActiveTab("invoices"); setSelectedDealer(null); }} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition ${activeTab === 'invoices' ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <FileText className="w-5 h-5 mr-3" /> Invoices
            </button>
            <button onClick={() => { setActiveTab("appointments"); setSelectedDealer(null); }} className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition ${activeTab === 'appointments' ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Calendar className="w-5 h-5 mr-3" /> Appointments
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            
            {activeTab === 'dashboard' && (
              <>
                <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
                <p className="text-slate-400 mb-8">Monitor revenue, upcoming appointments, and new dealership leads.</p>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
                  <div className="bg-slate-900 p-4 lg:p-6 rounded-xl border border-slate-800">
                    <h3 className="text-slate-400 font-medium text-xs lg:text-sm mb-1">Total Unpaid</h3>
                    <p className="text-2xl lg:text-3xl font-bold text-white">${invoices.filter(i => i.status === 'pending').reduce((a, b) => a + b.amount, 0).toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-900 p-4 lg:p-6 rounded-xl border border-slate-800">
                    <h3 className="text-slate-400 font-medium text-xs lg:text-sm mb-1">Total Paid</h3>
                    <p className="text-2xl lg:text-3xl font-bold text-emerald-400">${invoices.filter(i => i.status === 'paid').reduce((a, b) => a + b.amount, 0).toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-900 p-4 lg:p-6 rounded-xl border border-slate-800">
                    <h3 className="text-slate-400 font-medium text-xs lg:text-sm mb-1">Pending Leads</h3>
                    <p className="text-2xl lg:text-3xl font-bold text-amber-400">{leads.filter(l => l.status !== "active").length}</p>
                  </div>
                  <div className="bg-slate-900 p-4 lg:p-6 rounded-xl border border-slate-800">
                    <h3 className="text-slate-400 font-medium text-xs lg:text-sm mb-1">Invited Leads</h3>
                    <p className="text-2xl lg:text-3xl font-bold text-blue-400">{leads.filter(l => l.status === "contacted").length}</p>
                  </div>
                  <div className="bg-slate-900 p-4 lg:p-6 rounded-xl border border-slate-800">
                    <h3 className="text-slate-400 font-medium text-xs lg:text-sm mb-1">Active Dealerships</h3>
                    <p className="text-2xl lg:text-3xl font-bold text-white">{dealers.length}</p>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col h-[500px]">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
                    Recent Leads 
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">{leads.filter(l => l.status !== "active").length} Queue</span>
                  </h2>
                  
                  <div className="overflow-y-auto pr-2 space-y-4 flex-1">
                    {leads.filter(l => l.status !== "active").length === 0 ? (
                      <div className="text-slate-500 text-sm py-8 text-center border-2 border-dashed border-slate-800 rounded-lg">No leads in the queue.</div>
                    ) : (
                      leads.filter(l => l.status !== "active").map(lead => (
                        <div key={lead.id} className={`bg-slate-950 p-4 rounded-lg border transition ${lead.status === 'contacted' ? 'border-slate-800 opacity-70' : 'border-amber-500/30'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-white font-bold">{lead.dealership}</h4>
                              <p className="text-slate-400 text-sm">{lead.name}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-medium px-2 py-1 rounded border ${lead.status === 'contacted' ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                  {lead.status === 'contacted' ? 'Invited' : 'New Lead'}
                                </span>
                                <button onClick={() => handleDeleteLead(lead.id)} className="text-red-400 hover:text-red-300 transition p-1" title="Delete Lead">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              {lead.status === 'contacted' && lead.invitedAt && (
                                <span className="text-[10px] text-slate-500">
                                  Sent: {lead.invitedAt.toDate ? new Date(lead.invitedAt.toDate()).toLocaleDateString() : new Date(lead.invitedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
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
                {selectedDealer ? (
                  <div>
                    <button onClick={() => setSelectedDealer(null)} className="text-amber-500 hover:text-amber-400 text-sm font-bold flex items-center mb-6">
                      &larr; Back to Dealerships
                    </button>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-8">
                      <h1 className="text-3xl font-bold text-white mb-2">{selectedDealer.dealership || selectedDealer.name}</h1>
                      <div className="text-slate-400 space-y-1 mb-6">
                        <p><span className="font-bold text-slate-300">Contact:</span> {selectedDealer.name}</p>
                        <p><span className="font-bold text-slate-300">Email:</span> {selectedDealer.email}</p>
                        <p><span className="font-bold text-slate-300">Address:</span> {(selectedDealer as any).address || "No address on file"}</p>
                        <p><span className="font-bold text-slate-300">Registered:</span> {selectedDealer.createdAt ? new Date(selectedDealer.createdAt).toLocaleDateString() : 'Unknown'}</p>
                      </div>
                      
                      {creatingInvoiceFor === selectedDealer.id ? (
                        <div className="flex flex-col sm:flex-row gap-3 items-center bg-slate-950 p-4 rounded-lg border border-slate-800">
                          <input type="text" placeholder="Desc (e.g. 3 cars)" value={newInvoiceDesc} onChange={(e) => setNewInvoiceDesc(e.target.value)} className="bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto flex-1 focus:ring-2 focus:ring-amber-500 outline-none" />
                          <input type="number" placeholder="$ Amount" value={newInvoiceAmount} onChange={(e) => setNewInvoiceAmount(e.target.value)} className="bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg w-full sm:w-32 focus:ring-2 focus:ring-amber-500 outline-none" />
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button onClick={() => handleCreateInvoice(selectedDealer)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold transition flex-1 sm:flex-none">Send Bill</button>
                            <button onClick={() => setCreatingInvoiceFor(null)} className="text-slate-400 hover:text-white px-4 py-2">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setCreatingInvoiceFor(selectedDealer.id)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-bold transition flex items-center">
                          <DollarSign className="w-5 h-5 mr-2" /> Bill Dealership
                        </button>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4">Appointments</h3>
                        <div className="space-y-3">
                          {appointments.filter(a => a.dealerId === selectedDealer.id).length === 0 && <p className="text-slate-500 italic">No appointments.</p>}
                          {appointments.filter(a => a.dealerId === selectedDealer.id).map(apt => {
                            const PRICE_PER_CAR = 75; // Adjust this value as needed
                            const estimatedTotal = apt.carsCount * PRICE_PER_CAR;
                            
                            return (
                              <div key={apt.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-amber-500/50 transition-colors group flex flex-col justify-between">
                                <div>
                                  <div className="flex justify-between items-start mb-2">
                                    <p className="text-white font-bold text-lg flex items-center">
                                      <Calendar className="w-4 h-4 mr-2 text-amber-500" />
                                      {apt.carsCount} Cars Planned
                                    </p>
                                    <div className="flex flex-col items-end">
                                      <span className="text-emerald-400 font-bold mb-1">Est. ${estimatedTotal}</span>
                                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                        Pending
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-slate-400 text-sm">{apt.address}</p>
                                  <p className="text-slate-500 text-xs mt-3">Submitted {apt.createdAt ? new Date(apt.createdAt.toDate ? apt.createdAt.toDate() : apt.createdAt).toLocaleDateString() : 'Just now'}</p>
                                </div>
                                <a 
                                  href="https://calendar.google.com/calendar/u/0/r" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="mt-4 w-full bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center"
                                >
                                  View in Google Calendar <ExternalLink className="w-3 h-3 ml-2" />
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4">Invoices</h3>
                        <div className="space-y-3">
                          {invoices.filter(i => i.dealerId === selectedDealer.id).length === 0 && <p className="text-slate-500 italic">No invoices.</p>}
                          {invoices.filter(i => i.dealerId === selectedDealer.id).map(inv => (
                            <div key={inv.id} className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex justify-between items-center">
                              <div>
                                <p className="text-white font-bold">{inv.description}</p>
                                <p className="text-slate-400 text-sm">${inv.amount.toFixed(2)}</p>
                              </div>
                              <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'}`}>
                                {inv.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-white mb-6">Registered Dealerships</h1>
                    <div className="space-y-4">
                      {dealers.map(dealer => (
                        <div key={dealer.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center">
                          <div>
                            <h3 className="text-xl font-bold text-white">{dealer.dealership || dealer.name}</h3>
                            <p className="text-slate-400 text-sm">{dealer.email}</p>
                          </div>
                          
                          <div className="mt-4 md:mt-0 flex gap-3">
                            <button onClick={() => setSelectedDealer(dealer)} className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition">
                              View Details
                            </button>
                            <button onClick={() => setCreatingInvoiceFor(dealer.id)} className="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-500/30 px-4 py-2 rounded-lg text-sm font-bold transition flex items-center">
                              <DollarSign className="w-4 h-4 mr-2" /> Bill Dealership
                            </button>
                            <button onClick={() => handleDeleteDealership(dealer.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 p-2 rounded-lg transition" title="Delete Dealership">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
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

            {activeTab === 'appointments' && (
              <>
                <h1 className="text-3xl font-bold text-white mb-6">Service Appointments</h1>
                <div className="space-y-4">
                  {appointments.map(apt => {
                    const PRICE_PER_CAR = 75; // Adjust this value as needed
                    const estimatedTotal = apt.carsCount * PRICE_PER_CAR;
                    
                    return (
                      <div key={apt.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                          <h3 className="text-xl font-bold text-white">{apt.dealershipName}</h3>
                          <p className="text-slate-400 mt-1 flex items-center">
                            <span className="font-bold text-slate-300 mr-2">Address:</span> {apt.address}
                          </p>
                          <p className="text-slate-400 mt-1 flex items-center">
                            <span className="font-bold text-slate-300 mr-2">Planned Cars:</span> <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded text-sm font-bold">{apt.carsCount}</span>
                            <span className="ml-3 text-emerald-400 font-bold text-sm">(Est. ${estimatedTotal})</span>
                          </p>
                          <p className="text-slate-500 text-xs mt-2">
                            Submitted: {apt.createdAt ? new Date(apt.createdAt.toDate ? apt.createdAt.toDate() : apt.createdAt).toLocaleString() : 'Just now'}
                          </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex flex-col items-end">
                          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                            Pending Schedule
                          </span>
                          <a 
                            href="https://calendar.google.com/calendar/u/0/r" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 px-3 py-1.5 rounded text-xs font-medium transition flex items-center"
                          >
                            Google Calendar <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                  {appointments.length === 0 && (
                    <div className="text-slate-500 text-center py-12 border-2 border-dashed border-slate-800 rounded-xl">
                      No appointments found.
                    </div>
                  )}
                </div>
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
