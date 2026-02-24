// src/App.tsx
import Toolbar from "./components/Toolbar";
import FlowCanvas from "./components/FlowCanvas";
import NodeSidebar from "./components/NodeSidebar";
import JsonPreview from "./components/JsonPreview";
import { useFlowStore } from "./store/useFlowStore";

export default function App() {
  const { sidebarOpen, selectedNodeId } = useFlowStore();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-canvas">
      <Toolbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <FlowCanvas />
          <JsonPreview />
        </div>

        {/* Sidebar */}
        {sidebarOpen && selectedNodeId && <NodeSidebar />}
      </div>
    </div>
  );
}
