import type { Metadata } from "next";
import "./globals.css";
import { AssessmentProvider } from "@/context/AssessmentContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Bricolage_Grotesque } from "next/font/google";
import { cn } from "@/lib/utils";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Veda AI - Assessment Extraction & Answer Mapping",
  description:
    "AI-powered Question Extraction, Student Handwriting Localization, Bounding Box Mapping, and Automated Grading.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("h-full", "font-sans", bricolage.variable)}>
      <body className="h-full bg-background text-foreground flex flex-col antialiased">
        <AssessmentProvider>
          <TooltipProvider delay={200}>{children}</TooltipProvider>
        </AssessmentProvider>
      </body>
    </html>
  );
}
