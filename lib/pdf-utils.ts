import { AnswerSheetPage } from "@/types/assessment";

export async function convertFileToPages(file: File): Promise<AnswerSheetPage[]> {
  if (file.type.startsWith("image/")) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          resolve([
            {
              pageNumber: 1,
              imageUrl: dataUrl,
              width: img.naturalWidth || 800,
              height: img.naturalHeight || 1100,
            },
          ]);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  }

  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      const pages: AnswerSheetPage[] = [];

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // High resolution 2x
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (ctx) {
          await page.render({
            canvas,
            canvasContext: ctx,
            viewport,
          }).promise;

          pages.push({
            pageNumber: i,
            imageUrl: canvas.toDataURL("image/jpeg", 0.92),
            width: viewport.width,
            height: viewport.height,
          });
        }
      }

      return pages;
    } catch (err) {
      console.error("PDF conversion error:", err);
      // Fallback: create placeholder
      return [
        {
          pageNumber: 1,
          imageUrl: URL.createObjectURL(file),
          width: 800,
          height: 1100,
        },
      ];
    }
  }

  return [];
}
