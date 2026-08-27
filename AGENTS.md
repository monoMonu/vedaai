<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Instructions & Coding Standards: Veda AI Assessment Assistant

## 1. Core Mission & Scope
Build an AI-powered Assessment Extraction, Handwritten Answer Sheet Localization, and Automated Grading web application for teachers matching the provided VedaAI Figma design.

## 2. Technology Stack (Free Tier & Latest Versions)
- **Framework**: Next.js 16.3.3 (App Router)
- **Runtime & UI**: React 19.2.8, React DOM 19.2.8
- **Language**: TypeScript 5.x (Strict mode, zero `any` policy)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) + Vanilla CSS variables for design tokens
- **Icons**: `lucide-react`
- **PDF Engine**: Mozilla `pdfjs-dist` (client-side canvas rendering, zero server cost)
- **AI Multimodal Vision**: Google Gemini 1.5/2.0 Flash (Free Tier via Google AI Studio API) + preloaded fallback datasets
- **Deployment Target**: Vercel (Free Hobby Tier)

## 3. Architecture & Project Structure
Maintain a clean, modular architecture with strict separation of concerns:
```
src/
├── app/
│   ├── api/
│   │   └── process-assessment/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── upload/
│   │   ├── UploadScreen.tsx
│   │   └── FileUploadCard.tsx
│   ├── processing/
│   │   └── LoadingState.tsx
│   ├── mapping/
│   │   ├── MappingScreen.tsx
│   │   ├── QuestionList.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── AnswerSheetViewer.tsx
│   │   ├── BoundingBoxOverlay.tsx
│   │   └── AssessmentSummaryModal.tsx
├── context/
│   └── AssessmentContext.tsx
├── types/
│   └── assessment.ts
├── lib/
│   ├── gemini.ts
│   ├── pdf-utils.ts
│   └── sample-data.ts
```

## 4. Coding & Clean Code Rules
1. **Self-Documenting Code**:
   - Do not write redundant or trivial comments explaining obvious code.
   - Only add comments when documenting non-obvious algorithms, mathematical calculations, or edge case constraints.
   - Absolutely no decorative comment banners, ASCII boxes, divider lines (e.g., `// ----------------`, `/* ============= */`), or section headers inside code files.
2. **Modular Components**:
   - Each component must have a single responsibility.
   - Keep UI components decoupled from AI/PDF processing logic through hooks and context.
   - Reusable UI primitives must reside in `components/common/`.
3. **Type Safety**:
   - Define exact TypeScript interfaces for all data structures (`Question`, `SubQuestion`, `AnswerSpan`, `BoundingBox`, `AssessmentResult`).
   - Avoid `any` or loose type assertions. Use discriminated unions where applicable.
4. **State Management**:
   - Use React Context / custom hooks for shared global assessment state.
   - Keep local UI state (zoom levels, active question selection, tab switching) isolated to the consuming components.
5. **Coordinate & Bounding Box System**:
   - Store bounding boxes in normalized coordinates `[ymin, xmin, ymax, xmax]` (0.0 to 1.0 or 0 to 1000).
   - Ensure dynamic SVG/Canvas overlay scaling functions correctly across window resizing, mobile viewports, and zoom levels.

## 5. UI/UX & Figma Replication Standards
- **Color Tokens**:
  - Primary Orange: `#FF5E3A`
  - Dark Charcoal / Sidebar: `#1A1D24` / `#232730`
  - Active Green Badges: `#22C55E` / `#16A34A`
  - Neutral Gray Background: `#F8F9FB` / `#FFFFFF`
- **Responsive Layout**:
  - Desktop: Sidebar + Split view (Left: Questions, Right: Answer Sheet).
  - Mobile: Top navigation with segmented control `[ Questions | Answer Sheet ]`.
- **Bidirectional Interactivity**:
  - Selecting a question card smoothly scrolls to and highlights the corresponding answer bounding box on the correct page.
  - Clicking on a bounding box in the answer viewer focuses and expands the corresponding question in the list.
