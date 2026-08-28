"use client";

import { useState } from "react";
import { X, AlertTriangle, ArrowRight } from "lucide-react";
import { createLead } from "@/actions/leads";
import { useRouter } from "next/navigation";

export function LeadForm({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [duplicateId, setDuplicateId] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setDuplicateId(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      linkedinUrl: formData.get("linkedinUrl"),
      company: formData.get("company"),
      status: "New"
    };

    const res = await createLead(data);
    setLoading(false);

    if (!res.success && res.error === "Lead already exists") {
      setDuplicateId(res.existingLeadId);
    } else if (res.success) {
      setOpen(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-card)] w-full max-w-2xl rounded-2xl border border-[var(--color-border)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <h2 className="font-bold text-xl text-white">Create New Lead</h2>
          <button 
            onClick={() => setOpen(false)}
            className="p-2 rounded-md text-[var(--color-muted-foreground)] hover:text-white hover:bg-[var(--color-muted)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {duplicateId && (
            <div className="mb-6 p-4 rounded-xl border border-[var(--color-secondary)]/50 bg-[var(--color-secondary)]/10 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 text-[var(--color-secondary)]">
                <AlertTriangle className="w-5 h-5 mt-0.5" />
                <div>
                  <h3 className="font-bold">Lead already exists</h3>
                  <p className="text-sm opacity-90">A lead with this LinkedIn URL is already in the system.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  router.push(`/leads/${duplicateId}`);
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] text-white font-medium rounded-lg text-sm hover:scale-105 transition-transform"
              >
                Open Existing Lead
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <form id="lead-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--color-muted-foreground)]">First Name</label>
                <input required name="firstName" className="w-full bg-[var(--color-input)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Last Name</label>
                <input required name="lastName" className="w-full bg-[var(--color-input)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-primary)]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--color-muted-foreground)]">LinkedIn URL (Must be unique)</label>
              <input required name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/johndoe" className="w-full bg-[var(--color-input)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-primary)]" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Company</label>
              <input name="company" className="w-full bg-[var(--color-input)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-primary)]" />
            </div>
            
            {/* ... other fields omitted for brevity but conceptually exist ... */}

          </form>
        </div>

        <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-muted)]/20 flex justify-end gap-3">
          <button 
            onClick={() => setOpen(false)}
            className="px-6 py-2 text-white font-medium hover:bg-[var(--color-muted)] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            form="lead-form"
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[var(--color-primary)] text-black font-semibold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
          >
            {loading ? "Creating..." : "Create Lead"}
          </button>
        </div>

      </div>
    </div>
  );
}
