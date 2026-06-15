import Link from 'next/link';
import { ArrowRight, FileSpreadsheet, Activity, ShieldCheck, Zap, Database, GitBranch, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060608] text-white overflow-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#060608]/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30">S</div>
            <span className="font-bold text-white text-lg tracking-tight">SplitLedger</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#tech" className="hover:text-white transition-colors">Tech Stack</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">Dashboard</Link>
            <Link href="/import" className="text-sm bg-white text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Import Data
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-40 pb-32 px-6">
        {/* Glow effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-blue-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span className="text-sm font-medium text-indigo-300">Spreetail Engineering Assignment — June 2026</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            <span className="text-white">Shared Expenses,</span><br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Done Intelligently.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            A production-grade expense splitting platform with an AI-assisted anomaly detection engine that identifies and resolves 12+ deliberate data issues from messy CSV exports — automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/import" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-100 transition-all active:scale-95 shadow-[0_0_60px_rgba(255,255,255,0.15)]">
              Launch Data Importer
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all active:scale-95 backdrop-blur-sm">
              View Live Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { val: '12+', label: 'Anomalies Detected' },
              { val: '100%', label: 'Type Safe (TypeScript)' },
              { val: '7', label: 'DB Models' },
              { val: 'Neon', label: 'Serverless Postgres' },
            ].map((s, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-3xl font-black text-white mb-1">{s.val}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-4">Core Features</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Built for Real-World Mess</h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">Real expense data is never clean. This platform was designed specifically to handle that.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <ShieldCheck className="w-7 h-7 text-indigo-400" />,
                color: 'indigo',
                title: 'Intelligent Anomaly Detection',
                desc: 'Automatically catches comma-formatted amounts, inconsistent date formats, foreign currencies (USD→INR), former members in splits, rounding errors, and conflicting duplicate rows.',
              },
              {
                icon: <FileSpreadsheet className="w-7 h-7 text-purple-400" />,
                color: 'purple',
                title: 'Transparent Import Reports',
                desc: 'Every import generates a row-by-row audit log: what was detected, what action was taken, and whether it was auto-fixed or flagged for user approval.',
              },
              {
                icon: <Activity className="w-7 h-7 text-pink-400" />,
                color: 'pink',
                title: 'Dynamic Balance Engine',
                desc: 'Balances are computed dynamically from ExpenseSplit records — never stored as running totals — ensuring 100% accuracy even when expenses are edited or deleted.',
              },
              {
                icon: <Database className="w-7 h-7 text-blue-400" />,
                color: 'blue',
                title: 'Relational Schema',
                desc: 'PostgreSQL via Prisma with 7 normalized models: User, Group, GroupMember (with joinedAt/leftAt), Expense, ExpenseSplit, ImportLog, and Anomaly.',
              },
              {
                icon: <Zap className="w-7 h-7 text-yellow-400" />,
                color: 'yellow',
                title: 'Multi-Currency Support',
                desc: 'USD amounts are converted to INR at import time using a fixed exchange rate, with the original amount and currency stored for full transparency.',
              },
              {
                icon: <GitBranch className="w-7 h-7 text-green-400" />,
                color: 'green',
                title: 'Member Lifecycle Tracking',
                desc: 'GroupMember records track joinedAt and leftAt timestamps. Former members (like Meera) are automatically excluded from expenses after they leave.',
              },
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-4">Workflow</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">How It Works</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Upload the CSV',
                desc: 'Drag and drop your expenses_export.csv into the Importer. The parser reads every row and begins validation immediately.',
                action: 'Go to Importer →',
                href: '/import'
              },
              {
                step: '02',
                title: 'Anomaly Detection Runs',
                desc: 'The engine scans for 12+ categories of issues: formatting errors, zero amounts, negative values, duplicate rows, conflicting entries, former members, foreign currencies, and percentage sum errors.',
                action: null,
                href: null
              },
              {
                step: '03',
                title: 'Review the Import Report',
                desc: 'A detailed audit table is generated showing every anomaly: the row number, what was found, the action taken (AUTO_FIXED or REQUIRES_APPROVAL), and the final value used.',
                action: null,
                href: null
              },
              {
                step: '04',
                title: 'View Live Balances',
                desc: 'Once imported, the Dashboard displays individual balances, total outstanding debt, and a full chronological expense timeline with per-expense split breakdowns.',
                action: 'View Dashboard →',
                href: '/dashboard'
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-8 p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all group">
                <div className="text-5xl font-black text-white/10 group-hover:text-indigo-500/30 transition-colors font-mono min-w-[60px]">{item.step}</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-3">{item.desc}</p>
                  {item.action && item.href && (
                    <Link href={item.href} className="text-indigo-400 text-sm font-semibold hover:text-indigo-300 transition-colors inline-flex items-center gap-1">
                      {item.action}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section id="tech" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-400 font-semibold text-sm uppercase tracking-widest mb-4">Tech Stack</p>
          <h2 className="text-4xl font-black tracking-tight text-white mb-16">Built With Modern Tools</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Next.js 16', desc: 'App Router + API Routes', color: 'from-gray-500/20 to-gray-600/20', border: 'border-gray-700/50' },
              { name: 'Prisma 5', desc: 'Type-safe ORM', color: 'from-indigo-500/20 to-indigo-600/20', border: 'border-indigo-700/50' },
              { name: 'PostgreSQL', desc: 'via Neon Serverless', color: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-700/50' },
              { name: 'TypeScript', desc: 'Full type safety', color: 'from-cyan-500/20 to-cyan-600/20', border: 'border-cyan-700/50' },
              { name: 'Tailwind CSS', desc: 'Utility-first styling', color: 'from-teal-500/20 to-teal-600/20', border: 'border-teal-700/50' },
              { name: 'Vercel', desc: 'Edge deployment', color: 'from-white/10 to-white/5', border: 'border-white/10' },
              { name: 'csv-parse', desc: 'CSV processing', color: 'from-green-500/20 to-green-600/20', border: 'border-green-700/50' },
              { name: 'date-fns', desc: 'Date normalization', color: 'from-orange-500/20 to-orange-600/20', border: 'border-orange-700/50' },
            ].map((t, i) => (
              <div key={i} className={`p-5 rounded-2xl bg-gradient-to-br ${t.color} border ${t.border} hover:scale-105 transition-transform`}>
                <div className="font-bold text-white text-base mb-1">{t.name}</div>
                <div className="text-xs text-gray-400">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">Ready to Import?</h2>
          <p className="text-gray-400 mb-10 text-lg leading-relaxed">Upload your expenses_export.csv and see the anomaly detection engine in action. Every data problem is caught, logged, and resolved.</p>
          <Link href="/import" className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-xl hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-95 shadow-[0_0_60px_rgba(99,102,241,0.3)] hover:shadow-[0_0_80px_rgba(99,102,241,0.4)]">
            Start Importing
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30">S</div>
              <div>
                <div className="font-bold text-white">SplitLedger</div>
                <div className="text-xs text-gray-500">Spreetail Engineering Assignment</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Built with Next.js</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> PostgreSQL via Neon</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Deployed on Vercel</span>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <Link href="/import" className="text-gray-400 hover:text-white transition-colors">Importer</Link>
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
              <a href="https://github.com/abhishekchauhan1365/spreetail-expense-app" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-gray-600">
            © 2026 SplitLedger · Abhishek Chauhan · Spreetail Engineering Internship Assessment
          </div>
        </div>
      </footer>

    </div>
  );
}
