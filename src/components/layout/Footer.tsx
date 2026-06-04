import { MapPin, Phone, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-slate-100 mb-4 tracking-tight">Clear Head Lights</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Professional mobile headlight restoration service. We don&apos;t just mask the problem, we extract oxidation and apply a durable UV shield to keep you safe at night.
          </p>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold text-slate-200 mb-4">Service Area</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-slate-400">
              <MapPin className="h-5 w-5 text-amber-500 shrink-0" />
              <span>
                Based in Fenton, MO.<br/>
                Serving the <span className="text-slate-300 font-semibold">Greater St. Louis Area.</span><br/>
                <span className="text-xs text-slate-500 mt-1 block">Manchester Road corridor, South Lindbergh, Ballwin, and Kirkwood.</span>
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-slate-200 mb-4">Contact & Hours</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-sm text-slate-400">
              <Phone className="h-5 w-5 text-amber-500" />
              <span>Call/Text: (314) 347-886</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-400">
              <Clock className="h-5 w-5 text-amber-500 shrink-0" />
              <span>
                Mon–Fri: 8:00 AM – 5:00 PM<br/>
                Sat: By Appointment
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Clear Head Lights. All rights reserved.
      </div>
    </footer>
  );
}
