import Link from 'next/link';
import { ArrowRight, FileSpreadsheet, Activity, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent blur-[100px] -z-10 rounded-full" />
      
      <main className="container mx-auto px-6 pt-32 pb-24 relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-sm font-medium text-gray-300">Assignment Ready for Review</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 drop-shadow-sm">
          Shared Expenses <br className="hidden md:block" /> Reimagined.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl font-light leading-relaxed">
          A premium, intelligent platform designed to detect anomalies, resolve conflicts, and perfectly balance group debts. Built for the Spreetail Engineering Assessment.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 mb-24 w-full justify-center">
          <Link 
            href="/import"
            className="group relative px-8 py-4 bg-white text-black rounded-2xl font-semibold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center"
          >
            <span className="relative z-10 flex items-center gap-2">
              Launch Importer <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link 
            href="/dashboard"
            className="group px-8 py-4 bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-2xl font-semibold text-lg transition-all hover:scale-105 active:scale-95 backdrop-blur-md flex items-center justify-center"
          >
            View Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-indigo-400" />}
            title="Bulletproof Parsing"
            desc="Handles 12+ deliberate CSV anomalies including foreign currencies, rounding errors, and duplicates."
          />
          <FeatureCard 
            icon={<FileSpreadsheet className="w-6 h-6 text-purple-400" />}
            title="Comprehensive Logs"
            desc="Generates real-time, transparent Import Reports categorizing every action taken."
          />
          <FeatureCard 
            icon={<Activity className="w-6 h-6 text-blue-400" />}
            title="Dynamic Ledgers"
            desc="Balances are computed dynamically via Prisma & Postgres, preventing state desynchronization."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors text-left group">
      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}
