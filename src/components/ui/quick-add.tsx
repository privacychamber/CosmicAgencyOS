"use client";

import { X, User, Briefcase, Activity, Calendar } from "lucide-react";

export function QuickAddDialog({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-card)] w-full max-w-md rounded-2xl border border-[var(--color-border)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="font-bold text-lg text-white">Quick Add</h2>
          <button 
            onClick={() => setOpen(false)}
            className="p-1 rounded-md text-[var(--color-muted-foreground)] hover:text-white hover:bg-[var(--color-muted)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3">
          <button className="flex flex-col items-center justify-center p-6 bg-[var(--color-muted)]/50 hover:bg-[var(--color-muted)] rounded-xl border border-transparent hover:border-[var(--color-primary)] transition-all group">
            <Activity className="w-8 h-8 text-[var(--color-primary)] mb-3 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-white">Lead</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-6 bg-[var(--color-muted)]/50 hover:bg-[var(--color-muted)] rounded-xl border border-transparent hover:border-[var(--color-primary)] transition-all group">
            <User className="w-8 h-8 text-[var(--color-secondary)] mb-3 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-white">Client</span>
          </button>

          <button className="flex flex-col items-center justify-center p-6 bg-[var(--color-muted)]/50 hover:bg-[var(--color-muted)] rounded-xl border border-transparent hover:border-[var(--color-primary)] transition-all group">
            <Briefcase className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-white">Project</span>
          </button>

          <button className="flex flex-col items-center justify-center p-6 bg-[var(--color-muted)]/50 hover:bg-[var(--color-muted)] rounded-xl border border-transparent hover:border-[var(--color-primary)] transition-all group">
            <Calendar className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-white">Meeting</span>
          </button>
        </div>
      </div>
    </div>
  );
}
