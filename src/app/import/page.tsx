'use client';

import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertTriangle, ChevronLeft, ShieldAlert, FileText, ArrowRight, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImport = async () => {
    if (!file) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/import', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        const logRes = await fetch(`/api/import/${data.log.id}`);
        const logData = await logRes.json();
        setReport(logData);
      } else { alert(data.error); }
    } catch (e) { console.error(e); alert('Upload failed'); }
    finally { setIsLoading(false); }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f?.name.endsWith('.csv')) {
      if (f.size > 4.5 * 1024 * 1024) {
        alert('File size exceeds the 4.5MB limit. Please upload a smaller CSV.');
        return;
      }
      setFile(f);
    }
  };

  const autoCount = report?.anomalies?.filter((a: any) => a.status === 'AUTO_FIXED').length ?? 0;
  const approvalCount = report?.anomalies?.filter((a: any) => a.status === 'REQUIRES_APPROVAL').length ?? 0;

  return (
    <div className="min-h-screen bg-[#060608] text-white font-sans">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#060608]/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30">S</div>
            <span className="font-bold text-white text-lg tracking-tight">SplitLedger</span>
          </Link>
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors group text-sm font-medium">
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">Intelligent CSV Parser</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-white">
            Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Importer</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Upload your <code className="text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded text-sm">expenses_export.csv</code>. The engine will auto-detect and resolve anomalies, then generate a full audit report.
          </p>
        </div>

        {!report ? (
          <>
            {/* Drop Zone */}
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 p-16 text-center mb-6 ${
                isDragging
                  ? 'border-indigo-400 bg-indigo-500/10 scale-[1.02]'
                  : file
                  ? 'border-green-500/50 bg-green-500/5'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    if (f.size > 4.5 * 1024 * 1024) {
                      alert('File size exceeds the 4.5MB limit. Please upload a smaller CSV.');
                      setFile(null);
                    } else {
                      setFile(f);
                    }
                  } else {
                    setFile(null);
                  }
                }}
                className="hidden"
              />
              
              <div className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center border transition-all ${
                file ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/10'
              }`}>
                {file
                  ? <CheckCircle2 className="w-10 h-10 text-green-400" />
                  : <UploadCloud className="w-10 h-10 text-gray-400" />
                }
              </div>

              {file ? (
                <div>
                  <p className="text-xl font-bold text-green-400 mb-2">{file.name}</p>
                  <p className="text-gray-500 text-sm">{(file.size / 1024).toFixed(1)} KB · Click to change file</p>
                </div>
              ) : (
                <div>
                  <p className="text-xl font-bold text-white mb-2">Drop your CSV here</p>
                  <p className="text-gray-500">or click to browse — accepts .csv files only</p>
                </div>
              )}
            </div>

            {/* What we detect */}
            <div className="mb-8 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
              <p className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-widest">What the engine detects</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Amount formatting', 'Foreign currencies', 'Date inconsistencies', 'Duplicate rows', 'Zero amounts', 'Rounding errors', 'Former members', 'Conflicting entries'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleImport}
              disabled={!file || isLoading}
              className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-xl hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99] shadow-[0_0_40px_rgba(99,102,241,0.2)] hover:shadow-[0_0_60px_rgba(99,102,241,0.3)]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Analyzing CSV...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Run Intelligent Import <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </button>
          </>
        ) : (
          <div className="space-y-6">
            {/* Report Header */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">Import Report</h2>
                  <p className="text-gray-400">Analysis complete. Every anomaly has been logged below.</p>
                </div>
                <div className="flex gap-3">
                  <Link href="/dashboard" className="flex items-center gap-2 px-5 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-colors text-sm">
                    View Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button onClick={() => { setReport(null); setFile(null); }} className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors text-sm">
                    <X className="w-4 h-4" /> New Import
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-3xl font-black text-white mb-1">{report.anomalies.length}</div>
                  <div className="text-sm text-gray-400">Total Anomalies Found</div>
                </div>
                <div className="p-5 rounded-2xl bg-green-500/10 border border-green-500/20">
                  <div className="text-3xl font-black text-green-400 mb-1">{autoCount}</div>
                  <div className="text-sm text-gray-400">Auto-Fixed</div>
                </div>
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <div className="text-3xl font-black text-amber-400 mb-1">{approvalCount}</div>
                  <div className="text-sm text-gray-400">Requires Approval</div>
                </div>
              </div>
            </div>

            {/* Anomaly Table */}
            <div className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Anomaly Log</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                      <th className="py-4 px-6 font-semibold text-gray-400 text-xs uppercase tracking-wider w-20">Row</th>
                      <th className="py-4 px-6 font-semibold text-gray-400 text-xs uppercase tracking-wider">Detected Issue</th>
                      <th className="py-4 px-6 font-semibold text-gray-400 text-xs uppercase tracking-wider">Action Taken</th>
                      <th className="py-4 px-6 font-semibold text-gray-400 text-xs uppercase tracking-wider w-48">Resolution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {report.anomalies.map((anomaly: any) => (
                      <tr key={anomaly.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-4 px-6 text-gray-500 font-mono text-sm font-bold">#{anomaly.rowNumber}</td>
                        <td className="py-4 px-6 font-medium text-gray-200 text-sm">{anomaly.description}</td>
                        <td className="py-4 px-6 text-gray-400 text-sm">{anomaly.actionTaken}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border ${
                            anomaly.status === 'AUTO_FIXED'
                              ? 'bg-green-500/10 text-green-400 border-green-500/20'
                              : anomaly.status === 'REQUIRES_APPROVAL'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {anomaly.status === 'AUTO_FIXED'
                              ? <CheckCircle2 className="w-3 h-3" />
                              : anomaly.status === 'REQUIRES_APPROVAL'
                              ? <ShieldAlert className="w-3 h-3" />
                              : <AlertTriangle className="w-3 h-3" />
                            }
                            {anomaly.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <span>© 2026 SplitLedger · Spreetail Engineering Assignment</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
            <Link href="/dashboard" className="hover:text-gray-400 transition-colors">Dashboard</Link>
            <a href="https://github.com/abhishekchauhan1365/spreetail-expense-app" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
