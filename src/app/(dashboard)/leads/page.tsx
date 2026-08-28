"use client";

import { useState } from "react";
import { Search, Filter, Plus, UserPlus, MoreHorizontal } from "lucide-react";
import { LeadForm } from "@/components/leads/lead-form";

export default function LeadsPage() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Leads</h1>
          <p className="text-[var(--color-muted-foreground)]">Manage and track your active pipeline.</p>
        </div>
        <button 
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 bg-[var(--color-primary)] text-black font-semibold px-4 py-2 rounded-lg hover:scale-105 transition-transform"
        >
          <UserPlus className="w-4 h-4" />
          New Lead
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
          <input 
            type="text" 
            placeholder="Search leads by name, company, or LinkedIn..." 
            className="w-full bg-[var(--color-input)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 bg-[var(--color-input)] border border-[var(--color-border)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-muted)] transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Leads Table Mock */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
            <tr>
              <th className="px-6 py-4 font-medium">Lead</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Priority</th>
              <th className="px-6 py-4 font-medium">Service</th>
              <th className="px-6 py-4 font-medium">Last Contacted</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {/* Mock Data Row */}
            <tr className="hover:bg-[var(--color-muted)]/50 transition-colors group cursor-pointer">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                  <div>
                    <p className="text-white font-medium">John Doe</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">CEO at Acme Corp</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Contacted
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                  Hot
                </span>
              </td>
              <td className="px-6 py-4 text-[var(--color-muted-foreground)]">Web Redesign</td>
              <td className="px-6 py-4 text-[var(--color-muted-foreground)]">2 days ago</td>
              <td className="px-6 py-4 text-right">
                <button className="text-[var(--color-muted-foreground)] hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <LeadForm open={formOpen} setOpen={setFormOpen} />
    </div>
  );
}
