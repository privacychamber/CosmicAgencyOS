"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { updateTaskStatus } from "@/actions/tasks";
import { Badge } from "@/components/ui/badge";

const STATUSES = ["Backlog", "To Do", "In Progress", "Review", "Blocked", "Done"];

export function KanbanBoard({ initialTasks, projectId }: { initialTasks: any[]; projectId: string }) {
  const [tasks, setTasks] = useState(initialTasks);
  // Prevent hydration error by only rendering after mount
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Optimistic UI update
    const newStatus = destination.droppableId;
    setTasks(prev => prev.map(t => t.id === draggableId ? { ...t, status: newStatus } : t));

    // Server Action
    await updateTaskStatus(draggableId, newStatus, projectId);
  };

  if (!isMounted) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading board...</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 items-start">
        {STATUSES.map(status => {
          const columnTasks = tasks.filter(t => t.status === status);
          return (
            <div key={status} className="min-w-[280px] w-[280px] bg-muted/40 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-semibold text-sm">{status}</h3>
                <Badge variant="secondary" className="text-xs">{columnTasks.length}</Badge>
              </div>
              
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[150px] flex flex-col gap-2"
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-background p-3 rounded-md border shadow-sm cursor-grab active:cursor-grabbing transition-colors ${
                              snapshot.isDragging ? "border-primary/50 shadow-md ring-1 ring-primary/20" : ""
                            }`}
                          >
                            <p className="text-sm font-medium">{task.title}</p>
                            {task.assignee && (
                              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                <span className="w-4 h-4 rounded-full bg-secondary inline-block" />
                                {task.assignee.name}
                              </p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
