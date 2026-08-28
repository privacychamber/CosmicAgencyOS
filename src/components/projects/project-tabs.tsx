"use client";

import React, { useState } from "react";
import { KanbanBoard } from "./kanban-board";
import { Briefcase, FileText, Clock, Users, Activity, CheckSquare, ListTodo, Map } from "lucide-react";

export function ProjectTabs({ project, canViewFinancials }: { project: any; canViewFinancials: boolean }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Tasks", "Board", "Milestones", "Timeline", "Files", "Activity", "Team", "Notes"];
  if (canViewFinancials) tabs.splice(3, 0, "Payments");

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[var(--color-border)]">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors ${
              activeTab === tab 
                ? "bg-[var(--color-card)] text-white border-b-2 border-primary" 
                : "text-[var(--color-muted-foreground)] hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {canViewFinancials && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[var(--color-primary)]/30 p-6 rounded-2xl">
                    <p className="text-sm text-[var(--color-primary)] mb-1">Final Budget</p>
                    <p className="text-2xl font-bold text-white">${project.finalBudget?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 rounded-2xl">
                    <p className="text-sm text-[var(--color-muted-foreground)] mb-1">Received</p>
                    <p className="text-2xl font-bold text-white">${project.received?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 rounded-2xl">
                    <p className="text-sm text-[var(--color-secondary)] mb-1">Pending</p>
                    <p className="text-2xl font-bold text-[var(--color-secondary)]">${project.pending?.toLocaleString() || 0}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="md:col-span-1 space-y-8">
               <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 rounded-2xl">
                <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" /> Team
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-bold">
                    {project.owner?.name?.[0] || 'O'}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{project.owner?.name || 'Owner'}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">Project Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Board" && (
          <KanbanBoard initialTasks={project.tasks} projectId={project.id} />
        )}
        
        {activeTab === "Tasks" && (
          <div className="text-center p-12 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)]">
             <ListTodo className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
             <h3 className="text-lg font-medium text-white mb-2">Task List View</h3>
             <p className="text-sm text-muted-foreground">Detailed list of all tasks.</p>
          </div>
        )}

        {activeTab === "Payments" && canViewFinancials && (
          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-medium text-white">Payment History</h3>
               <button className="px-4 py-2 bg-primary text-black font-semibold rounded-lg text-sm hover:scale-105 transition-transform">Add Payment</button>
             </div>
             {project.payments && project.payments.length > 0 ? (
               <div className="space-y-4">
                 {project.payments.map((payment: any) => (
                   <div key={payment.id} className="flex justify-between items-center p-4 border rounded-lg bg-background">
                     <div>
                       <p className="font-semibold">${payment.amount.toLocaleString()}</p>
                       <p className="text-xs text-muted-foreground">{new Date(payment.createdAt).toLocaleDateString()}</p>
                       {payment.notes && <p className="text-sm mt-1">{payment.notes}</p>}
                     </div>
                     <div className="text-right">
                       <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${payment.status === 'Paid' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                         {payment.status}
                       </span>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-muted-foreground text-center py-8">No payments recorded yet.</p>
             )}
          </div>
        )}

        {activeTab === "Milestones" && (
           <div className="text-center p-12 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)]">
             <Map className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
             <h3 className="text-lg font-medium text-white mb-2">Project Milestones</h3>
             <p className="text-sm text-muted-foreground">Track major project phases.</p>
          </div>
        )}
        
        {/* Placeholders for other tabs to show structural readiness */}
        {["Timeline", "Files", "Activity", "Team", "Notes"].includes(activeTab) && (
          <div className="text-center p-12 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)]">
            <h3 className="text-lg font-medium text-white mb-2">{activeTab}</h3>
            <p className="text-sm text-muted-foreground">This section is currently under construction.</p>
          </div>
        )}

      </div>
    </div>
  );
}
