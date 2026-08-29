# Veda AI Assessment Assistant

AI-powered question extraction, handwritten answer sheet localization, and automated grading platform for teachers.

---

### 1. Approach
- **Client-Side PDF Processing**: Renders multi-page PDFs directly to JPEG canvases in-browser via `pdfjs-dist` (zero server cost & lightweight payloads).
- **AI Vision Pipeline**: Sends question paper and answer sheet images to Gemini Vision to extract questions in printed order, decompose sub-parts (`11a`, `11b`), map out-of-order handwriting, localize 2D bounding boxes `[ymin, xmin, ymax, xmax]`, and generate grades/feedback.
- **Bi-Directional Dashboard**: Selecting a question highlights its bounding box with pan/zoom and page navigation, while clicking a box focuses the question.

---

### 2. AI Model & API Used
- **Model**: `gemini-3.6-flash` (via Google GenAI SDK).
- **Cost**: 100% Free Tier API key from Google AI Studio

---

### 3. Assumptions & Limitations
- **Handwriting Quality**: Handwriting must be reasonably legible and well-lit.
- **File Formats**: Supports PDF, PNG, JPG, and WebP up to ~15 pages per document.
- **Platform**: Designed for desktop and mobile phone viewports matching Figma specifications.

---

### 4. Quick Start
```bash
npm install
# Set GEMINI_API_KEY in .env.local
npm run dev
```
