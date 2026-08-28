"use client";

import { useState, Suspense, useEffect, useRef } from "react";
import { Calendar, Lock, CheckCircle2, ArrowRight, X } from "lucide-react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { createIndividualPaymentIntent } from "@/actions/individualStripe";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSearchParams } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function CheckoutForm({ amount, onComplete }: { amount: number, onComplete: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required' 
    });

    if (error) {
      setError(error.message || "Payment failed");
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onComplete();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full text-left mt-4">
      <PaymentElement options={{layout: 'tabs'}} />
      {error && <div className="text-red-400 text-sm mt-3 font-bold bg-red-500/10 p-2 rounded border border-red-500/20">{error}</div>}
      <button 
        disabled={!stripe || loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3 rounded-xl transition shadow-lg disabled:opacity-50 mt-6 flex items-center justify-center"
      >
        {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)} & Unlock Booking`}
      </button>
    </form>
  );
}

function IndividualBookingContent() {
  const [step, setStep] = useState<"form" | "calendar">("form");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid">("pending");
  const [pendingAppointmentId, setPendingAppointmentId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    name: searchParams.get("name") || "",
    email: "", // Not collected on homepage
    phone: searchParams.get("phone") || "",
    address: searchParams.get("address") || "",
    serviceType: (searchParams.get("service") as "standard" | "single") || "standard",
  });

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      setStep("calendar");
      setPaymentStatus("paid");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams]);

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
        if (!placesLib.Autocomplete) return;
        
        const autocomplete = new placesLib.Autocomplete(addressInputRef.current, {
          componentRestrictions: { country: ["us"] },
          fields: ["formatted_address"],
          bounds: {
            north: 39.0,  // Greater St. Louis Area
            south: 38.3,
            east: -89.8,
            west: -90.7
          },
          strictBounds: false
        });
        
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            setFormData(prev => ({ ...prev, address: place.formatted_address }));
          }
        });
      }).catch(console.error);
    }
  }, [step]);

  const pricing = {
    standard: { amount: 4500, price: 45, label: "Standard Set (Both Headlights)", productId: "prod_UsepnG3itcN0eq" },
    single: { amount: 3500, price: 35, label: "Single Headlight", productId: "prod_UsexV4RAMdaIsw" },
  };

  const selectedService = pricing[formData.serviceType];

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert("Please fill out all fields.");
      return;
    }

    setIsInitializingPayment(true);
    try {
      const docRef = await addDoc(collection(db, "appointments"), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        serviceType: formData.serviceType,
        type: "individual",
        status: "pending",
        createdAt: serverTimestamp()
      });
      
      setPendingAppointmentId(docRef.id);
      
      const res = await createIndividualPaymentIntent(
        docRef.id,
        selectedService.amount,
        formData.email,
        selectedService.productId
      );
      
      if (res.clientSecret) {
        setClientSecret(res.clientSecret);
        setStep("calendar");
      } else {
        alert("Payment Error: " + res.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to initialize booking.");
    } finally {
      setIsInitializingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 p-4 text-center sticky top-0 z-10 flex justify-between items-center px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-amber-400 text-xl">⚡</span>
          <span className="font-extrabold tracking-tight text-white">CLEAR<span className="text-amber-400">HEADLIGHTS</span></span>
        </Link>
        <div className="text-slate-400 text-sm font-medium">
          Mobile Restoration Service
        </div>
      </header>

      <main className="flex-1 w-full mx-auto flex flex-col relative h-[calc(100vh-64px)] overflow-hidden">
        {step === "form" ? (
          <div className="w-full max-w-2xl mx-auto p-6 animate-fade-in my-auto overflow-y-auto max-h-full">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-extrabold text-white mb-2">Book Your Mobile Service</h1>
              <p className="text-slate-400 text-lg">
                We come to you. Secure your time slot by checking out below.
              </p>
            </div>

            <form onSubmit={handleProceedToPayment} className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1">Full Name *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 transition outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1">Email Address *</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 transition outline-none" placeholder="john@example.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1">Phone Number *</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 transition outline-none" placeholder="(314) 555-0123" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1">Service Location *</label>
                  {/* Decoy input to absorb Chrome's aggressive address autofill */}
                  <input type="text" name="address_decoy" autoComplete="shipping street-address" className="absolute opacity-0 w-px h-px overflow-hidden" tabIndex={-1} aria-hidden="true" />
                  <input 
                    required 
                    ref={addressInputRef} 
                    type="search" 
                    name="search_location" 
                    autoComplete="new-password" 
                    data-lpignore="true"
                    onFocus={(e) => { e.target.setAttribute("autocomplete", "new-password"); }}
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})} 
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 transition outline-none" 
                    placeholder="Search location..." 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">Select Service Type *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${formData.serviceType === 'standard' ? 'bg-slate-800 border-amber-500' : 'border-slate-700 hover:bg-slate-800'}`}>
                    <input type="radio" name="service" checked={formData.serviceType === 'standard'} onChange={() => setFormData({...formData, serviceType: 'standard'})} className="w-5 h-5 text-amber-500 bg-slate-950 border-slate-700 focus:ring-amber-500 focus:ring-offset-slate-900" />
                    <div className="ml-3 flex flex-col">
                      <span className="text-white font-bold">{pricing.standard.label}</span>
                      <span className="text-amber-400 font-bold">${pricing.standard.price}</span>
                    </div>
                  </label>
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${formData.serviceType === 'single' ? 'bg-slate-800 border-amber-500' : 'border-slate-700 hover:bg-slate-800'}`}>
                    <input type="radio" name="service" checked={formData.serviceType === 'single'} onChange={() => setFormData({...formData, serviceType: 'single'})} className="w-5 h-5 text-amber-500 bg-slate-950 border-slate-700 focus:ring-amber-500 focus:ring-offset-slate-900" />
                    <div className="ml-3 flex flex-col">
                      <span className="text-white font-bold">{pricing.single.label}</span>
                      <span className="text-amber-400 font-bold">${pricing.single.price}</span>
                    </div>
                  </label>
                </div>
              </div>

              <button type="submit" disabled={isInitializingPayment} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-4 rounded-xl transition mt-6 flex justify-center items-center shadow-[0_0_15px_rgba(245,158,11,0.2)] disabled:opacity-50 text-lg">
                {isInitializingPayment ? 'Preparing Secure Checkout...' : 'Proceed to Payment & Scheduling'} <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 relative bg-white w-full h-full">
            {paymentStatus === "pending" && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center p-6 overflow-y-auto">
                <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center pointer-events-auto my-auto">
                  <Lock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Preview Available Times</h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Scroll behind this window to preview our current schedule. <strong>Complete your payment to unlock the calendar and book your slot.</strong>
                  </p>
                  
                  <div className="bg-slate-900 rounded-lg p-4 mb-6 border border-slate-800 text-left">
                    <div className="flex justify-between items-center text-sm mb-3">
                      <span className="text-slate-400 font-medium">Service:</span>
                      <span className="text-white font-bold bg-slate-800 px-3 py-1 rounded-md">{selectedService.label}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-slate-800 pt-3">
                      <span className="text-slate-400 font-medium">Total Price:</span>
                      <span className="text-amber-400 font-black text-xl">${selectedService.price}.00</span>
                    </div>
                  </div>

                  {clientSecret && (
                    <div className="w-full bg-slate-900 p-4 rounded-xl border border-slate-800 mt-4 text-left">
                      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                        <CheckoutForm 
                          amount={selectedService.amount} 
                          onComplete={() => setPaymentStatus("paid")} 
                        />
                      </Elements>
                    </div>
                  )}

                  <button 
                    onClick={() => setStep("form")}
                    className="mt-6 text-slate-500 hover:text-slate-300 text-sm font-medium transition"
                  >
                    &larr; Go Back
                  </button>
                </div>
              </div>
            )}
            
            {paymentStatus === "paid" && (
              <div className="absolute top-4 right-4 z-20 bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg shadow-lg flex items-center animate-fade-in border border-emerald-400/50">
                <CheckCircle2 className="w-5 h-5 mr-2" /> Payment Successful - Please Select a Time
              </div>
            )}
            
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
      </main>
    </div>
  );
}

export default function IndividualBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 p-8 text-slate-400 flex items-center justify-center font-bold">Loading booking system...</div>}>
      <IndividualBookingContent />
    </Suspense>
  );
}
