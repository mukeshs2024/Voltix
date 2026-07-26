import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Voltix - AI Energy Management & Decision Center',
  description: 'Real-time AI-powered energy optimization and predictive analytics platform for microgrids.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-height-screen flex flex-col">
        <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center font-black text-slate-950 shadow-lg shadow-cyan-500/20 text-lg">
              ⚡
            </div>
            <div>
              <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                VOLTIX
              </span>
              <span className="text-xs text-slate-400 ml-2 font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                AI ENGINE v2.4
              </span>
            </div>
          </div>

          <nav className="flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/60">
            <Link
              href="/ai-center"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-cyan-400 hover:bg-slate-800/60 transition-all flex items-center gap-2"
            >
              <span>🧠</span> AI Decision Center
            </Link>
            <Link
              href="/analytics"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-cyan-400 hover:bg-slate-800/60 transition-all flex items-center gap-2"
            >
              <span>📊</span> Analytics
            </Link>
          </nav>
        </header>

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
