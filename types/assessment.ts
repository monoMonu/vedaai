export interface NormalizedBoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
  pageNumber: number;
}

export interface AnswerSpan {
  id: string;
  pageNumber: number;
  box: NormalizedBoundingBox;
  transcribedText?: string;
  confidence?: number;
  isUnmatched?: boolean;
}

export interface SubQuestion {
  id: string;
  parentQuestionNumber: number;
  subPartLabel: string;
  fullNumber: string;
  text: string;
  maxMarks: number;
  scoredMarks: number;
  status: "answered" | "unanswered" | "partially_answered" | "unmatched";
  aiFeedback: string;
  answerSpans: AnswerSpan[];
  keyConcept?: string;
}

export interface Question {
  id: string;
  questionNumber: number;
  fullLabel: string;
  text: string;
  maxMarks: number;
  scoredMarks: number;
  status: "answered" | "unanswered" | "partially_answered" | "unmatched";
  aiFeedback: string;
  answerSpans: AnswerSpan[];
  subQuestions?: SubQuestion[];
  keyConcept?: string;
  correctAnswerSummary?: string;
  rubricBreakdown?: {
    criterion: string;
    pointsScored: number;
    maxPoints: number;
  }[];
}

export interface AnswerSheetPage {
  pageNumber: number;
  imageUrl: string;
  width: number;
  height: number;
}

export interface AssessmentResult {
  id: string;
  examTitle: string;
  subject: string;
  studentName: string;
  totalQuestions: number;
  totalMaxMarks: number;
  totalScoredMarks: number;
  percentage: number;
  summaryFeedback: string;
  questions: Question[];
  unmatchedAnswers: AnswerSpan[];
  answerSheetPages: AnswerSheetPage[];
  questionPaperPages?: AnswerSheetPage[];
  processedAt: string;
}

export interface UploadedFileMeta {
  file: File | null;
  name: string;
  size: number;
  pageCount: number;
  previewUrl?: string;
  pages?: AnswerSheetPage[];
}
