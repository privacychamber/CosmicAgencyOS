"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, AlertCircle, PauseCircle } from "lucide-react";
import { updateProjectStatus } from "@/actions/projects";

export default function ProjectBoardPage() {
  const [modalState, setModalState] = useState<{ open: boolean, type: 'Issue' | 'Hold', projectId: string } | null>(null);

  const columns = [
    { name: "Not Started", color: "text-gray-400" },
    { name: "Work in Progress", color: "text-blue-400" },
    { name: "Review", color: "text-purple-400" },
    { name: "On Hold", color: "text-orange-400" },
    { name: "Issue", color: "text-red-400" },
    { name: "Completed", color: "text-green-400" }
  ];

  // Simplified Drag Drop UI handler mock
  function handleDrop(projectId: string, newStatus: string) {
    if (newStatus === "Issue") {
      setModalState({ open: true, type: 'Issue', projectId });
    } else if (newStatus === "On Hold") {
      setModalState({ open: true, type: 'Hold', projectId });
    } else {
      updateProjectStatus(projectId, newStatus);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Active Projects</h1>
          <p className="text-[var(--color-muted-foreground)]">Drag and drop projects to update their status.</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--color-primary)] text-black font-semibold px-4 py-2 rounded-lg hover:scale-105 transition-transform">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 snap-x">
        {columns.map((col) => (
          <div key={col.name} className="flex flex-col min-w-[320px] max-w-[320px] snap-center bg-[var(--color-card)]/50 rounded-2xl border border-[var(--color-border)] overflow-hidden">
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-card)]">
              <h3 className={`font-bold ${col.color}`}>{col.name}</h3>
              <MoreHorizontal className="w-5 h-5 text-[var(--color-muted-foreground)]" />
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {/* Mock Project Card */}
              {col.name === "Work in Progress" && (
                <div 
                  draggable
                  onDragEnd={() => handleDrop("proj_123", "Issue")} // Mock drag drop to Issue for demonstration
                  className="bg-[var(--color-card)] border border-[var(--color-border)] p-4 rounded-xl shadow-sm hover:border-[var(--color-primary)]/50 transition-colors cursor-grab active:cursor-grabbing"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white text-lg leading-tight">Globex Redesign</h4>
                  </div>
                  <p className="text-sm text-[var(--color-muted-foreground)] mb-4">Web Development</p>
                  
                  <div className="w-full bg-[var(--color-muted)] h-2 rounded-full overflow-hidden mb-4">
                    <div className="bg-blue-400 h-full w-[65%]"></div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-[var(--color-muted-foreground)]">Deadline: Oct 24</span>
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

      {/* Required Reason Modals */}
      {modalState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-card)] w-full max-w-md rounded-2xl border border-[var(--color-border)] shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              {modalState.type === 'Issue' ? <AlertCircle className="w-6 h-6 text-red-500" /> : <PauseCircle className="w-6 h-6 text-orange-500" />}
              <h2 className="font-bold text-xl text-white">
                {modalState.type === 'Issue' ? 'Report Issue' : 'Place Project On Hold'}
              </h2>
            </div>
            <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
              {modalState.type === 'Issue' 
                ? 'Please provide a detailed description of the issue blocking this project.'
                : 'Please provide a reason for placing this project on hold.'}
            </p>
            <textarea 
              className="w-full bg-[var(--color-input)] border border-[var(--color-border)] rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-primary)] mb-6 min-h-[100px]"
              placeholder={modalState.type === 'Issue' ? 'Issue description...' : 'Hold reason...'}
            ></textarea>
            
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalState(null)} className="px-4 py-2 text-white font-medium hover:bg-[var(--color-muted)] rounded-lg">Cancel</button>
              <button 
                onClick={() => {
                  updateProjectStatus(modalState.projectId, modalState.type === 'Issue' ? 'Issue' : 'On Hold', {
                    issueDescription: modalState.type === 'Issue' ? 'Mock input' : undefined,
                    holdReason: modalState.type === 'Hold' ? 'Mock input' : undefined
                  });
                  setModalState(null);
                }}
                className={`px-4 py-2 font-semibold rounded-lg text-white ${modalState.type === 'Issue' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                Confirm Status
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
