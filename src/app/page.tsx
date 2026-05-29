import { Shield, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Zap, Truck, XCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 group">
            <Zap className="text-amber-500 w-6 h-6 fill-amber-500 group-hover:scale-110 transition-transform" />
            <span className="font-extrabold text-xl tracking-tight text-white">
              CLEAR<span className="text-amber-500">HEADLIGHTS</span>
            </span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-bold text-slate-300">
            <Link href="#hazard" className="hover:text-amber-400 transition">The Hazard</Link>
            <Link href="#solution" className="hover:text-amber-400 transition">Our Solution</Link>
            <Link href="#dealerships" className="hover:text-amber-400 transition">For Dealerships</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/dealer" className="hidden sm:block text-sm font-bold text-slate-400 hover:text-white transition">
              Dealer Login
            </Link>
            <Link href="#book" className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2 rounded-lg text-sm font-bold transition shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center">
              Book Now <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-32 border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/40 via-slate-950 to-slate-950"></div>
          
          {/* Decorative Lightning Bolts Background */}
          <Zap className="absolute top-20 left-10 text-amber-500/10 w-32 h-32 -rotate-12" />
          <Zap className="absolute bottom-20 right-10 text-red-500/10 w-48 h-48 rotate-12" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Clear. Bright. <br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Safe at Night.</span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-slate-300 max-w-2xl mx-auto font-medium">
              Professional mobile headlight restoration in Fenton & St. Louis.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#book" className="w-full sm:w-auto rounded-lg bg-amber-500 px-8 py-4 text-base font-extrabold text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:bg-amber-400 hover:scale-105 transition-all flex items-center justify-center">
                <Zap className="w-5 h-5 mr-2 fill-slate-950" /> Book Residential Service
              </Link>
              <Link href="/partnership" className="w-full sm:w-auto rounded-lg bg-slate-800 border border-slate-700 px-8 py-4 text-base font-bold text-white hover:bg-slate-700 transition-all flex items-center justify-center">
                Dealership Partner Program
              </Link>
            </div>
          </div>
        </section>

        {/* The Hazard Section */}
        <section id="hazard" className="py-24 bg-slate-950 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 relative">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white inline-block relative">
                The Hazard: <span className="text-red-500">Dangerous Dimming</span>
                <div className="absolute -bottom-4 left-0 right-0 h-1 bg-red-500 rounded-full w-1/2 mx-auto"></div>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="space-y-8">
                <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-8 relative overflow-hidden group hover:border-red-500/50 transition">
                  <div className="absolute top-0 right-0 bg-red-500/10 w-32 h-32 rounded-bl-full -z-0"></div>
                  <div className="flex items-start relative z-10">
                    <Zap className="text-red-500 w-12 h-12 mr-6 shrink-0 fill-red-500" />
                    <div>
                      <h3 className="text-5xl font-extrabold text-red-500 mb-2">80% <span className="text-2xl text-white">LOSS</span></h3>
                      <p className="text-slate-300 font-medium">AAA studies show that severe lens oxidation can block up to 80% of your headlight's light output.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-8 relative overflow-hidden group hover:border-red-500/50 transition">
                  <div className="absolute top-0 right-0 bg-red-500/10 w-32 h-32 rounded-bl-full -z-0"></div>
                  <div className="flex items-start relative z-10">
                    <AlertTriangle className="text-red-500 w-12 h-12 mr-6 shrink-0" />
                    <div>
                      <h3 className="text-2xl font-extrabold text-red-500 mb-2">Increased Deer Strike Risk</h3>
                      <p className="text-slate-300 font-medium">Reduced visibility significantly limits your reaction time on dark, rural Missouri roads.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* DIY vs Pro Section */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
                <h3 className="text-2xl font-extrabold text-white text-center mb-8">DIY vs. Professional Grade</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center">
                      <XCircle className="text-slate-500 w-8 h-8 mr-4" />
                      <div>
                        <h4 className="font-bold text-white">DIY Retail Kits</h4>
                        <p className="text-sm text-slate-400">Masks fogging temporarily.</p>
                      </div>
                    </div>
                    <span className="text-slate-500 font-bold text-sm bg-slate-800 px-3 py-1 rounded-full">1-3 Months</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 relative overflow-hidden">
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                    <div className="flex items-center">
                      <Shield className="text-amber-500 w-8 h-8 mr-4" />
                      <div>
                        <h4 className="font-bold text-amber-500">Professional Grade</h4>
                        <p className="text-sm text-amber-200/70">Restoration Built to Last.</p>
                      </div>
                    </div>
                    <span className="text-amber-500 font-bold text-sm bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">Long-Term</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider Line */}
            <div className="flex items-center justify-center my-16">
              <div className="h-px bg-gradient-to-r from-slate-950 via-blue-500 to-slate-950 flex-1"></div>
              <div className="mx-4 p-3 rounded-full border-2 border-blue-500 text-blue-500">
                <Zap className="w-6 h-6 fill-blue-500" />
              </div>
              <div className="h-px bg-gradient-to-r from-slate-950 via-amber-500 to-slate-950 flex-1"></div>
            </div>

          </div>
        </section>

        {/* The Professional Solution */}
        <section id="solution" className="py-24 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
          <Zap className="absolute top-10 right-20 text-amber-500/5 w-64 h-64 rotate-45" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-16 text-center">The Professional Solution</h2>
            
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl flex items-start">
                <div className="bg-blue-500/10 p-4 rounded-xl mr-6">
                  <Truck className="w-10 h-10 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3 flex items-center">
                    We Come to You <Zap className="ml-2 w-5 h-5 text-amber-500 fill-amber-500" />
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    Mobile service brought straight to your home, office, or dealership lot for maximum convenience. No waiting rooms, no dropping off your car.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl flex items-start">
                <div className="bg-amber-500/10 p-4 rounded-xl mr-6">
                  <Sparkles className="w-10 h-10 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Proprietary 10-Step Sequence</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Uses specialized prep agents, mechanical buffing, and an industrial-grade durable UV barrier to seal lenses at a molecular level.
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Table & Booking CTA */}
            <div className="max-w-4xl mx-auto bg-slate-950 border border-blue-500/30 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
              <div className="flex-1 p-0">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 border-b border-slate-800">
                    <tr>
                      <th className="px-8 py-5 text-lg font-bold text-blue-400">Service Tier</th>
                      <th className="px-8 py-5 text-lg font-bold text-blue-400 border-l border-slate-800">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr className="hover:bg-slate-900/50 transition">
                      <td className="px-8 py-6 text-white font-bold text-lg">Standard Mobile Set</td>
                      <td className="px-8 py-6 text-amber-400 font-extrabold text-2xl border-l border-slate-800">$45.00</td>
                    </tr>
                    <tr className="hover:bg-slate-900/50 transition">
                      <td className="px-8 py-6 text-white font-bold text-lg">Single Headlight Fix</td>
                      <td className="px-8 py-6 text-amber-400 font-extrabold text-2xl border-l border-slate-800">$35.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-amber-500 p-8 flex flex-col items-center justify-center md:w-72 text-slate-950">
                <h3 className="text-xl font-black text-center mb-6 leading-tight uppercase tracking-wide">Book Your Restoration Now</h3>
                <Link href="#book" className="bg-slate-950 text-white hover:bg-slate-900 px-8 py-4 rounded-xl font-bold transition shadow-xl w-full text-center flex items-center justify-center">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Residential Booking Form */}
        <section id="book" className="py-24 bg-slate-950">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Zap className="w-12 h-12 text-amber-500 fill-amber-500 mx-auto mb-4" />
              <h2 className="text-4xl font-extrabold text-white mb-4">Request Mobile Service</h2>
              <p className="text-slate-400">Fill out your details and we'll contact you to schedule your mobile restoration.</p>
            </div>
            
            <form className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl">
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
                    <span className="ml-3 text-white font-bold">Single Light ($35)</span>
                  </label>
                </div>
              </div>

              <button type="button" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-4 rounded-xl transition text-lg flex justify-center items-center">
                Submit Request <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </form>
          </div>
        </section>
        
        {/* Dealership Banner */}
        <section id="dealerships" className="py-16 bg-blue-900 border-y border-blue-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl font-extrabold text-white mb-4">Dealership Manager?</h2>
            <p className="text-blue-200 mb-8 text-lg">
              Boost your lot's Curb Appeal and front-end gross. We offer rapid parallel processing for high-volume lots at exclusive partnership rates.
            </p>
            <Link href="/partnership" className="inline-block bg-white hover:bg-slate-100 text-blue-900 px-8 py-3 rounded-xl font-extrabold transition shadow-lg">
              View Partnership Proposal
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Zap className="text-amber-500 w-5 h-5 fill-amber-500" />
            <span className="font-extrabold text-lg text-white">CLEAR<span className="text-amber-500">HEADLIGHTS</span></span>
          </div>
          <div className="text-slate-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} Clear Head Lights. All rights reserved. Fenton, MO.
          </div>
        </div>
      </footer>
    </div>
  );
}
