import { NextResponse } from "next/server";
import { choice, score, noul, TypeSafeClient } from "@typesafe-ai/sdk";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TYPESAFE_API_KEY = process.env.TYPESAFE_API_KEY;

export async function POST(request: Request) {
  if (!TYPESAFE_API_KEY) {
    return NextResponse.json(
      { error: "TYPESAFE_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { code, componentName, requirements } = body;

  if (!code) {
    return NextResponse.json(
      { error: "code is required" },
      { status: 400 }
    );
  }

  try {
    const client = new TypeSafeClient();

    const state = {
      code,
      componentName,
      requirements: requirements || {
        designPrinciples: ["Functional", "Clear", "Dense", "Organized"],
        techStack: {
          framework: "Next.js 15 with App Router",
          ui: "React client components",
          styling: "Tailwind CSS",
          icons: "lucide-react",
        },
      },
    };

    const response = await client.systemOne({
      state,
      questions: {
        follows_design_principles: noul(
          "Does `code` follow the Admin design principles (Functional, Clear, Dense, Organized)?"
        ),
        follows_existing_pattern: noul(
          "Does `code` follow the pattern from admin-activity-editor.tsx and admin-project-editor.tsx?"
        ),
        type_safety: noul(
          "Does `code` have proper TypeScript types and type safety?"
        ),
        accessibility: noul(
          "Does `code` have proper accessibility (labels, focus states, keyboard navigation)?"
        ),
        error_handling: noul(
          "Does `code` have proper error handling and validation?"
        ),
        code_quality: score(
          "Rate the overall code quality of `code` considering structure, readability, and best practices.",
          ["poor", "fair", "good", "excellent"]
        ),
        needs_refactoring: noul(
          "Does `code` need refactoring based on the above evaluations?"
        ),
        refactoring_priority: choice(
          "If refactoring is needed, what is the priority?",
          {
            "high": "Critical issues that must be fixed immediately",
            "medium": "Important improvements that should be addressed soon",
            "low": "Minor optimizations that can be deferred",
            "none": "No refactoring needed",
          }
        ),
      },
    });

    return NextResponse.json({
      followsDesignPrinciples: response.answers.follows_design_principles.noul,
      followsExistingPattern: response.answers.follows_existing_pattern.noul,
      typeSafety: response.answers.type_safety.noul,
      accessibility: response.answers.accessibility.noul,
      errorHandling: response.answers.error_handling.noul,
      codeQuality: response.answers.code_quality.score,
      needsRefactoring: response.answers.needs_refactoring.noul,
      refactoringPriority: response.answers.refactoring_priority.choice,
    });
  } catch (error) {
    console.error("Jev evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate code" },
      { status: 500 }
    );
  }
}
