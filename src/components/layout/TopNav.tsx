import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function TopNav() {
  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-amber-500" />
            <span className="text-xl font-bold text-slate-100 tracking-tight">
              Clear Head Lights
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Dealer Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
