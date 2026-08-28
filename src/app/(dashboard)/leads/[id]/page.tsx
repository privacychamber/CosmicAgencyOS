import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Briefcase, Mail, Phone, Calendar, ArrowLeft, MoreHorizontal, MessageSquare, Link2 } from "lucide-react";
import Link from "next/link";

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  // Mock data fetch for the UI presentation. In real execution, we'd fetch from Prisma.
  // const lead = await prisma.lead.findUnique({ where: { id: params.id }, include: { activities: true } });
  
  const lead = {
    id: params.id,
    firstName: "John",
    lastName: "Doe",
    position: "Chief Executive Officer",
    company: "Acme Corp",
    location: "San Francisco, CA",
    country: "USA",
    status: "Contacted",
    priority: "Hot",
    service: "Web Redesign",
    linkedinUrl: "https://linkedin.com/in/johndoe",
    lastContacted: "2 days ago"
  };

  if (!lead) notFound();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Link href="/leads" className="text-[var(--color-muted-foreground)] hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Leads
        </Link>
      </div>

      {/* Header Profile */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
        <div className="flex gap-6 items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            JD
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{lead.firstName} {lead.lastName}</h1>
            <p className="text-lg text-[var(--color-muted-foreground)] flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              {lead.position} at {lead.company}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a href={lead.linkedinUrl} target="_blank" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                <Link2 className="w-4 h-4" />
                LinkedIn Profile
              </a>
              <span className="text-[var(--color-border)]">|</span>
              <span className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
                <MapPin className="w-4 h-4" />
                {lead.location}, {lead.country}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex justify-center items-center gap-2 px-6 py-3 bg-[var(--color-muted)] text-white font-medium rounded-xl hover:bg-[var(--color-muted)]/80 transition-colors">
            <MessageSquare className="w-4 h-4" />
            Log Activity
          </button>
          <button className="flex-1 md:flex-none flex justify-center items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-black font-semibold rounded-xl hover:scale-105 transition-transform">
            Edit Lead
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Details */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6">
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Status & Ownership</h3>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-[var(--color-muted-foreground)] mb-2">Current Status</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {lead.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-[var(--color-muted-foreground)] mb-2">Priority</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                  {lead.priority}
                </span>
              </div>
              <div>
                <p className="text-sm text-[var(--color-muted-foreground)] mb-2">Interested Service</p>
                <p className="text-white font-medium">{lead.service}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Notes */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8">
            <h3 className="font-bold text-white mb-8 uppercase tracking-wider text-sm flex items-center justify-between">
              Activity Timeline
              <button className="text-[var(--color-primary)] font-medium text-xs normal-case">Add Note</button>
            </h3>
            
            <div className="relative pl-6 border-l border-[var(--color-border)] space-y-8">
              
              {/* Timeline Item */}
              <div className="relative">
                <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-[var(--color-primary)] border-4 border-[var(--color-card)]"></div>
                <div className="bg-[var(--color-muted)]/30 border border-[var(--color-border)] rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-white font-medium">Status changed to Contacted</p>
                    <span className="text-xs text-[var(--color-muted-foreground)] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      2 days ago
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">Action performed by Admin User (System Audit).</p>
                </div>
              </div>

              {/* Timeline Item */}
              <div className="relative">
                <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-[var(--color-muted)] border-4 border-[var(--color-card)]"></div>
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-white font-medium">Lead Created</p>
                    <span className="text-xs text-[var(--color-muted-foreground)] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      1 week ago
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">Imported via LinkedIn Source.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
