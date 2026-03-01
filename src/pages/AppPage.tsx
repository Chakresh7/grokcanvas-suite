import { useState, useCallback } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import Navbar from "@/components/Navbar";
import PromptPanel from "@/components/PromptPanel";
import CanvasPanel from "@/components/CanvasPanel";
import { motion } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  diagramType?: string;
}

const SAMPLE_DIAGRAMS: Record<string, string> = {
  flowchart: `graph TD
    A[Start] --> B{User Authenticated?}
    B -->|Yes| C[Dashboard]
    B -->|No| D[Login Page]
    D --> E[Enter Credentials]
    E --> F{Valid?}
    F -->|Yes| C
    F -->|No| G[Show Error]
    G --> D
    C --> H[End]`,
  architecture: `graph TB
    subgraph Client
        A[React App] --> B[API Gateway]
    end
    subgraph Services
        B --> C[Auth Service]
        B --> D[User Service]
        B --> E[Payment Service]
        D --> F[(PostgreSQL)]
        E --> G[(Redis Cache)]
        C --> F
    end
    subgraph External
        E --> H[Stripe API]
        C --> I[OAuth Provider]
    end`,
  mindmap: `graph TD
    A[Project Planning] --> B[Research]
    A --> C[Design]
    A --> D[Development]
    A --> E[Launch]
    B --> B1[Market Analysis]
    B --> B2[User Interviews]
    C --> C1[Wireframes]
    C --> C2[UI Design]
    C --> C3[Prototyping]
    D --> D1[Frontend]
    D --> D2[Backend]
    D --> D3[Testing]
    E --> E1[Beta Release]
    E --> E2[Marketing]`,
  sequence: `sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant D as Database
    U->>F: Click Login
    F->>A: POST /auth/login
    A->>D: Query user
    D-->>A: User data
    A-->>F: JWT Token
    F-->>U: Redirect to Dashboard`,
  workflow: `graph LR
    A[Commit Code] --> B[Build]
    B --> C[Unit Tests]
    C --> D{Tests Pass?}
    D -->|Yes| E[Deploy Staging]
    D -->|No| F[Notify Dev]
    E --> G[Integration Tests]
    G --> H{Pass?}
    H -->|Yes| I[Deploy Production]
    H -->|No| F`,
  er: `erDiagram
    USERS ||--o{ ORDERS : places
    USERS {
        int id PK
        string name
        string email
    }
    ORDERS ||--|{ ORDER_ITEMS : contains
    ORDERS {
        int id PK
        int user_id FK
        date created_at
    }
    PRODUCTS ||--o{ ORDER_ITEMS : "ordered in"
    PRODUCTS {
        int id PK
        string name
        float price
    }
    ORDER_ITEMS {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
    }`,
  c4: `graph TB
    subgraph "Internet Banking System"
        A[Single-Page Application] --> B[API Application]
        B --> C[(Database)]
        B --> D[Email System]
    end
    E[Customer] --> A
    B --> F[Mainframe Banking]
    D --> E`,
  gantt: `gantt
    title Software Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements gathering    :a1, 2024-01-01, 14d
    System design             :a2, after a1, 10d
    section Development
    Frontend development      :b1, after a2, 30d
    Backend development       :b2, after a2, 35d
    section Testing
    Integration testing       :c1, after b2, 14d
    UAT                       :c2, after c1, 10d
    section Deployment
    Production release        :d1, after c2, 5d`,
};

function detectDiagramType(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes("sequence")) return "sequence";
  if (lower.includes("architecture") || lower.includes("microservice")) return "architecture";
  if (lower.includes("mindmap") || lower.includes("mind map") || lower.includes("planning")) return "mindmap";
  if (lower.includes("workflow") || lower.includes("ci/cd") || lower.includes("pipeline")) return "workflow";
  if (lower.includes("er ") || lower.includes("entity") || lower.includes("e-commerce")) return "er";
  if (lower.includes("c4") || lower.includes("context diagram") || lower.includes("banking")) return "c4";
  if (lower.includes("gantt") || lower.includes("timeline") || lower.includes("3-month") || lower.includes("project")) return "gantt";
  return "flowchart";
}

function formatDiagramType(type: string): string {
  const map: Record<string, string> = {
    flowchart: "Flowchart",
    architecture: "Architecture Diagram",
    mindmap: "Mind Map",
    sequence: "Sequence Diagram",
    workflow: "Workflow Diagram",
    er: "ER Diagram",
    c4: "C4 Model",
    gantt: "Gantt Chart",
  };
  return map[type] || "Diagram";
}

const AppPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mermaidCode, setMermaidCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(async (prompt: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    await new Promise((r) => setTimeout(r, 1400));

    const diagramType = detectDiagramType(prompt);
    const code = SAMPLE_DIAGRAMS[diagramType] || SAMPLE_DIAGRAMS.flowchart;
    setMermaidCode(code);

    const formatted = formatDiagramType(diagramType);
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `Here's your ${formatted}! I've generated it based on your description. You can switch to the Code tab to edit the Mermaid syntax directly, or ask me to refine it.`,
      timestamp: new Date(),
      diagramType: formatted,
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsGenerating(false);

    const saved = JSON.parse(localStorage.getItem("grokcanvas_diagrams") || "[]");
    saved.push({ prompt, code, type: diagramType, date: new Date().toISOString() });
    localStorage.setItem("grokcanvas_diagrams", JSON.stringify(saved));
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="flex-1 min-h-0"
      >
        {/* Desktop */}
        <div className="hidden md:block h-full">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={40} minSize={28} maxSize={55}>
              <PromptPanel onGenerate={handleGenerate} messages={messages} isGenerating={isGenerating} />
            </ResizablePanel>
            <ResizableHandle className="w-[3px] bg-border hover:bg-brand/50 active:bg-brand transition-colors duration-150" />
            <ResizablePanel defaultSize={60} minSize={40}>
              <CanvasPanel mermaidCode={mermaidCode} onCodeChange={setMermaidCode} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile */}
        <div className="md:hidden h-full flex flex-col">
          <div className="flex-1 min-h-0 overflow-hidden" style={{ maxHeight: "50%" }}>
            <PromptPanel onGenerate={handleGenerate} messages={messages} isGenerating={isGenerating} />
          </div>
          <div className="h-px bg-border" />
          <div className="flex-1 min-h-0">
            <CanvasPanel mermaidCode={mermaidCode} onCodeChange={setMermaidCode} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AppPage;
