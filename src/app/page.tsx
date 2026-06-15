import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Shared Expenses App</h1>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        This application satisfies the Spreetail assignment requirements. To begin testing the anomaly detection and CSV parsing, please navigate to the Import page.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/import"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition"
        >
          Go to Data Importer
        </Link>
        <Link 
          href="/dashboard"
          className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium shadow-sm hover:bg-gray-50 transition"
        >
          View Dashboard
        </Link>
      </div>

      <div className="mt-16 max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Key Features</h2>
        <ul className="space-y-3 text-gray-600 list-disc list-inside">
          <li><strong>Robust CSV Importer:</strong> Detects 12+ deliberate data anomalies (formats, rounding errors, missing fields, foreign currency) and handles them explicitly.</li>
          <li><strong>Anomaly Log:</strong> Generates a detailed "Import Report" summarizing every row modified, dropped, or flagged for user review.</li>
          <li><strong>Relational DB:</strong> Built on PostgreSQL via Prisma for strict data integrity.</li>
          <li><strong>Dynamic Balances:</strong> Balances are calculated dynamically rather than stored as running totals to prevent desynchronization.</li>
        </ul>
      </div>
    </div>
  );
}
