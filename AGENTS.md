<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Veda AI Assessment Assistant

## Project Requirements
- **Dual File Upload & Progress**: Upload question paper and handwritten student answer sheet with stepped progress.
- **Ordered Question Extraction**: Extract every question in exact printed sequence.
- **Decompose Labelled Sub-Parts**: Treat labelled sub-parts as separate questions (e.g. `11 (a)` and `11 (b)` are two independent entries).
- **Preserve Numbering**: Maintain original numbering and labels (`1`, `2`, `11 a.`, `11 b.`).
- **Out-of-Order Answers**: Accurately detect and map answers attempted out of sequence.
- **Unanswered Questions**: Flag omitted questions as `unanswered` (award 0 marks with omission feedback).
- **Unmatched Answers**: Capture extra handwritten responses into `unmatchedAnswers`.
- **Bounding Box Localization**: Highlight regions with normalized coordinates `[ymin, xmin, ymax, xmax]`, neon glowing border, and docked `Q[x]` badges.
- **Multi-Page Spans**: Support answers that span across page breaks with separate bounding boxes per page.
- **Automated Grading & Feedback**: Calculate question-level scores, total percentage, and AI feedback.

## Tech Stack & Constraints
- **Stack**: Next.js 16 (App Router), React 19, TypeScript (strict, zero `any`), Tailwind CSS v4 (`@tailwindcss/postcss`) + CSS variables, `lucide-react`, `pdfjs-dist`, Google Gemini Flash API (`@google/genai`).
- **Cost**: 100% Free Tier only (zero paid APIs or databases).

## Coding & Design Rules
- **Clean Code**: Self-documenting code. No redundant comments, decorative banners, or divider lines.
- **Design Tokens**: Primary Orange `#FF5E3A`, Peach Accent `#FFF1EE`, Background `#F8F9FB`, Dark Slate `#1A1D24` / `#232730`, Active Green `#22C55E`.
- **Responsive & Interactive**: Match Figma desktop and mobile phone viewports. Bidirectional sync between question list and bounding box canvas.
