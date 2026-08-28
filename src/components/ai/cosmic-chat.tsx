"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, User as UserIcon, Bot } from "lucide-react";
import { askCosmic } from "@/actions/ai";
import ReactMarkdown from "react-markdown";

export function CosmicChat({ open, onClose, initialQuery }: { open: boolean, onClose: () => void, initialQuery?: string }) {
  const [messages, setMessages] = useState<{ role: "user" | "ai", content: string }[]>([
    { role: "ai", content: "Hello! I am **COSMIC Intelligence**. I can analyze our agency data securely based on your permissions. Ask me for a daily brief, lead follow-ups, or project risks!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && initialQuery) {
      handleSend(initialQuery);
    }
  }, [open, initialQuery]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setIsLoading(true);

    try {
      const response = await askCosmic(text);
      setMessages(prev => [...prev, { role: "ai", content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, I encountered a system error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-[var(--color-card)] border-l border-[var(--color-border)] shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      
      <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-border)] bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
          <h2 className="font-bold text-white tracking-tight">COSMIC <span className="text-muted-foreground text-sm font-normal">Intelligence</span></h2>
        </div>
        <button onClick={onClose} className="p-2 text-muted-foreground hover:text-white rounded-full hover:bg-muted transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary text-black' : 'bg-muted border border-border text-primary'}`}>
              {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${msg.role === 'user' ? 'bg-primary text-black rounded-tr-sm' : 'bg-muted/50 border border-border text-white rounded-tl-sm'}`}>
              <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-background prose-pre:border prose-pre:border-border">
                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-muted border border-border text-primary flex items-center justify-center">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-muted/50 border border-border rounded-2xl rounded-tl-sm p-4 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-[var(--color-border)] bg-background">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask COSMIC..." 
            className="w-full bg-muted border border-border rounded-full pl-4 pr-12 py-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={isLoading}
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-primary text-black rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-2">
          COSMIC AI respects your data access permissions.
        </p>
      </div>

    </div>
  );
}
