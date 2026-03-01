import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Sparkles, GitBranch, Brain, ArrowRight, Workflow, Database,
  Boxes, BarChart3, Component, Clock, Image as ImageIcon
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  diagramType?: string;
}

interface PromptPanelProps {
  onGenerate: (prompt: string) => void;
  messages: Message[];
  isGenerating: boolean;
}

const templates = [
  { label: "Flowchart", icon: GitBranch, prompt: "Create a flowchart for a user authentication process" },
  { label: "Architecture", icon: Database, prompt: "Create a microservices architecture diagram" },
  { label: "Mindmap", icon: Brain, prompt: "Create a mindmap for project planning" },
  { label: "Sequence", icon: ArrowRight, prompt: "Create a sequence diagram for API request flow" },
  { label: "Workflow", icon: Workflow, prompt: "Create a CI/CD pipeline workflow diagram" },
  { label: "ER Diagram", icon: Boxes, prompt: "Create an entity relationship diagram for an e-commerce database" },
  { label: "C4 Model", icon: Component, prompt: "Create a C4 context diagram for a banking system" },
  { label: "Gantt", icon: BarChart3, prompt: "Create a Gantt chart for a 3-month software project" },
];

const PromptPanel = ({ onGenerate, messages, isGenerating }: PromptPanelProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || isGenerating) return;
    onGenerate(input.trim());
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTemplate = (prompt: string) => {
    onGenerate(prompt);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 pt-6 pb-3 shrink-0">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-[28px] font-extrabold tracking-tight text-foreground leading-tight"
        >
          Describe your diagram
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-muted-foreground mt-1"
        >
          or upload a sketch to get started
        </motion.p>
      </div>

      {/* Horizontal scrolling template cards */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="px-6 pb-4 shrink-0"
        >
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {templates.map((t, i) => (
              <motion.button
                key={t.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.04 }}
                onClick={() => handleTemplate(t.prompt)}
                className="flex flex-col items-center gap-2 min-w-[100px] p-4 rounded-xl bg-secondary border border-transparent hover:border-brand/40 text-center transition-all duration-200 group hover:scale-[1.04] hover:shadow-[0_0_20px_-5px_hsl(239_84%_67%_/_0.25)]"
              >
                <div className="w-10 h-10 rounded-xl bg-surface-overlay flex items-center justify-center group-hover:bg-brand/15 transition-all duration-200">
                  <t.icon className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-colors duration-200" />
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-foreground tracking-wide whitespace-nowrap transition-colors">
                  {t.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Chat Messages */}
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto px-6 space-y-3 min-h-0">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] ${msg.role === "assistant" ? "flex gap-2.5" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-brand/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand" />
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-brand text-brand-foreground rounded-br-md"
                      : "bg-secondary text-secondary-foreground rounded-bl-md"
                  }`}
                >
                  {msg.content}
                  {msg.role === "assistant" && msg.diagramType && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ImageIcon className="w-3 h-3" />
                      <span>{msg.diagramType} generated</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isGenerating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-brand/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-brand animate-pulse" />
              </div>
              <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="text-xs text-muted-foreground ml-2">Generating diagram...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-border shrink-0">
        <div className="relative bg-secondary rounded-2xl border border-border focus-within:border-brand/50 focus-within:ring-1 focus-within:ring-brand/20 transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your diagram..."
            rows={1}
            className="w-full bg-transparent resize-none px-4 pt-3.5 pb-14 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none max-h-36"
          />
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-overlay rounded-lg transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload sketch</span>
              </button>
              <span className="text-[10px] text-muted-foreground/50 font-mono hidden lg:inline ml-1">
                ⌘ ⏎
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isGenerating}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand text-brand-foreground rounded-xl text-xs font-bold tracking-widest uppercase hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all glow-brand shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              GENERATE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptPanel;
