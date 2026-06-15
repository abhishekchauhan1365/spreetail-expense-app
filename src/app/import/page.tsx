'use client';

import { useState } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle } from 'lucide-react';

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
        // Fetch the anomalies
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Import CSV Data</h1>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <UploadCloud className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Upload your expenses</h2>
          <p className="text-gray-500 mb-6">Select the expenses_export.csv file to parse anomalies</p>
          
          <input 
            type="file" 
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mb-6"
          />
          
          <button 
            onClick={handleImport}
            disabled={!file || isLoading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Run Importer'}
          </button>
        </div>

        {report && (
          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4">Import Report</h2>
            <div className="flex gap-4 mb-6">
              <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Status: {report.status}
              </div>
              <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Anomalies Found: {report.anomalies.length}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 font-semibold text-gray-600">Row</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Issue</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Action Taken</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.anomalies.map((anomaly: any) => (
                    <tr key={anomaly.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4">{anomaly.rowNumber}</td>
                      <td className="py-3 px-4">{anomaly.description}</td>
                      <td className="py-3 px-4 text-gray-600">{anomaly.actionTaken}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          anomaly.status === 'AUTO_FIXED' ? 'bg-green-100 text-green-700' :
                          anomaly.status === 'REQUIRES_APPROVAL' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {anomaly.status}
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
