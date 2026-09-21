import { NextResponse } from "next/server";
import { TypeSafeClient } from "typesafe-sdk";

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
  const { hasMainVisual, hasInformation, hasDetails, hasGallery, hasLinks } = body;

  try {
    const client = new TypeSafeClient({ apiKey: TYPESAFE_API_KEY });

    const state = {
      hasMainVisual,
      hasInformation,
      hasDetails,
      hasGallery,
      hasLinks,
    };

    const questions = {
      completeness_score: {
        type: "score" as const,
        instructions: "Assess the completeness of this content based on the provided flags. Consider how many sections are present.",
        criteria: [
          "incomplete",
          "minimal",
          "basic",
          "complete",
          "comprehensive",
        ],
      },
    };

    const response = await client.system_one({
      state,
      questions,
      selectedModels: ["jev-latest"],
    });

    const score = response.answers.completeness_score.score;
    const confidence = response.answers.completeness_score.confidence;

    return NextResponse.json({ score, confidence });
  } catch (error) {
    console.error("TypeSafe API error:", error);
    return NextResponse.json(
      { error: "Failed to score completeness" },
      { status: 500 }
    );
  }
}
