# RAG Service React UI - Implementation Plan

## Overview
Build a React frontend for the RAG service with shadcn/ui + Tailwind, served from the same FastAPI container.

## Tech Stack
- **React 18** with Vite (fast builds)
- **TypeScript** for type safety
- **Tailwind CSS** + **shadcn/ui** for styling
- **React Query** for API state management
- **React Router** for navigation

## Directory Structure
```
rag-service/
├── app/                    # Existing Python backend
├── frontend/               # New React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/         # shadcn components
│   │   │   ├── Chat.tsx
│   │   │   ├── SearchExplorer.tsx
│   │   │   ├── DocumentManager.tsx
│   │   │   ├── GitHubIngester.tsx
│   │   │   ├── SourceList.tsx
│   │   │   └── StatsCard.tsx
│   │   ├── lib/
│   │   │   └── api.ts      # API client
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── Dockerfile              # Updated to build frontend
└── requirements.txt
```

## UI Pages/Features

### 1. Chat Interface (Main Page)
- Full-width chat with message history
- Streaming responses with typing indicator
- Source citations with expandable previews
- Dark/light mode toggle

### 2. Document Manager
- List all ingested sources (table view)
- Delete individual sources
- Ingest local directory (path input)
- GitHub repo ingester with branch selection
- Progress indicators for ingestion

### 3. Search Explorer
- Semantic search input
- Result cards with:
  - Relevance score (visual bar)
  - File path and type badge
  - Text preview with highlighting
  - Metadata display

### 4. Stats Dashboard
- Vector count
- Document count
- Collection status
- Service health indicator

## API Integration
All existing endpoints are ready:
- `POST /query` - Chat with streaming
- `POST /search` - Semantic search
- `POST /ingest` - Directory ingestion
- `POST /ingest/github` - Repo ingestion
- `GET /sources` - List sources
- `DELETE /documents` - Remove source
- `GET /stats` - Collection stats
- `GET /health` - Service health

## Deployment Changes

### Dockerfile Updates
```dockerfile
# Multi-stage build
FROM node:20-alpine AS frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim
# ... existing Python setup ...
COPY --from=frontend /frontend/dist /app/static
```

### FastAPI Static File Serving
```python
from fastapi.staticfiles import StaticFiles
app.mount("/", StaticFiles(directory="static", html=True), name="static")
```

## Implementation Steps

1. **Setup React project** (~5 min)
   - Initialize Vite + React + TypeScript
   - Install Tailwind, shadcn/ui, React Query, React Router

2. **Create API client** (~5 min)
   - Type definitions for all endpoints
   - Fetch wrapper with error handling

3. **Build Chat component** (~15 min)
   - Message list with user/assistant styling
   - Input with send button
   - Streaming response handler
   - Source citation display

4. **Build Document Manager** (~15 min)
   - Source list table with delete
   - Directory ingest form
   - GitHub ingest form with validation

5. **Build Search Explorer** (~10 min)
   - Search input with debounce
   - Result cards with scores
   - Metadata badges

6. **Build Stats Dashboard** (~5 min)
   - Stats cards
   - Health indicator

7. **Layout & Navigation** (~5 min)
   - Sidebar navigation
   - Dark mode toggle
   - Responsive design

8. **Update Dockerfile** (~5 min)
   - Multi-stage build
   - Static file serving

9. **Deploy to cloudyday** (~5 min)
   - Build and push
   - Test all features

## Files to Create/Modify

### New Files
- `rag-service/frontend/` - Entire React app (~15 files)

### Modified Files
- `rag-service/Dockerfile` - Add frontend build stage
- `rag-service/app/main.py` - Add static file mounting

## Design Notes
- Dark theme default (matches terminal aesthetic)
- Monospace fonts for code/paths
- Minimal animations (fast feeling)
- Mobile-responsive sidebar collapses to hamburger
