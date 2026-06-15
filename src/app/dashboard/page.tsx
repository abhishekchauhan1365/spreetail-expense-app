'use client';

import { useEffect, useState } from 'react';
import { Users, Receipt, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [data, setData] = useState<{ balances: any[], expenses: any[] } | null>(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  if (!data) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Link href="/import" className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200">
            Import More
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Balances */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center"><Users className="w-5 h-5 mr-2" /> Member Balances</h2>
            <div className="space-y-4">
              {data.balances.map((b: any, i) => (
                <div key={i} className="flex justify-between items-center p-4 border rounded-lg">
                  <span className="font-semibold text-gray-800">{b.name}</span>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${b.net > 0 ? 'text-green-600' : b.net < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {b.net > 0 ? '+' : ''}{b.net.toFixed(2)} INR
                    </div>
                    <div className="text-sm text-gray-500">
                      Paid: {b.paid.toFixed(0)} | Owes: {b.owes.toFixed(0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center"><Receipt className="w-5 h-5 mr-2" /> Recent Expenses</h2>
            <div className="space-y-4 h-[600px] overflow-y-auto pr-2">
              {data.expenses.map((e: any) => (
                <div key={e.id} className="p-4 border rounded-lg hover:border-indigo-200 transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{e.description}</h3>
                      <p className="text-sm text-gray-500">{new Date(e.date).toLocaleDateString()}</p>
                    </div>
                    <span className="font-bold text-gray-900">{e.amount.toFixed(2)} INR</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <span>{e.paidBy?.name || 'Unknown'} paid</span>
                    <ArrowRight className="w-4 h-4 mx-2 text-gray-400" />
                    <span>{e.splits.length} people</span>
                  </div>
                </div>
              ))}
              {data.expenses.length === 0 && (
                <p className="text-gray-500 text-center mt-8">No expenses found. Run the importer first.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
