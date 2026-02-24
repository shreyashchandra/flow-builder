<!-- README.md -->

# Flow Builder

A visual workflow designer built with React, TypeScript, and React Flow.

## Features

- **Visual Canvas** — Drag, drop, and connect nodes
- **Smart Edges** — Labeled conditional transitions with optional parameters
- **Live JSON Preview** — Real-time schema generation with syntax highlighting
- **Validation** — Inline errors for missing fields, duplicate IDs, disconnected nodes
- **Import/Export** — Load flows from JSON or download/copy the schema
- **Keyboard Shortcut** — Delete key removes selected node or edge
- **Start Node** — Mark any node as the flow entry point

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Usage

1. **Add a node** — Click "Add Node" in the toolbar
2. **Connect nodes** — Drag from the bottom handle of one node to the top of another
3. **Edit a node** — Click any node to open the sidebar
4. **Edit edge conditions** — Click an edge label to expand it, or use the sidebar
5. **Set start node** — Click the ⭐ in the sidebar header
6. **Delete** — Select a node/edge and press Delete, or use the trash icon
7. **Import** — Click "Import" and select a valid JSON file
8. **Export** — Click "Export" to download or "Copy" to clipboard

## Design Choices

- **React Flow** for canvas — battle-tested, handles pan/zoom/drag/connect out of the box
- **Zustand** for state — simple, scalable, no boilerplate
- **Tailwind CSS** for styling — rapid, consistent dark theme
- **Separated schema IDs** — React Flow uses internal UUIDs; user-defined IDs are separate `schemaId` fields, enabling safe renaming without breaking graph structure
- **Live validation** — runs on every state change, errors surfaced inline
