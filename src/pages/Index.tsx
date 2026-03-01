import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, GitBranch, Zap, Lock, Download } from "lucide-react";
import Navbar from "@/components/Navbar";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Describe any diagram in plain English. Grok AI transforms your words into beautiful visuals instantly.",
  },
  {
    icon: GitBranch,
    title: "Live Visual Editor",
    description: "Edit diagrams visually with drag-and-drop nodes, or tweak the Mermaid code directly. Two-way sync.",
  },
  {
    icon: Zap,
    title: "Instant Refinement",
    description: "Chat with AI to iterate. \"Make arrows blue\", \"Add a decision node\" — changes happen live.",
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description: "Download as PNG, SVG, or copy Mermaid code. Perfect for docs, presentations, and repos.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary rounded-full mb-8">
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            <span className="text-xs font-semibold text-muted-foreground tracking-wide">
              POWERED BY GROK AI
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.05] mb-6">
            Diagrams from
            <br />
            <span className="text-gradient-brand">natural language</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Turn ideas into flowcharts, architecture diagrams, and more — just describe what you need. Edit visually or refine with AI chat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/app"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-brand text-brand-foreground rounded-2xl text-sm font-bold tracking-widest uppercase glow-brand shadow-lg hover:opacity-90 transition-all animate-pulse-glow"
            >
              <Sparkles className="w-4 h-4" />
              START CREATING
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-xs text-muted-foreground font-medium">
              No signup required
            </span>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mt-24 w-full"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
              className="p-6 bg-card border border-border rounded-2xl hover-lift group"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-brand/10 transition-colors">
                <f.icon className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <div className="mt-24 text-center">
          <p className="text-xs text-muted-foreground">
            Built with Grok AI · Mermaid.js · React
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
