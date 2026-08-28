import { ChevronLeft, ChevronRight, Filter, Plus, Calendar as CalendarIcon, List, Clock, Video } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Shared Calendar</h1>
          <p className="text-[var(--color-muted-foreground)]">Agency meetings and events</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[var(--color-input)] p-1 rounded-lg border border-[var(--color-border)]">
            <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-[var(--color-muted)] text-white">Month</button>
            <button className="px-3 py-1.5 text-sm font-medium rounded-md text-[var(--color-muted-foreground)] hover:text-white transition-colors">Week</button>
            <button className="px-3 py-1.5 text-sm font-medium rounded-md text-[var(--color-muted-foreground)] hover:text-white transition-colors">Day</button>
          </div>
          <button className="flex items-center gap-2 bg-[var(--color-primary)] text-black font-semibold px-4 py-2 rounded-lg hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" />
            New Meeting
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between bg-[var(--color-card)] p-4 rounded-2xl border border-[var(--color-border)]">
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-md hover:bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-white min-w-[150px] text-center">October 2026</h2>
          <button className="p-2 rounded-md hover:bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-white border border-[var(--color-border)] px-3 py-1.5 rounded-md transition-colors">
            <Filter className="w-4 h-4" />
            BDA Filter
          </button>
          <button className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-white border border-[var(--color-border)] px-3 py-1.5 rounded-md transition-colors">
            <List className="w-4 h-4" />
            List View
          </button>
        </div>
      </div>

      {/* Grid UI */}
      <div className="flex-1 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden flex flex-col">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-[var(--color-border)] bg-[var(--color-muted)]/50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="py-3 text-center text-sm font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        
        {/* Mock Calendar Grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5 divide-x divide-y divide-[var(--color-border)]">
          {Array.from({ length: 35 }).map((_, i) => {
            const isToday = i === 12; // Just a mock today
            const hasMeeting = i === 14;
            const hasRescheduled = i === 18;

            return (
              <div key={i} className={`p-2 relative min-h-[100px] hover:bg-[var(--color-muted)]/20 transition-colors ${isToday ? 'bg-[var(--color-primary)]/5' : ''}`}>
                <span className={`text-sm font-medium ${isToday ? 'bg-[var(--color-primary)] text-black w-6 h-6 rounded-full flex items-center justify-center' : 'text-[var(--color-muted-foreground)]'}`}>
                  {(i % 31) + 1}
                </span>
                
                {hasMeeting && (
                  <div className="mt-2 p-1.5 rounded bg-blue-500/10 border border-blue-500/20 text-xs">
                    <p className="font-bold text-blue-400 truncate">Acme Discovery</p>
                    <p className="text-blue-400/80 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> 2:00 PM</p>
                  </div>
                )}

                {hasRescheduled && (
                  <div className="mt-2 p-1.5 rounded bg-orange-500/10 border border-orange-500/20 text-xs opacity-70 border-dashed">
                    <p className="font-bold text-orange-400 truncate strike-through line-through">Sync with John</p>
                    <p className="text-orange-400/80 italic mt-0.5">Rescheduled</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
