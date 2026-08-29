"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Building2, User, CheckCircle2, AlertCircle } from "lucide-react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { submitDealerLead } from "@/actions/submitDealerLead";

export default function LeadForm() {
  const [formType, setFormType] = useState<"dealership" | "individual">("individual");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const addressInputRef = useRef<HTMLInputElement>(null);
  const [address, setAddress] = useState("");
  const [mapsError, setMapsError] = useState(false);

  useEffect(() => {
    if (addressInputRef.current) {
      try {
        setOptions({
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        });
      } catch (e) {
        // ignore already set
      }

      importLibrary("places").then((placesLib: any) => {
        if (!placesLib.Autocomplete) {
          setMapsError(true);
          return;
        }
        
        const autocomplete = new placesLib.Autocomplete(addressInputRef.current, {
          componentRestrictions: { country: ["us"] },
          fields: ["formatted_address"],
          bounds: {
            north: 39.0,  // Greater St. Louis Area (North)
            south: 38.3,  // Greater St. Louis Area (South)
            east: -89.8,  // Greater St. Louis Area (East / Illinois side)
            west: -90.7   // Greater St. Louis Area (West / St. Charles)
          },
          strictBounds: false // Prefer St. Louis, but still allow other US addresses if they explicitly type them
        });
        
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            setAddress(place.formatted_address);
          }
        });
      }).catch((err) => {
        console.error("Maps load error:", err);
        setMapsError(true);
      });
    }
  }, [formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.target as HTMLFormElement;
    const phoneInput = form.querySelector('input[type="tel"]') as HTMLInputElement;
    
    // Basic Phone Validation (strip non-digits, check length)
    if (phoneInput) {
      const digitCount = phoneInput.value.replace(/\D/g, '').length;
      if (digitCount < 10) {
        setStatus("error");
        setErrorMessage("Please enter a valid 10-digit phone number.");
        return;
      }
    }

    if (formType === "individual") {
      const nameInput = form.querySelector<HTMLInputElement>('input[name="fullName"]');
      const addressVal = addressInputRef.current?.value || "";
      const serviceVal = form.querySelector<HTMLInputElement>('input[name="service"]:checked')?.value || "standard";
      
      const params = new URLSearchParams();
      if (nameInput?.value) params.append("name", nameInput.value);
      if (phoneInput?.value) params.append("phone", phoneInput.value);
      if (addressVal) params.append("address", addressVal);
      params.append("service", serviceVal);
      
      window.location.href = `/book?${params.toString()}`;
      return;
    }

    // Dealership real backend call
    const dealerName = form.querySelector<HTMLInputElement>('input[placeholder="e.g. Sunset Auto Sales"]')?.value || "";
    const contactPerson = form.querySelector<HTMLInputElement>('input[placeholder="John Doe"]')?.value || "";
    const dealerEmail = form.querySelector<HTMLInputElement>('input[type="email"]')?.value || "";
    const dealerPhone = phoneInput?.value || "";
    const dealerVolume = form.querySelector<HTMLInputElement>('input[type="number"]')?.value || "";
    const dealerAddress = addressInputRef.current?.value || "";

    const result = await submitDealerLead({
      dealership: dealerName,
      name: contactPerson,
      email: dealerEmail,
      phone: dealerPhone,
      inventorySize: dealerVolume,
      address: dealerAddress,
      notes: ""
    }, window.location.origin);

    if (result.success) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
      setErrorMessage(result.error || "Failed to submit request.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Toggle */}
      <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 mb-8 w-fit mx-auto">
        <button 
          onClick={() => { setFormType("individual"); setStatus("idle"); setErrorMessage(""); }}
          className={`flex items-center px-6 py-2 rounded-lg font-bold transition-all ${formType === 'individual' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          type="button"
        >
          <User className="w-4 h-4 mr-2" /> Individual
        </button>
        <button 
          onClick={() => { setFormType("dealership"); setStatus("idle"); setErrorMessage(""); }}
          className={`flex items-center px-6 py-2 rounded-lg font-bold transition-all ${formType === 'dealership' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          type="button"
        >
          <Building2 className="w-4 h-4 mr-2" /> Dealership
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        
        {/* Success Overlay */}
        {status === "success" && (
          <div className="absolute inset-0 bg-slate-900 z-10 flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Request Received!</h3>
            <p className="text-slate-400 max-w-md">
              Thank you for reaching out. We will review your details and contact you shortly at the phone number provided to finalize your scheduling.
            </p>
            <button 
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 text-amber-500 font-semibold hover:text-amber-400 underline"
            >
              Submit another request
            </button>
          </div>
        )}

        {/* Error Banner */}
        {status === "error" && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{errorMessage}</p>
          </div>
        )}

        {formType === "dealership" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Dealership Name <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g. Sunset Auto Sales" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Contact Person <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="John Doe" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Email Address <span className="text-red-500">*</span></label>
                <input required type="email" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="dealer@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Phone Number <span className="text-red-500">*</span></label>
                <input required type="tel" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="(555) 000-0000" />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-300 mb-2">How many cars are you scheduling?</label>
              <input type="number" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g. 10" />
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-300 mb-2">Lot Location <span className="text-red-500">*</span></label>
              <input type="text" name="address_decoy" autoComplete="shipping street-address" className="absolute opacity-0 w-px h-px overflow-hidden" tabIndex={-1} aria-hidden="true" />
              <input 
                required 
                ref={addressInputRef} 
                type="search" 
                name="search_location" 
                autoComplete="new-password"
                data-lpignore="true"
                onFocus={(e) => { e.target.setAttribute("autocomplete", "new-password"); }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" 
                placeholder="Search location..." 
              />
              {mapsError && <p className="text-red-500 text-xs mt-1">Google Maps could not load, but you can still type your address above.</p>}
            </div>

            <button disabled={status === "submitting"} type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-4 rounded-xl transition text-lg flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed">
              {status === "submitting" ? "Sending..." : "Request Lot Analysis"} <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Full Name <span className="text-red-500">*</span></label>
                <input required name="fullName" type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Phone Number <span className="text-red-500">*</span></label>
                <input required type="tel" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="(555) 000-0000" />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-300 mb-2">Vehicle Make & Model <span className="text-red-500">*</span></label>
              <input required type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g. 2018 Ford F-150" />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-300 mb-2">Service Location <span className="text-red-500">*</span></label>
              <input type="text" name="address_decoy" autoComplete="shipping street-address" className="absolute opacity-0 w-px h-px overflow-hidden" tabIndex={-1} aria-hidden="true" />
              <input 
                required 
                ref={addressInputRef} 
                type="search" 
                name="search_location" 
                autoComplete="new-password"
                data-lpignore="true"
                onFocus={(e) => { e.target.setAttribute("autocomplete", "new-password"); }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" 
                placeholder="Search location..." 
              />
              {mapsError && <p className="text-red-500 text-xs mt-1">Google Maps could not load, but you can still type your address above.</p>}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-300 mb-2">Service Needed</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center p-4 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800 transition">
                  <input type="radio" name="service" value="standard" className="w-4 h-4 text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-500" defaultChecked />
                  <span className="ml-3 text-white font-bold">Standard Set ($45)</span>
                </label>
                <label className="flex items-center p-4 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800 transition">
                  <input type="radio" name="service" value="single" className="w-4 h-4 text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-500" />
                  <span className="ml-3 text-white font-bold">Single Light ($30)</span>
                </label>
              </div>
            </div>

            <button disabled={status === "submitting"} type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-4 rounded-xl transition text-lg flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed">
              {status === "submitting" ? "Sending..." : "Submit Request"} <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </>
        )}
      </form>
    </div>
  );
}
