import { NextRequest, NextResponse } from "next/server";
import { processAssessmentWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is not configured in server environment variables. Please configure GEMINI_API_KEY in .env.local",
        },
        { status: 500 }
      );
    }

    let qpImages: string[] = [];
    let ansImages: string[] = [];

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      qpImages = body.questionPaperImages || [];
      ansImages = body.answerSheetImages || [];
    } else {
      const formData = await req.formData();
      const qpFile = formData.get("questionPaper") as File | null;
      const ansFile = formData.get("answerSheet") as File | null;

      if (qpFile) {
        const buffer = Buffer.from(await qpFile.arrayBuffer());
        qpImages.push(`data:image/jpeg;base64,${buffer.toString("base64")}`);
      }
      if (ansFile) {
        const buffer = Buffer.from(await ansFile.arrayBuffer());
        ansImages.push(`data:image/jpeg;base64,${buffer.toString("base64")}`);
      }
    }

    if (qpImages.length === 0 || ansImages.length === 0) {
      return NextResponse.json(
        { error: "Please upload both Question Paper and Answer Sheet." },
        { status: 400 }
      );
    }

    const result = await processAssessmentWithGemini(qpImages, ansImages);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("API process-assessment error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process assessment";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
