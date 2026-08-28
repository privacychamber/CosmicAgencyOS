"use client";

import { Search, Plus, Bell, Command } from "lucide-react";
import { useState, useEffect } from "react";
import { QuickAddDialog } from "../ui/quick-add";
import { CommandPalette } from "../ui/command-palette";
import { CosmicChat } from "../ai/cosmic-chat";

export function Topbar() {
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState("");

  const openCosmicChat = (query?: string) => {
    if (query) setChatQuery(query);
    setChatOpen(true);
    setCmdkOpen(false);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdkOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
        <div className="flex-1 flex items-center">
          <button 
            onClick={() => setCmdkOpen(true)}
            className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] bg-[var(--color-input)] hover:bg-[var(--color-muted)] transition-colors px-4 py-2 rounded-full w-full max-w-sm border border-[var(--color-border)] group"
          >
            <Search className="w-4 h-4" />
            <span className="flex-1 text-left">Search or ask COSMIC...</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] font-medium opacity-70">
              <Command className="w-3 h-3" /> K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setQuickAddOpen(true)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-primary)] text-black hover:scale-105 transition-transform"
            aria-label="Quick Add"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button className="relative flex items-center justify-center w-8 h-8 text-[var(--color-muted-foreground)] hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--color-secondary)] border-2 border-[var(--color-background)]"></span>
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] p-[2px]">
            <div className="w-full h-full rounded-full bg-[var(--color-card)] flex items-center justify-center">
              <span className="text-xs font-bold text-white">US</span>
            </div>
          </div>
        </div>
      </header>

      <CommandPalette open={cmdkOpen} setOpen={setCmdkOpen} openChat={openCosmicChat} />
      <QuickAddDialog open={quickAddOpen} setOpen={setQuickAddOpen} />
      <CosmicChat open={chatOpen} onClose={() => setChatOpen(false)} initialQuery={chatQuery} />
    </>
  );
}
