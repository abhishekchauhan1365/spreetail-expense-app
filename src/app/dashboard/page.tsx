'use client';

import { useEffect, useState } from 'react';
import { Users, Receipt, ArrowRight, Wallet, ChevronLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [data, setData] = useState<{ balances: any[], expenses: any[] } | null>(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  if (!data) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <span className="text-gray-400 font-medium">Syncing Ledger...</span>
      </div>
    </div>
  );

  const totalOwed = data.balances.reduce((acc, b) => acc + (b.net < 0 ? Math.abs(b.net) : 0), 0);
  const totalVolume = data.expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] opacity-10 bg-gradient-to-bl from-indigo-500 via-purple-500 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] opacity-10 bg-gradient-to-tr from-blue-500 via-indigo-500 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4 group text-sm font-medium">
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-gray-400">
              Financial Overview
            </h1>
          </div>
          <Link href="/import" className="px-6 py-3 bg-white/10 text-white border border-white/10 hover:bg-white/20 rounded-2xl font-medium transition-all backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center">
            <UploadCloudIcon className="w-4 h-4 mr-2" /> Import CSV
          </Link>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl flex items-center shadow-2xl">
            <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mr-6 border border-indigo-500/20">
              <Wallet className="w-7 h-7" />
            </div>
            <div>
              <p className="text-gray-400 font-medium mb-1">Total Outstanding Debt</p>
              <h3 className="text-3xl font-bold text-white">{totalOwed.toFixed(2)} INR</h3>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl flex items-center shadow-2xl">
            <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mr-6 border border-purple-500/20">
              <CreditCard className="w-7 h-7" />
            </div>
            <div>
              <p className="text-gray-400 font-medium mb-1">Total Expense Volume</p>
              <h3 className="text-3xl font-bold text-white">{totalVolume.toFixed(2)} INR</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Balances Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white/5 p-8 rounded-[2rem] shadow-2xl border border-white/10 backdrop-blur-xl flex-1">
              <h2 className="text-2xl font-bold mb-6 flex items-center tracking-tight"><Users className="w-6 h-6 mr-3 text-indigo-400" /> Member Balances</h2>
              <div className="space-y-4">
                {data.balances.map((b: any, i) => (
                  <div key={i} className="group relative p-5 rounded-2xl bg-black/20 border border-white/5 hover:border-white/20 transition-all overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.02] to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                          {b.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-200 text-lg">{b.name}</span>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold tracking-tight ${b.net > 0 ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]' : b.net < 0 ? 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.3)]' : 'text-gray-500'}`}>
                          {b.net > 0 ? '+' : ''}{b.net.toFixed(2)} INR
                        </div>
                        <div className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wider">
                          Paid {b.paid.toFixed(0)} <span className="mx-1 opacity-50">|</span> Owes {b.owes.toFixed(0)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expenses Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white/5 p-8 rounded-[2rem] shadow-2xl border border-white/10 backdrop-blur-xl flex-1">
              <h2 className="text-2xl font-bold mb-6 flex items-center tracking-tight"><Receipt className="w-6 h-6 mr-3 text-purple-400" /> Ledger Timeline</h2>
              
              <div className="space-y-4 h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                {data.expenses.map((e: any) => (
                  <div key={e.id} className="group p-5 rounded-2xl bg-black/20 border border-white/5 hover:border-white/20 transition-all hover:bg-white/5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-gray-100 text-lg group-hover:text-white transition-colors">{e.description}</h3>
                        <p className="text-sm text-gray-500 font-medium">{new Date(e.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                      <span className="font-bold text-xl text-white tracking-tight">{e.amount.toFixed(2)} INR</span>
                    </div>
                    
                    <div className="flex items-center text-sm font-medium text-gray-400 bg-black/30 p-3 rounded-xl border border-white/5">
                      <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs mr-2 border border-indigo-500/30">
                        {e.paidBy?.name?.charAt(0) || '?'}
                      </div>
                      <span className="text-indigo-300 mr-2">{e.paidBy?.name || 'Unknown'}</span> 
                      paid for 
                      <ArrowRight className="w-4 h-4 mx-3 text-gray-600" />
                      <div className="flex -space-x-2">
                        {e.splits.slice(0, 3).map((s: any, idx: number) => (
                          <div key={idx} className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] text-gray-300" title={s.user?.name}>
                            {s.user?.name?.charAt(0)}
                          </div>
                        ))}
                        {e.splits.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] text-gray-400">
                            +{e.splits.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {data.expenses.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Receipt className="w-16 h-16 text-gray-700 mb-4" />
                    <p className="text-gray-400 font-medium">Ledger is empty.</p>
                    <p className="text-gray-600 text-sm mt-2">Run the intelligent importer to populate the timeline.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  );
}

function UploadCloudIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
      <path d="M12 12v9"/>
      <path d="m16 16-4-4-4 4"/>
    </svg>
  );
}
