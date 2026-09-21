import { NextResponse } from "next/server";
import { score, TypeSafeClient } from "@typesafe-ai/sdk";

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
    const client = new TypeSafeClient();

    const state = {
      hasMainVisual,
      hasInformation,
      hasDetails,
      hasGallery,
      hasLinks,
    };

    const response = await client.systemOne({
      state,
      questions: {
        completeness_score: score(
          "Assess the completeness of this content based on the provided flags. Consider how many sections are present.",
          [
            "incomplete",
            "minimal",
            "basic",
            "complete",
            "comprehensive",
          ]
        ),
      },
    });

    const completenessScore = response.answers.completeness_score.score;

    return NextResponse.json({ score: completenessScore });
  } catch (error) {
    console.error("TypeSafe API error:", error);
    return NextResponse.json(
      { error: "Failed to score completeness" },
      { status: 500 }
    );
  }
}
