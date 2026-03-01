import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, Undo2, Redo2, ZoomIn, ZoomOut, Maximize2,
  Copy, FileImage, FileCode, FileText, LayoutGrid,
  ChevronDown, Sparkles, Eye, Code2, Monitor, Palette,
  Command
} from "lucide-react";
import mermaid from "mermaid";

interface CanvasPanelProps {
  mermaidCode: string;
  onCodeChange: (code: string) => void;
}

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    primaryColor: "#6366f1",
    primaryTextColor: "#ffffff",
    primaryBorderColor: "#27272a",
    lineColor: "#52525b",
    secondaryColor: "#1a1a1a",
    tertiaryColor: "#111111",
    background: "#0a0a0a",
    mainBkg: "#1a1a1a",
    nodeBorder: "#27272a",
    clusterBkg: "#111111",
    clusterBorder: "#27272a",
    titleColor: "#ffffff",
    edgeLabelBackground: "#1a1a1a",
    nodeTextColor: "#ffffff",
  },
  flowchart: { htmlLabels: true, curve: "basis" },
});

type TabType = "visual" | "code" | "preview";

const CanvasPanel = ({ mermaidCode, onCodeChange }: CanvasPanelProps) => {
  const [showExport, setShowExport] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("visual");
  const [svgOutput, setSvgOutput] = useState("");
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(1);
  const renderRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);

  const renderMermaid = useCallback(async () => {
    if (!mermaidCode.trim()) {
      setSvgOutput("");
      setError("");
      return;
    }
    try {
      idCounter.current += 1;
      const id = `mermaid-${idCounter.current}`;
      const { svg } = await mermaid.render(id, mermaidCode);
      setSvgOutput(svg);
      setError("");
    } catch (err: any) {
      setError("Invalid diagram syntax");
      console.error("Mermaid render error:", err);
    }
  }, [mermaidCode]);

  useEffect(() => {
    renderMermaid();
  }, [renderMermaid]);

  const handleExport = (type: string) => {
    setShowExport(false);
    if (type === "code") {
      navigator.clipboard.writeText(mermaidCode);
    } else if (type === "svg") {
      const blob = new Blob([svgOutput], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "grokcanvas-diagram.svg";
      a.click();
      URL.revokeObjectURL(url);
    } else if (type === "png") {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        ctx?.scale(2, 2);
        ctx?.drawImage(img, 0, 0);
        const link = document.createElement("a");
        link.download = "grokcanvas-diagram.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgOutput)));
    }
  };

  const tabs: { id: TabType; label: string; icon: typeof Eye }[] = [
    { id: "visual", label: "VISUAL", icon: Eye },
    { id: "code", label: "CODE", icon: Code2 },
    { id: "preview", label: "PREVIEW", icon: Monitor },
  ];

  return (
    <div className="flex flex-col h-full bg-card relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        {/* Tabs */}
        <div className="flex items-center gap-0.5 bg-secondary rounded-xl p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold tracking-widest uppercase rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-surface-overlay text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Auto-Layout</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all">
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Theme</span>
          </button>

          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setShowExport(!showExport)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Export</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {showExport && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1.5 w-52 bg-surface-raised border border-border rounded-xl shadow-2xl z-50 overflow-hidden py-1"
                >
                  {[
                    { type: "png", icon: FileImage, label: "Export as PNG" },
                    { type: "svg", icon: FileText, label: "Export as SVG" },
                    { type: "code", icon: Copy, label: "Copy Mermaid Code" },
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => handleExport(item.type)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-secondary-foreground hover:bg-secondary transition-colors"
                    >
                      <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden min-h-0">
        <div className="absolute inset-0 surface-grid opacity-40" />

        {mermaidCode ? (
          <AnimatePresence mode="wait">
            {activeTab === "code" ? (
              <motion.div
                key="code"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative h-full p-4 z-10"
              >
                <textarea
                  value={mermaidCode}
                  onChange={(e) => onCodeChange(e.target.value)}
                  className="w-full h-full bg-background border border-border rounded-xl p-4 text-sm font-mono text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-brand/30 leading-relaxed"
                  spellCheck={false}
                />
              </motion.div>
            ) : (
              <motion.div
                key="visual"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative h-full overflow-auto flex items-center justify-center p-8 z-10"
                style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
              >
                {error ? (
                  <div className="text-destructive text-sm font-medium bg-destructive/10 px-4 py-2 rounded-lg">
                    {error}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35 }}
                    ref={renderRef}
                    dangerouslySetInnerHTML={{ __html: svgOutput }}
                    className="[&_svg]:max-w-full [&_svg]:h-auto"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          /* Empty State */
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.06, 1],
                  rotate: [0, 3, -3, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 rounded-3xl bg-secondary/80 border border-border flex items-center justify-center mx-auto mb-8"
              >
                <Sparkles className="w-10 h-10 text-brand/60" />
              </motion.div>
              <h3 className="text-2xl font-extrabold text-foreground mb-3">
                Your diagram appears here
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
                Describe what you want to create and hit Generate to see it rendered live
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/60 rounded-xl">
                <Command className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">
                  Press <kbd className="px-1.5 py-0.5 bg-surface-overlay rounded text-[10px] font-mono font-bold text-foreground mx-0.5">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-surface-overlay rounded text-[10px] font-mono font-bold text-foreground mx-0.5">⏎</kbd> to generate
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Floating Toolbar — Undo/Redo/Zoom */}
      {mermaidCode && activeTab !== "code" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-surface-raised/90 backdrop-blur-md border border-border rounded-2xl p-1 shadow-xl z-20"
        >
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all" title="Undo">
            <Undo2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all" title="Redo">
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-border mx-1" />
          <button onClick={() => setZoom(Math.max(0.25, zoom - 0.15))} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all" title="Zoom out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-bold text-muted-foreground w-10 text-center tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={() => setZoom(Math.min(3, zoom + 0.15))} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all" title="Zoom in">
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-border mx-1" />
          <button onClick={() => setZoom(1)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all" title="Reset zoom">
            <Maximize2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all" title="Colors">
            <Palette className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default CanvasPanel;
