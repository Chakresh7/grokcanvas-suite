import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Upload, Sparkles, GitBranch, Network, Brain, ArrowRight, Workflow, Database, Boxes } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
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
];

const PromptPanel = ({ onGenerate, messages, isGenerating }: PromptPanelProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

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
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTemplate = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-6 pb-4 shrink-0">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-tight"
        >
          Describe your diagram
        </motion.h2>
        <p className="text-sm text-muted-foreground mt-1.5">
          or choose a template below
        </p>
      </div>

      {/* Templates */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-6 pb-4 shrink-0"
        >
          <div className="grid grid-cols-2 gap-2">
            {templates.map((t) => (
              <button
                key={t.label}
                onClick={() => handleTemplate(t.prompt)}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary hover:bg-surface-raised text-left transition-all duration-200 group hover-lift"
              >
                <div className="w-8 h-8 rounded-lg bg-surface-overlay flex items-center justify-center shrink-0 group-hover:bg-brand/10 transition-colors">
                  <t.icon className="w-4 h-4 text-muted-foreground group-hover:text-brand transition-colors" />
                </div>
                <span className="text-xs font-semibold text-secondary-foreground tracking-wide">
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 space-y-4 min-h-0">
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
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-brand text-brand-foreground rounded-br-md"
                    : "bg-secondary text-secondary-foreground rounded-bl-md"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-border shrink-0">
        <div className="relative bg-secondary rounded-2xl border border-border focus-within:border-brand/50 focus-within:ring-1 focus-within:ring-brand/20 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your diagram..."
            rows={1}
            className="w-full bg-transparent resize-none px-4 pt-3 pb-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none max-h-36"
          />
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-overlay rounded-lg transition-all">
              <Upload className="w-3.5 h-3.5" />
              Upload
            </button>
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isGenerating}
              className="flex items-center gap-2 px-5 py-2 bg-brand text-brand-foreground rounded-xl text-xs font-bold tracking-widest uppercase hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all glow-brand shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5" />
              GENERATE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptPanel;
