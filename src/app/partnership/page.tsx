"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Shield, CheckCircle, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PartnershipIntake() {
  const [formData, setFormData] = useState({
    name: "",
    dealership: "",
    email: "",
    phone: "",
    address: "",
    inventorySize: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "leads"), {
        ...formData,
        createdAt: serverTimestamp(),
        status: "new"
      });
      setSuccess(true);
    } catch (err: any) {
      console.error("Error submitting lead:", err);
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="animate-fade-in text-center max-w-md">
          <CheckCircle className="w-20 h-20 text-amber-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
          <h2 className="text-3xl font-extrabold text-white mb-4">Request Received!</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Thank you, {formData.name}. We've successfully received your partnership request for {formData.dealership}. Our team will contact you shortly to schedule your on-lot demonstration.
          </p>
          <Link href="/" className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-lg font-bold transition shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 text-center sticky top-0 z-10">
        <div className="flex justify-center items-center space-x-2">
          <span className="text-amber-400 text-xl">⚡</span>
          <span className="font-extrabold tracking-tight text-white">CLEAR<span className="text-amber-400">HEADLIGHTS</span></span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto p-6 flex flex-col justify-center animate-fade-in">
        <div className="mb-8 text-center">
          <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-white mb-2">Dealership Partnership</h1>
          <p className="text-slate-300 text-lg">
            Maximize your Curb Appeal and protect your front-end gross.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-bold text-amber-500 mb-4">Why Partner With Us?</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <Shield className="w-6 h-6 text-amber-500 mr-3 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">The "Curb Appeal" Advantage:</strong>
                <p className="text-sm text-slate-400 mt-1">Crystal-clear lenses justify CPO-level pricing on older inventory, accelerating cash flow and reducing days on lot.</p>
              </div>
            </li>
            <li className="flex items-start">
              <Sparkles className="w-6 h-6 text-amber-500 mr-3 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Rapid Parallel Processing:</strong>
                <p className="text-sm text-slate-400 mt-1">Our mobile technicians process 3-4 vehicles simultaneously on your lot, delivering lot-ready timing in a fraction of the time.</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-amber-500 mr-3 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Exclusive $35 Partnership Pricing:</strong>
                <p className="text-sm text-slate-400 mt-1">Reserved for weekly service agreements. A small $35 investment replaces a $150 retail detail, boosting your per-unit profit.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white">Schedule a Lot Walk / Demo</h2>
          <p className="text-slate-400 text-sm mt-1">Fill out the form below and we'll come to your lot.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Your Name *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition" placeholder="John Smith" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Dealership Name *</label>
            <input required type="text" name="dealership" value={formData.dealership} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition" placeholder="Suntrup Nissan" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1">Email Address *</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition" placeholder="john@dealer.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1">Phone Number *</label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition" placeholder="(314) 555-0123" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Dealership Address *</label>
            <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition" placeholder="123 Main St, City, State, ZIP" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Est. Vehicles Needing Restoration *</label>
            <select required name="inventorySize" value={formData.inventorySize} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition appearance-none cursor-pointer">
              <option value="" disabled>Select quantity...</option>
              <option value="1-5">1 - 5 Vehicles</option>
              <option value="5-15">5 - 15 Vehicles</option>
              <option value="15-30">15 - 30 Vehicles</option>
              <option value="30+">30+ Vehicles</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Additional Notes *</label>
            <textarea required name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition resize-none" placeholder="Best time to call, specific inventory needs, etc." />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-4 rounded-xl transition mt-6 flex justify-center items-center shadow-[0_0_15px_rgba(245,158,11,0.2)] disabled:opacity-50 text-lg">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Request Dealership Pricing"}
          </button>
          
          <div className="flex items-center justify-center mt-4 text-xs font-bold text-slate-500">
            <Shield className="w-4 h-4 mr-1 text-amber-500" /> Secure & No Commitment
          </div>
        </form>
      </main>
    </div>
  );
}
