'use client';

import { useState } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, ChevronLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleImport = async () => {
    if (!file) return;
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        const logRes = await fetch(`/api/import/${data.log.id}`);
        const logData = await logRes.json();
        setReport(logData);
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
      alert('Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8 group">
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
            Data Importer
          </h1>
          {report && (
            <Link href="/dashboard" className="px-6 py-2.5 bg-white text-black rounded-xl font-medium hover:bg-gray-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              View Dashboard &rarr;
            </Link>
          )}
        </div>
        
        {!report ? (
          <div className="bg-white/5 p-12 rounded-[2rem] border border-white/10 text-center relative overflow-hidden backdrop-blur-xl shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20 bg-gradient-to-b from-indigo-500/50 to-transparent blur-[100px] -z-10" />
            
            <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
              <UploadCloud className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">Upload Export Dataset</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              Select your <code className="bg-black/30 px-2 py-1 rounded text-indigo-300">expenses_export.csv</code> file. The intelligent parser will identify and sanitize all anomalies.
            </p>
            
            <div className="max-w-md mx-auto relative group">
              <input 
                type="file" 
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`p-4 rounded-xl border-2 border-dashed transition-all ${file ? 'border-indigo-400 bg-indigo-400/10' : 'border-white/20 bg-black/20 group-hover:border-indigo-400/50 group-hover:bg-white/5'}`}>
                <span className={`font-medium ${file ? 'text-indigo-300' : 'text-gray-400'}`}>
                  {file ? file.name : 'Click or drag file here'}
                </span>
              </div>
            </div>
            
            <button 
              onClick={handleImport}
              disabled={!file || isLoading}
              className="mt-8 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-semibold text-lg transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center gap-2"><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Processing...</span>
              ) : 'Run Intelligent Import'}
            </button>
          </div>
        ) : (
          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/10 pb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Import Report</h2>
                <p className="text-gray-400">Analysis complete. See resolution log below.</p>
              </div>
              <div className="flex gap-4">
                <div className="px-5 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl flex items-center font-medium shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                  <CheckCircle className="w-5 h-5 mr-2.5" />
                  Processed
                </div>
                <div className="px-5 py-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center font-medium shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                  <AlertTriangle className="w-5 h-5 mr-2.5" />
                  {report.anomalies.length} Anomalies Logged
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="py-4 px-6 font-semibold text-gray-300 w-20">Row</th>
                    <th className="py-4 px-6 font-semibold text-gray-300">Detected Issue</th>
                    <th className="py-4 px-6 font-semibold text-gray-300">Action Taken</th>
                    <th className="py-4 px-6 font-semibold text-gray-300 w-48">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {report.anomalies.map((anomaly: any) => (
                    <tr key={anomaly.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-6 text-gray-400 font-mono text-sm">{anomaly.rowNumber}</td>
                      <td className="py-4 px-6 font-medium text-gray-200">{anomaly.description}</td>
                      <td className="py-4 px-6 text-gray-400">{anomaly.actionTaken}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-lg border ${
                          anomaly.status === 'AUTO_FIXED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          anomaly.status === 'REQUIRES_APPROVAL' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {anomaly.status === 'REQUIRES_APPROVAL' && <ShieldAlert className="w-3 h-3 mr-1.5" />}
                          {anomaly.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
