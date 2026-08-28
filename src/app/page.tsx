import { Sparkles, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
            Good afternoon.
          </h1>
          <p className="text-lg text-[var(--color-muted-foreground)]">
            Here's what's happening across the agency today.
          </p>
        </div>
      </div>

      {/* AI Intelligence Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-card)] to-[#1a1a00] border border-[var(--color-primary)]/20 p-6 md:p-8 group shadow-lg shadow-[var(--color-primary)]/5">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-3xl group-hover:bg-[var(--color-primary)]/20 transition-all duration-700"></div>
        
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-2xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2 flex items-center gap-2">
              ✦ Cosmic Intelligence
            </h2>
            <p className="text-xl md:text-2xl text-white font-medium leading-relaxed max-w-3xl">
              Signal detected: "Acme Corp Redesign" is trending 15% behind schedule. 
              Consider scheduling a sync with the design team before Friday's review.
            </p>
            <button className="mt-6 flex items-center gap-2 text-sm font-semibold bg-[var(--color-primary)] text-black px-6 py-3 rounded-full hover:scale-105 transition-transform">
              Review Project Status
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Asymmetrical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main KPI Card */}
        <div className="md:col-span-2 rounded-3xl bg-[var(--color-card)] border border-[var(--color-border)] p-6 md:p-8 flex flex-col justify-between">
          <h3 className="text-sm font-medium text-[var(--color-muted-foreground)] mb-6">Active Pipeline</h3>
          <div className="flex items-baseline gap-4">
            <span className="text-6xl md:text-7xl font-extrabold text-white tracking-tighter">24</span>
            <span className="text-xl text-[var(--color-primary)] font-medium">+3 this week</span>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[var(--color-border)] flex gap-8">
            <div>
              <p className="text-sm text-[var(--color-muted-foreground)] mb-1">Total Value</p>
              <p className="text-2xl font-bold text-white">$1.2M</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-muted-foreground)] mb-1">Win Rate</p>
              <p className="text-2xl font-bold text-white">68%</p>
            </div>
          </div>
        </div>

        {/* Priority Action Card */}
        <div className="rounded-3xl bg-gradient-to-b from-[#3a1a00] to-[var(--color-card)] border border-[var(--color-secondary)]/30 p-6 flex flex-col">
          <h3 className="text-sm font-medium text-[var(--color-secondary)] mb-6 flex items-center gap-2">
            Gravity Warning
          </h3>
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-white mb-2">Invoice Overdue</h4>
            <p className="text-[var(--color-muted-foreground)] mb-6">
              Globex Corporation is 14 days late on the Q3 retainer payment ($25,000).
            </p>
          </div>
          <button className="w-full py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors">
            Send Reminder
          </button>
        </div>

      </div>

      {/* Timeline Section */}
      <div className="rounded-3xl bg-[var(--color-card)] border border-[var(--color-border)] p-6 md:p-8">
        <h3 className="text-lg font-bold text-white mb-6">Incoming Signals & Activity</h3>
        <div className="space-y-6">
          
          <div className="flex gap-4">
            <div className="mt-1 p-2 bg-blue-500/10 text-blue-400 rounded-full h-min">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white font-medium">Mission accomplished: Vercel Migration</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">Sarah marked the final milestone as complete.</p>
              <p className="text-xs text-[var(--color-muted-foreground)] mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 2 hours ago
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1 p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full h-min">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white font-medium">New lead: Incoming signal from Tesla</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">Assigned to BDA team automatically based on industry matching.</p>
              <p className="text-xs text-[var(--color-muted-foreground)] mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 5 hours ago
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
