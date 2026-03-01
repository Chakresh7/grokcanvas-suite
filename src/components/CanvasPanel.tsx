import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sun,
  Copy,
  FileImage,
  FileCode,
  FileText,
  LayoutGrid,
  ChevronDown,
  Sparkles,
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
  flowchart: {
    htmlLabels: true,
    curve: "basis",
  },
});

const CanvasPanel = ({ mermaidCode, onCodeChange }: CanvasPanelProps) => {
  const [showExport, setShowExport] = useState(false);
  const [showCode, setShowCode] = useState(false);
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

  return (
    <div className="flex flex-col h-full bg-card relative">
      {/* Canvas Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowCode(!showCode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              showCode
                ? "bg-brand text-brand-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            CODE
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all">
            <LayoutGrid className="w-3.5 h-3.5" />
            AUTO-LAYOUT
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowExport(!showExport)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            EXPORT
            <ChevronDown className="w-3 h-3" />
          </button>
          {showExport && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-1 w-48 bg-surface-raised border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <button onClick={() => handleExport("png")} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-secondary-foreground hover:bg-secondary transition-colors">
                <FileImage className="w-3.5 h-3.5 text-muted-foreground" /> Export as PNG
              </button>
              <button onClick={() => handleExport("svg")} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-secondary-foreground hover:bg-secondary transition-colors">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" /> Export as SVG
              </button>
              <button onClick={() => handleExport("code")} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-secondary-foreground hover:bg-secondary transition-colors">
                <Copy className="w-3.5 h-3.5 text-muted-foreground" /> Copy Mermaid Code
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden min-h-0">
        {/* Grid background */}
        <div className="absolute inset-0 surface-grid opacity-50" />

        {mermaidCode ? (
          <div className="relative h-full flex flex-col">
            {showCode ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full p-4"
              >
                <textarea
                  value={mermaidCode}
                  onChange={(e) => onCodeChange(e.target.value)}
                  className="w-full h-full bg-background border border-border rounded-xl p-4 text-sm font-mono text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-brand/30"
                  spellCheck={false}
                />
              </motion.div>
            ) : (
              <div
                className="flex-1 overflow-auto flex items-center justify-center p-8"
                style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
              >
                {error ? (
                  <div className="text-destructive text-sm font-medium">{error}</div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    ref={renderRef}
                    dangerouslySetInnerHTML={{ __html: svgOutput }}
                    className="[&_svg]:max-w-full [&_svg]:h-auto"
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Your diagram appears here
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Describe what you want to create and hit Generate to see it rendered live
              </p>
            </motion.div>
          </div>
        )}
      </div>

      {/* Floating Zoom Controls */}
      {mermaidCode && !showCode && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 right-4 flex items-center gap-1 bg-surface-raised border border-border rounded-xl p-1 shadow-lg"
        >
          <button onClick={() => setZoom(Math.max(0.25, zoom - 0.15))} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-muted-foreground w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={() => setZoom(Math.min(3, zoom + 0.15))} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all">
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-border mx-0.5" />
          <button onClick={() => setZoom(1)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all">
            <Maximize2 className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default CanvasPanel;
