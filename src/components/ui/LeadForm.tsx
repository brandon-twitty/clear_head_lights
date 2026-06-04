"use client";

import { useState } from "react";
import { ArrowRight, Building2, User } from "lucide-react";

export default function LeadForm() {
  const [formType, setFormType] = useState<"dealership" | "individual">("dealership");

  return (
    <div className="max-w-3xl mx-auto">
      {/* Toggle */}
      <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 mb-8 w-fit mx-auto">
        <button 
          onClick={() => setFormType("dealership")}
          className={`flex items-center px-6 py-2 rounded-lg font-bold transition-all ${formType === 'dealership' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          <Building2 className="w-4 h-4 mr-2" /> Dealership
        </button>
        <button 
          onClick={() => setFormType("individual")}
          className={`flex items-center px-6 py-2 rounded-lg font-bold transition-all ${formType === 'individual' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          <User className="w-4 h-4 mr-2" /> Individual
        </button>
      </div>

      <form className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl">
        {formType === "dealership" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Dealership Name</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g. Sunset Auto Sales" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Contact Person</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="John Doe" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Phone Number</label>
                <input type="tel" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="(555) 000-0000" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Est. Weekly Volume (Cars)</label>
                <input type="number" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g. 10" />
              </div>
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-300 mb-2">Lot Location / Address</label>
              <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="123 Dealer Row, Fenton, MO" />
            </div>

            <button type="button" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-4 rounded-xl transition text-lg flex justify-center items-center">
              Request Lot Analysis <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Full Name</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Phone Number</label>
                <input type="tel" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="(555) 000-0000" />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-300 mb-2">Vehicle Make & Model</label>
              <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g. 2018 Ford F-150" />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-300 mb-2">Service Needed</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center p-4 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800 transition">
                  <input type="radio" name="service" className="w-4 h-4 text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-500" defaultChecked />
                  <span className="ml-3 text-white font-bold">Standard Set ($45)</span>
                </label>
                <label className="flex items-center p-4 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800 transition">
                  <input type="radio" name="service" className="w-4 h-4 text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-500" />
                  <span className="ml-3 text-white font-bold">Single Light ($30)</span>
                </label>
              </div>
            </div>

            <button type="button" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-4 rounded-xl transition text-lg flex justify-center items-center">
              Submit Request <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </>
        )}
      </form>
    </div>
  );
}
