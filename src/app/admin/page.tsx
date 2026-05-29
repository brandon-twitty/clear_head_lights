"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users, FileText, Calendar, LogOut, BarChart, Phone, Mail, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { sendInviteEmail } from "@/actions/sendEmail";

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

export default function AdminPortal() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedLeads = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Lead[];
        setLeads(fetchedLeads);
      });
      return () => unsubscribe();
    }
  }, [user]);

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
      
      // Dispatch the server action to send the email
      const emailResult = await sendInviteEmail(
        lead.email,
        lead.dealership,
        token,
        appUrl
      );

      if (!emailResult.success) {
        alert("Invite generated, but email failed to send: " + emailResult.error);
        console.error(emailResult.error);
      }
      
      await updateDoc(doc(db, "leads", lead.id), {
        status: "contacted"
      });

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

  if (loading) return <div className="p-8 text-slate-400">Loading admin CRM...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-8">
        <Link href="/" className="font-bold text-lg text-white flex items-center">
          <span className="text-amber-400 mr-2">⚡</span> ADMIN CRM
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
              <BarChart className="w-5 h-5 mr-3" /> Dashboard
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition">
              <Calendar className="w-5 h-5 mr-3" /> Schedule
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition">
              <Users className="w-5 h-5 mr-3" /> Dealerships
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition">
              <FileText className="w-5 h-5 mr-3" /> Invoices
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
            <p className="text-slate-400 mb-8">Monitor revenue, upcoming appointments, and new dealership leads.</p>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h3 className="text-slate-400 font-medium text-sm mb-1">MTD Revenue</h3>
                <p className="text-3xl font-bold text-white">$0.00</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h3 className="text-slate-400 font-medium text-sm mb-1">Cars Serviced</h3>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full" />
                <h3 className="text-slate-400 font-medium text-sm mb-1">Pending Leads</h3>
                <p className="text-3xl font-bold text-amber-400">{leads.filter(l => l.status === "new").length}</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h3 className="text-slate-400 font-medium text-sm mb-1">Active Dealerships</h3>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col h-[500px]">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
                  Recent Leads 
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">{leads.length} Total</span>
                </h2>
                
                <div className="overflow-y-auto pr-2 space-y-4 flex-1">
                  {leads.length === 0 ? (
                    <div className="text-slate-500 text-sm py-8 text-center border-2 border-dashed border-slate-800 rounded-lg">
                      No new leads found.
                    </div>
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
                        {lead.notes && (
                          <div className="text-xs text-slate-400 bg-slate-900 p-2 rounded border border-slate-800 mb-3">
                            <span className="font-semibold text-slate-500">Notes:</span> {lead.notes}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button 
                            onClick={() => generateInvite(lead)}
                            disabled={processingId === lead.id}
                            className="flex-1 flex items-center justify-center bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-bold py-2 rounded transition disabled:opacity-50"
                          >
                            {processingId === lead.id ? (
                              <>Sending...</>
                            ) : copiedToken === lead.id ? (
                              <><CheckCircle2 className="w-3 h-3 mr-1" /> Sent & Copied!</>
                            ) : (
                              <><LinkIcon className="w-3 h-3 mr-1" /> Gen Invite & Email</>
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Upcoming Schedule</h2>
                <div className="text-slate-500 text-sm py-8 text-center border-2 border-dashed border-slate-800 rounded-lg h-[400px] flex items-center justify-center">
                  No appointments scheduled.
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
