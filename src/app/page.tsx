import { Shield, Sparkles, AlertTriangle, ArrowRight, Zap, CheckCircle2, MapPin } from "lucide-react";
import Link from "next/link";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import LeadForm from "@/components/ui/LeadForm";
import Image from "next/image";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": "Clear Head Lights",
    "image": "https://stlclearheadlights.com/images/before-after-v2.png",
    "url": "https://stlclearheadlights.com",
    "telephone": "+13143478886",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Fenton",
      "addressRegion": "MO",
      "addressCountry": "US"
    },
    "areaServed": ["St. Louis", "Fenton", "Ballwin", "Kirkwood"],
    "priceRange": "$$"
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 font-sans text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopNav />

      <main className="flex-grow pt-16">
        {/* HERO SECTION */}
        <section className="relative py-24 lg:py-32 overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" /> Professional Mobile Service
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 text-white leading-tight">
                Mobile Headlight Restoration <br />
                <span className="text-amber-500">in St. Louis</span>
              </h1>
              <h2 className="text-xl font-semibold text-slate-300 mb-6">Clear. Bright. Safe at Night.</h2>
              <p className="text-lg lg:text-xl text-slate-400 mb-8 max-w-lg leading-relaxed">
                Did you know that oxidation on modern acrylic headlights can reduce light output by up to <strong className="text-amber-400">80%</strong>? Don't let foggy headlights put your family at risk on dark Missouri roads.
              </p>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 max-w-lg">
                <h3 className="text-red-400 font-bold flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-5 h-5" /> The Truth About DIY Kits
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Store-bought DIY kits and "quick wipe" hacks almost never work. If you do manage to get them clear, the results usually only last a month before yellowing again. Stop wasting money on temporary fixes and get a permanent professional UV barrier.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#book" className="inline-flex justify-center items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                  Book Mobile Service <ArrowRight className="w-5 h-5" />
                </a>
                <Link href="#dealers" className="inline-flex justify-center items-center gap-2 bg-slate-900 border border-slate-700 hover:border-slate-500 text-white px-8 py-4 rounded-xl font-bold transition-all">
                  Dealership Solutions
                </Link>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl lg:h-[500px]">
              {/* Before/After Placeholder Image */}
              <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                <Image 
                  src="/images/before-after-v2.png" 
                  alt="Before and After Headlight Restoration" 
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {/* Overlay labels */}
              <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-lg border border-slate-700/50">
                <span className="text-red-400 font-bold text-sm tracking-widest uppercase">Oxidized (Danger)</span>
              </div>
              <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-lg border border-slate-700/50">
                <span className="text-emerald-400 font-bold text-sm tracking-widest uppercase">Restored (Safe)</span>
              </div>
            </div>
          </div>
        </section>

        {/* AUDIENCE TRACKS */}
        <section className="py-24 bg-slate-950 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white">Tailored Solutions</h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">We provide specialized service tracks for individual car owners and high-volume dealership lots in the Fenton area.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Individuals Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-amber-500/50 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Shield className="w-32 h-32 text-amber-500" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6">
                    <Shield className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Individual Car Owners</h3>
                  <p className="text-slate-400 mb-6 min-h-[80px]">
                    Protect your family and avoid deer strikes. We come directly to your home or office. Don't rely on 1-3 month DIY kits; get a professional UV barrier.
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-slate-300">Standard Mobile Set</span>
                      <strong className="text-white text-xl">$45.00</strong>
                    </li>
                    <li className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <span className="text-slate-300">Single Headlight Fix</span>
                      <strong className="text-white text-xl">$30.00</strong>
                    </li>
                    <li className="flex items-start text-slate-300 pt-1">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 mr-2 shrink-0 mt-0.5" /> 
                      <span className="text-sm"><strong>Ultimate Convenience:</strong> No waiting in dingy shop lobbies. We come directly to your driveway or workplace.</span>
                    </li>
                  </ul>
                  <a href="#book" className="w-full inline-flex justify-center items-center bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-bold transition-colors">
                    Schedule Your Vehicle
                  </a>
                </div>
              </div>

              {/* Dealerships Card */}
              <div id="dealers" className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Zap className="w-32 h-32 text-blue-500" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Dealerships</h3>
                  <p className="text-slate-400 mb-6 min-h-[80px]">
                    Increase your inventory's "Curb Appeal" and Safety ROI. We offer parallel processing (3-4 cars simultaneously) so we don't slow down your lot.
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-slate-300">Partner Pricing (5+ Vehicles)</span>
                      <strong className="text-blue-400 text-xl">$35.00 <span className="text-sm font-normal text-slate-500">/set</span></strong>
                    </li>
                    <li className="flex items-center text-slate-300 pt-2 border-b border-slate-800 pb-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 shrink-0" /> Bypasses costly replacement assemblies
                    </li>
                    <li className="flex items-start text-slate-300 pt-1">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 mr-2 shrink-0 mt-0.5" /> 
                      <span className="text-sm"><strong>Exclusive Dealer Portal:</strong> Easily schedule visits, track past vehicles, and manage billing all in one place.</span>
                    </li>
                  </ul>
                  <Link href="/partnership" className="w-full inline-flex justify-center items-center bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-bold transition-colors">
                    Request Lot Analysis
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10-STEP PROCESS */}
        <section className="py-24 bg-slate-900 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
                Technical Excellence
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-6">Our Proprietary 10-Step Process</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                We don't just "wipe away" the fog. Our mobile unit executes a professional-grade, multi-stage sequence to restore crystal-clear transparency and lock out moisture.
              </p>

              <div className="space-y-6">
                {[
                  { title: "Surface Decontamination & Masking", desc: "Specialized prep agent breaks down road film; surrounding paint is securely protected." },
                  { title: "Deep Chemical Clean & Extraction", desc: "Active agent dissolves stubborn yellowing, carefully extracted with pro-grade materials." },
                  { title: "Mechanical Precision Buffing", desc: "Polishing for 5 minutes per light with an electric buffer and pristine pads." },
                  { title: "UV Shield Application & Dwell", desc: "Industrial-grade sealant bonds to the lens creating a durable, long-lasting UV barrier." }
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-500 font-bold shrink-0 mt-1">
                      {i+1}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">{step.title}</h4>
                      <p className="text-slate-400 text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Glowing Abstract Graphic */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px] lg:h-[600px] border border-slate-800 bg-slate-950">
              <Image 
                src="/images/process-shield-v2.png" 
                alt="UV Shield Technology" 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-slate-900/90 backdrop-blur-md p-6 rounded-xl border border-slate-700/50">
                  <h4 className="text-amber-500 font-bold mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5" /> Molecular UV Bonding
                  </h4>
                  <p className="text-slate-300 text-sm">Our protective dwell phase ensures the UV barrier correctly bonds to the acrylic lens, preventing future oxidation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOOKING SECTION */}
        <section id="book" className="py-24 bg-slate-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">Request Mobile Service</h2>
              <p className="text-slate-400 flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" /> Serving the Greater St. Louis Area. Fill out your details below and we'll contact you to schedule.
              </p>
            </div>
            
            <LeadForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
