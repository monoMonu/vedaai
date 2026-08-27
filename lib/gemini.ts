import { GoogleGenAI } from "@google/genai";
import { AssessmentResult } from "@/types/assessment";

export async function processAssessmentWithGemini(
  questionPaperImages: string[],
  answerSheetImages: string[]
): Promise<AssessmentResult> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please add GEMINI_API_KEY in your .env.local file."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a world-class AI Assessment Extraction & Handwritten Grading System for teachers.
You are given:
- ${questionPaperImages.length} Question Paper image(s) (first set of images)
- ${answerSheetImages.length} Student Handwritten Answer Sheet image(s) (second set of images, in sequential page order starting at Page 1)

TASK INSTRUCTIONS:
1. QUESTION EXTRACTION:
   - Extract EVERY question printed on the question paper in exact printed order.
   - If a question contains labelled sub-parts (e.g., 11(a) and 11(b), or 1(a), 1(b)), decompose EACH sub-part into its own separate question item.
   - Use 'fullLabel' like "1", "2", "11 a.", "11 b.".
   - Preserve original question numbering, text, and maximum marks (if marks are not printed, default logically e.g. 2, 3, or 5).

2. STUDENT HANDWRITTEN ANSWER LOCALIZATION:
   - Carefully scan each page of the student's handwritten answer sheet.
   - Match each student answer to its corresponding question (even if written out of order).
   - For every answer found, detect its exact bounding box coordinates on that page:
     [ymin, xmin, ymax, xmax] as normalized float numbers between 0.0 and 1.0 (where 0.0 is top/left, 1.0 is bottom/right).
   - If an answer spans multiple pages (e.g. starts on Page 1 and continues on Page 2), provide multiple entries in 'answerSpans' with the respective pageNumber (1-indexed) and box coordinates.
   - If a question was NOT attempted / left blank by the student, mark status as "unanswered", set scoredMarks to 0, and leave answerSpans as an empty array [].
   - If the student wrote an answer or diagram that does not match any printed question, place it in 'unmatchedAnswers'.

3. GRADING & TEACHER AI FEEDBACK:
   - Evaluate the handwritten response correctness and assign 'scoredMarks' (out of 'maxMarks').
   - Provide clear, encouraging, and constructive 'aiFeedback' per question.
   - Summarize overall performance in 'summaryFeedback', calculate total scored marks, total max marks, and percentage.

OUTPUT FORMAT:
Return strictly a valid JSON object matching this schema (do not wrap in markdown code fence):
{
  "id": "eval_${Date.now()}",
  "examTitle": "string",
  "subject": "string",
  "studentName": "Student Submission",
  "totalQuestions": number,
  "totalMaxMarks": number,
  "totalScoredMarks": number,
  "percentage": number,
  "summaryFeedback": "string",
  "questions": [
    {
      "id": "q1",
      "questionNumber": 1,
      "fullLabel": "1",
      "text": "string",
      "maxMarks": number,
      "scoredMarks": number,
      "status": "answered" | "unanswered" | "partially_answered",
      "aiFeedback": "string",
      "keyConcept": "string",
      "answerSpans": [
        {
          "id": "ans_1_p1",
          "pageNumber": 1,
          "box": {
            "pageNumber": 1,
            "ymin": 0.12,
            "xmin": 0.05,
            "ymax": 0.35,
            "xmax": 0.95
          },
          "transcribedText": "string"
        }
      ]
    }
  ],
  "unmatchedAnswers": []
}`;

  const contents: any[] = [];

  // 1. Add Question Paper pages
  questionPaperImages.forEach((imgBase64, idx) => {
    contents.push({
      text: `[QUESTION PAPER - PAGE ${idx + 1}]`,
    });
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imgBase64.replace(/^data:image\/\w+;base64,/, ""),
      },
    });
  });

  // 2. Add Student Answer Sheet pages
  answerSheetImages.forEach((imgBase64, idx) => {
    contents.push({
      text: `[STUDENT ANSWER SHEET - PAGE ${idx + 1}]`,
    });
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imgBase64.replace(/^data:image\/\w+;base64,/, ""),
      },
    });
  });

  // 3. Add Prompt
  contents.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents,
    config: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  });

  const rawText = response.text || "{}";
  const parsedData = JSON.parse(rawText) as AssessmentResult;
  return parsedData;
}
