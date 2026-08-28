"use client";

import { Command } from "cmdk";
import { Sparkles, Users, Briefcase, Activity, FileText, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CommandPalette({ open, setOpen, openChat }: { open: boolean, setOpen: (open: boolean) => void, openChat?: (query?: string) => void }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col">
        
        <div className="flex items-center px-4 py-3 border-b border-[var(--color-border)]">
          <Search className="w-5 h-5 text-[var(--color-muted-foreground)] mr-3" />
          <Command.Input 
            value={searchQuery}
            onValueChange={setSearchQuery}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim() && openChat) {
                openChat(searchQuery);
              }
            }}
            placeholder="Search leads, projects, or ask COSMIC (Press Enter)..." 
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-[var(--color-muted-foreground)] text-lg"
          />
          <kbd className="ml-2 font-mono text-xs text-[var(--color-muted-foreground)] bg-[var(--color-muted)] px-2 py-1 rounded">ESC</kbd>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
          <Command.Empty className="py-6 text-center text-sm text-[var(--color-muted-foreground)]">
            No results found.
          </Command.Empty>

          <Command.Group heading="✦ Ask COSMIC" className="px-2 pt-2 text-xs font-semibold text-[var(--color-primary)]">
            <Command.Item 
              onSelect={() => openChat?.("Which projects need my attention today?")}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-white hover:bg-[var(--color-primary)] hover:text-black cursor-pointer transition-colors group mt-1"
            >
              <Sparkles className="w-4 h-4 group-hover:text-black text-[var(--color-primary)]" />
              <span>Which projects need my attention today?</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => openChat?.("How much outstanding payment do we have?")}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-white hover:bg-[var(--color-primary)] hover:text-black cursor-pointer transition-colors group"
            >
              <Sparkles className="w-4 h-4 group-hover:text-black text-[var(--color-primary)]" />
              <span>How much outstanding payment do we have?</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => openChat?.("Which leads need follow-up?")}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-white hover:bg-[var(--color-primary)] hover:text-black cursor-pointer transition-colors group"
            >
              <Sparkles className="w-4 h-4 group-hover:text-black text-[var(--color-primary)]" />
              <span>Which leads need follow-up?</span>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Navigation" className="px-2 pt-4 text-xs font-semibold text-[var(--color-muted-foreground)]">
            <Command.Item 
              onSelect={() => { router.push('/projects'); setOpen(false); }}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-white hover:bg-[var(--color-muted)] cursor-pointer mt-1"
            >
              <Briefcase className="w-4 h-4" />
              <span>Projects Dashboard</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => { router.push('/clients'); setOpen(false); }}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-white hover:bg-[var(--color-muted)] cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Clients Database</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
