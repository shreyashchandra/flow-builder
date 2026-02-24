// src/components/Toolbar.tsx
import { useRef } from "react";
import {
  Plus,
  Upload,
  Download,
  Copy,
  AlertCircle,
  CheckCircle,
  GitBranch,
} from "lucide-react";
import { useFlowStore } from "../store/useFlowStore";
import { buildSchema } from "../utils/schemaUtils";
import { importSchema } from "../utils/schemaUtils";

export default function Toolbar() {
  const { addNode, errors, nodes, edges, setNodes, setEdges } = useFlowStore();

  const fileRef = useRef<HTMLInputElement>(null);

  const schema = buildSchema(nodes, edges);
  const json = JSON.stringify(schema, null, 2);

  const handleDownload = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "flow.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const result = importSchema(text);
      if (result) {
        setNodes(result.nodes);
        setEdges(result.edges);
      } else {
        alert("Invalid JSON format. Please check your file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const errorCount = errors.length;
  const hasErrors = errorCount > 0;

  return (
    <header className="flex items-center justify-between px-5 py-3 bg-panel border-b border-border z-10 flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 bg-accent rounded-lg">
          <GitBranch size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-base leading-none">
            Flow Builder
          </h1>
          <p className="text-muted text-xs mt-0.5">Visual workflow designer</p>
        </div>
      </div>

      {/* Center: Node count + status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted bg-card px-3 py-1.5 rounded-lg border border-border">
          <span>{nodes.length} nodes</span>
          <span className="text-border">•</span>
          <span>{edges.length} edges</span>
        </div>

        {hasErrors ? (
          <div className="flex items-center gap-1.5 text-xs text-danger bg-danger/10 border border-danger/30 px-3 py-1.5 rounded-lg">
            <AlertCircle size={13} />
            {errorCount} {errorCount === 1 ? "error" : "errors"}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-success bg-success/10 border border-success/30 px-3 py-1.5 rounded-lg">
            <CheckCircle size={13} />
            Valid flow
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={addNode}
          className="flex items-center gap-2 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={15} />
          Add Node
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 bg-card hover:bg-border text-slate-300 text-sm rounded-lg border border-border transition-colors"
          title="Import JSON"
        >
          <Upload size={15} />
          Import
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          onChange={handleImport}
          className="hidden"
        />

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 bg-card hover:bg-border text-slate-300 text-sm rounded-lg border border-border transition-colors"
          title="Copy JSON"
        >
          <Copy size={15} />
          Copy
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-1.5 bg-card hover:bg-border text-slate-300 text-sm rounded-lg border border-border transition-colors"
          title="Download JSON"
        >
          <Download size={15} />
          Export
        </button>
      </div>
    </header>
  );
}
