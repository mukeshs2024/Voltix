import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, Activity, Sun, Battery, Zap, Clock } from 'lucide-react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Voltix - AI Operating System',
  description: 'AI-powered energy optimization and predictive analytics for intelligent buildings.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-zinc-100 antialiased min-h-screen flex flex-col`}>
        
        {/* Persistent AI Status Bar */}
        <div className="bg-zinc-950 border-b border-zinc-900 px-6 py-1.5 flex items-center justify-between text-[11px] font-medium tracking-wide text-zinc-400">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              Monitoring 8 Buildings
            </span>
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-zinc-500" /> Weather Connected
            </span>
            <span className="flex items-center gap-1.5">
              <Battery className="w-3.5 h-3.5 text-emerald-500" /> Battery Online
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-500" /> Grid Stable
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Last Analysis: Just now
          </div>
        </div>

        {/* Main Header with Global AI Copilot */}
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-100 shadow-sm">
                V
              </div>
              <span className="font-semibold text-[15px] tracking-tight">
                Voltix
              </span>
            </Link>
          </div>

          {/* Global AI Copilot Search */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-aiBlue transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Ask Voltix... e.g. Why did energy usage increase?"
                className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 text-sm rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 transition-all placeholder:text-zinc-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                 <span className="text-[10px] text-zinc-600 font-mono border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 rounded">⌘ K</span>
              </div>
            </div>
          </div>

          <nav className="flex items-center space-x-1">
            <Link href="/" className="px-3 py-1.5 rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors">Dashboard</Link>
            <Link href="/ai-center" className="px-3 py-1.5 rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors">Decision Center</Link>
            <Link href="/analytics" className="px-3 py-1.5 rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors">Analytics</Link>
            <Link href="/copilot" className="px-3 py-1.5 rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors">Copilot</Link>
            <Link href="/simulator" className="px-3 py-1.5 rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors">Simulator</Link>
            <Link href="/settings" className="px-3 py-1.5 rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors">Settings</Link>
            <Link href="/profile" className="px-3 py-1.5 rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors">Profile</Link>
          </nav>
        </header>

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
