// src/components/JsonPreview.tsx
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Copy, Check, ChevronDown, ChevronUp, Code2 } from "lucide-react";
import { useFlowStore } from "../store/useFlowStore";
import { buildSchema } from "../utils/schemaUtils";

export default function JsonPreview() {
  const { nodes, edges } = useFlowStore();
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const schema = buildSchema(nodes, edges);
  const json = JSON.stringify(schema, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`bg-panel border-t border-border flex flex-col transition-all duration-300 ${
        collapsed ? "h-9" : "h-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border flex-shrink-0">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-2 text-xs font-medium text-muted hover:text-white transition-colors"
        >
          <Code2 size={13} />
          JSON Preview
          {collapsed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {!collapsed && (
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-colors ${
              copied ? "text-success" : "text-muted hover:text-white"
            }`}
          >
            {copied ? (
              <>
                <Check size={12} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={12} />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-auto">
          <SyntaxHighlighter
            language="json"
            style={atomOneDark}
            customStyle={{
              margin: 0,
              padding: "12px 16px",
              background: "transparent",
              fontSize: "11px",
              lineHeight: "1.6",
            }}
          >
            {json}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}
