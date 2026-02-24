// src/components/NodeSidebar.tsx
import { useState } from "react";
import {
  X,
  Trash2,
  Star,
  Plus,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Hash,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useFlowStore } from "../store/useFlowStore";

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1 text-xs text-danger mt-1">
      <AlertCircle size={11} />
      {message}
    </p>
  );
}

function InputField({
  label,
  icon: Icon,
  value,
  onChange,
  error,
  placeholder,
  multiline,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted mb-1.5">
        <Icon size={12} />
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`w-full px-3 py-2 bg-canvas rounded-lg text-sm text-white border transition-colors resize-none
            ${error ? "border-danger/60 focus:border-danger" : "border-border focus:border-accent"}
            outline-none placeholder:text-muted/50`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 bg-canvas rounded-lg text-sm text-white border transition-colors
            ${error ? "border-danger/60 focus:border-danger" : "border-border focus:border-accent"}
            outline-none placeholder:text-muted/50`}
        />
      )}
      {error && <FieldError message={error} />}
    </div>
  );
}

function EdgeSection() {
  const { edges, nodes, selectedNodeId, updateEdgeData, deleteEdge, errors } =
    useFlowStore();

  const outgoing = edges.filter((e) => e.source === selectedNodeId);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (outgoing.length === 0) {
    return (
      <p className="text-xs text-muted italic text-center py-3">
        No outgoing edges. Draw from the bottom handle to connect.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {outgoing.map((edge) => {
        const targetNode = nodes.find((n) => n.id === edge.target);
        const edgeErrors = errors.filter(
          (e) => e.refId === edge.id && e.type === "edge",
        );
        const isOpen = expanded === edge.id;
        const params = edge.data?.parameters ?? {};

        return (
          <div
            key={edge.id}
            className={`rounded-lg border transition-colors ${
              edgeErrors.length
                ? "border-danger/40 bg-danger/5"
                : "border-border bg-canvas"
            }`}
          >
            <div
              className="flex items-center justify-between px-3 py-2 cursor-pointer"
              onClick={() => setExpanded(isOpen ? null : edge.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">
                  → {targetNode?.data.schemaId || "Unknown"}
                </p>
                <p className="text-xs text-muted truncate">
                  {edge.data?.condition || (
                    <span className="text-danger/70 italic">No condition</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-2">
                {edgeErrors.length > 0 && (
                  <AlertCircle size={13} className="text-danger" />
                )}
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    deleteEdge(edge.id);
                  }}
                  className="p-1 hover:text-danger text-muted transition-colors"
                >
                  <Trash2 size={13} />
                </button>
                {isOpen ? (
                  <ChevronUp size={13} className="text-muted" />
                ) : (
                  <ChevronDown size={13} className="text-muted" />
                )}
              </div>
            </div>

            {isOpen && (
              <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
                <div>
                  <label className="text-xs text-muted mb-1 block">
                    Condition *
                  </label>
                  <input
                    type="text"
                    value={edge.data?.condition ?? ""}
                    onChange={(e) =>
                      updateEdgeData(edge.id, {
                        condition: e.target.value,
                      })
                    }
                    placeholder="e.g. user_agrees"
                    className={`w-full px-3 py-1.5 bg-panel rounded-lg text-xs text-white border outline-none
                      ${edgeErrors.find((e) => e.field === "condition") ? "border-danger/60" : "border-border focus:border-accent"}`}
                  />
                  {edgeErrors.map((e) => (
                    <FieldError key={e.field} message={e.message} />
                  ))}
                </div>

                {/* Parameters */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-muted">Parameters</label>
                    <button
                      onClick={() =>
                        updateEdgeData(edge.id, {
                          parameters: { ...params, "": "" },
                        })
                      }
                      className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover"
                    >
                      <Plus size={11} /> Add
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {Object.entries(params).map(([k, v], i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <input
                          value={k}
                          onChange={(e) => {
                            const newParams = { ...params };
                            delete newParams[k];
                            newParams[e.target.value] = v;
                            updateEdgeData(edge.id, {
                              parameters: newParams,
                            });
                          }}
                          placeholder="key"
                          className="flex-1 px-2 py-1 bg-panel border border-border rounded text-xs text-white outline-none focus:border-accent"
                        />
                        <span className="text-muted text-xs">:</span>
                        <input
                          value={v}
                          onChange={(e) =>
                            updateEdgeData(edge.id, {
                              parameters: {
                                ...params,
                                [k]: e.target.value,
                              },
                            })
                          }
                          placeholder="value"
                          className="flex-1 px-2 py-1 bg-panel border border-border rounded text-xs text-white outline-none focus:border-accent"
                        />
                        <button
                          onClick={() => {
                            const p = { ...params };
                            delete p[k];
                            updateEdgeData(edge.id, { parameters: p });
                          }}
                          className="text-muted hover:text-danger transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function NodeSidebar() {
  const {
    nodes,
    selectedNodeId,
    errors,
    updateNodeData,
    setStartNode,
    deleteNode,
    setSidebarOpen,
  } = useFlowStore();

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const { data } = node;
  const getFieldError = (field: string) =>
    errors.find((e) => e.refId === selectedNodeId && e.field === field)
      ?.message;

  return (
    <aside className="w-80 flex-shrink-0 bg-panel border-l border-border flex flex-col animate-slide-in overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <h2 className="text-sm font-semibold text-white">Edit Node</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStartNode(node.id)}
            title={data.isStart ? "Is start node" : "Set as start node"}
            className={`p-1.5 rounded-lg transition-colors ${
              data.isStart
                ? "text-success bg-success/10"
                : "text-muted hover:text-success"
            }`}
          >
            <Star size={15} fill={data.isStart ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => deleteNode(node.id)}
            className="p-1.5 rounded-lg text-muted hover:text-danger transition-colors"
            title="Delete node"
          >
            <Trash2 size={15} />
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-muted hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Start badge */}
        {data.isStart && (
          <div className="flex items-center gap-2 px-3 py-2 bg-success/10 border border-success/30 rounded-lg">
            <Star size={13} className="text-success" fill="currentColor" />
            <span className="text-xs text-success font-medium">
              This is the start node
            </span>
          </div>
        )}

        <InputField
          label="Node ID"
          icon={Hash}
          value={data.schemaId}
          onChange={(v) => updateNodeData(node.id, { schemaId: v })}
          error={getFieldError("schemaId")}
          placeholder="e.g. greeting_node"
        />

        <InputField
          label="Description"
          icon={FileText}
          value={data.description}
          onChange={(v) => updateNodeData(node.id, { description: v })}
          error={getFieldError("description")}
          placeholder="What does this node do?"
          multiline
        />

        <InputField
          label="Prompt"
          icon={MessageSquare}
          value={data.prompt}
          onChange={(v) => updateNodeData(node.id, { prompt: v })}
          error={getFieldError("prompt")}
          placeholder="The message or action for this node..."
          multiline
        />

        {/* Outgoing Edges */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-muted flex items-center gap-1.5">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Outgoing Edges
            </label>
          </div>
          <EdgeSection />
        </div>

        {/* All node errors */}
        {errors
          .filter(
            (e) =>
              e.refId === selectedNodeId &&
              e.type === "node" &&
              e.field === "connectivity",
          )
          .map((e, i) => (
            <div
              key={i}
              className="flex items-start gap-2 px-3 py-2 bg-warning/10 border border-warning/30 rounded-lg"
            >
              <AlertCircle
                size={13}
                className="text-warning mt-0.5 flex-shrink-0"
              />
              <p className="text-xs text-warning">{e.message}</p>
            </div>
          ))}
      </div>
    </aside>
  );
}
