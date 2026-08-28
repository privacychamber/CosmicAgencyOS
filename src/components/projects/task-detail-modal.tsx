"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function TaskDetailModal({ task, isOpen, onClose }: { task: any; isOpen: boolean; onClose: () => void }) {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{task.status}</Badge>
            {task.priority && <Badge variant="secondary">{task.priority}</Badge>}
          </div>
          <DialogTitle className="text-2xl">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 mt-4">
          <div className="col-span-2 space-y-6">
            <div>
              <h4 className="font-semibold text-sm mb-2">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {task.description || "No description provided."}
              </p>
            </div>

            {task.subtasks?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Subtasks</h4>
                <div className="space-y-2">
                  {task.subtasks.map((st: any) => (
                    <div key={st.id} className="flex items-center gap-2 text-sm border p-2 rounded-md">
                      <div className={`w-4 h-4 rounded-full border flex-shrink-0 ${st.status === 'Done' ? 'bg-primary border-primary' : ''}`} />
                      <span className={st.status === 'Done' ? 'line-through text-muted-foreground' : ''}>{st.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 bg-muted/30 p-4 rounded-lg h-fit">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Assignee</p>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-secondary" />
                {task.assignee?.name || "Unassigned"}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-1">Due Date</p>
              <p className="text-sm font-medium">
                {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date'}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Created</p>
              <p className="text-sm font-medium">
                {format(new Date(task.createdAt), 'PPP')}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
