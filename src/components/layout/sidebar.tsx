"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  Activity,
  Bell,
  Trash2,
  Settings,
  Sparkles,
  DollarSign
} from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-[var(--color-border)] bg-[var(--color-card)] h-screen flex flex-col hidden md:flex transition-all">
      <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)]">
        <Link href="/" className="flex items-center gap-2 group">
          <Sparkles className="w-5 h-5 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
          <span className="font-bold text-xl tracking-tight text-white">COSMIC <span className="text-[var(--color-primary)]">✦</span></span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-4 px-2">Dashboard</div>
        
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md bg-[var(--color-muted)] text-white group">
          <LayoutDashboard className="w-4 h-4 text-[var(--color-primary)]" />
          <span className="font-medium">Overview</span>
        </Link>

        <button 
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'k', 'metaKey': true}))}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-[var(--color-primary)] text-black font-semibold hover:scale-105 transition-transform group"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask COSMIC</span>
        </button>

        <div className="mt-8 mb-4 px-2 text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">Workspace</div>
        
        <Link href="/leads" className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-white transition-colors">
          <Activity className="w-4 h-4" />
          <span className="font-medium">Leads</span>
        </Link>
        <Link href="/clients" className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-white transition-colors">
          <Users className="w-4 h-4" />
          <span className="font-medium">Clients</span>
        </Link>
        <Link href="/projects" className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-white transition-colors">
          <Briefcase className="w-4 h-4" />
          <span className="font-medium">Projects</span>
        </Link>
        <Link href="/calendar" className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-white transition-colors">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">Calendar</span>
        </Link>
        <Link href="/finance" className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-white transition-colors">
          <DollarSign className="w-4 h-4" />
          <span className="font-medium">Finance</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-[var(--color-border)] space-y-1">
        <Link href="/notifications" className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="font-medium">Notifications</span>
        </Link>
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
