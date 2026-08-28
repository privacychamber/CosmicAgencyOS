import { Plus, MoreHorizontal, DollarSign } from "lucide-react";

export default function PipelinePage() {
  const stages = [
    { name: "Discovery", color: "bg-blue-500", value: "$45,000", items: 2 },
    { name: "Proposal", color: "bg-[var(--color-primary)]", value: "$120,000", items: 3 },
    { name: "Negotiation", color: "bg-orange-500", value: "$85,000", items: 1 },
    { name: "Closed Won", color: "bg-green-500", value: "$340,000", items: 5 }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Sales Pipeline</h1>
          <p className="text-[var(--color-muted-foreground)]">Track opportunities and projected revenue</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="text-sm text-[var(--color-muted-foreground)]">Total Pipeline</p>
            <p className="text-xl font-bold text-white">$590,000</p>
          </div>
          <button className="flex items-center gap-2 bg-[var(--color-primary)] text-black font-semibold px-4 py-2 rounded-lg hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" />
            New Opportunity
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 snap-x">
        
        {stages.map((stage) => (
          <div key={stage.name} className="flex flex-col min-w-[320px] max-w-[320px] snap-center bg-[var(--color-card)]/50 rounded-2xl border border-[var(--color-border)] overflow-hidden">
            
            {/* Column Header */}
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-card)]">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                <h3 className="font-bold text-white">{stage.name}</h3>
                <span className="text-xs font-semibold bg-[var(--color-muted)] text-[var(--color-muted-foreground)] px-2 py-0.5 rounded-full">
                  {stage.items}
                </span>
              </div>
              <button className="text-[var(--color-muted-foreground)] hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 border-b border-[var(--color-border)]/50 bg-[var(--color-card)]/30">
              <p className="text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wider">Stage Value</p>
              <p className="text-lg font-bold text-white">{stage.value}</p>
            </div>

            {/* Column Body (Cards) */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              
              {/* Mock Card */}
              {stage.items > 0 && (
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-4 rounded-xl shadow-sm hover:border-[var(--color-primary)]/50 transition-colors cursor-grab active:cursor-grabbing">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-white text-lg leading-tight">Globex Redesign</h4>
                    <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded">High</span>
                  </div>
                  <p className="text-sm text-[var(--color-muted-foreground)] mb-4">Globex Corporation</p>
                  
                  <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                    <div className="flex items-center gap-1.5 text-white font-medium">
                      <DollarSign className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                      $25,000
                    </div>
                    <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-bold border-2 border-[var(--color-card)]">
                      JD
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
