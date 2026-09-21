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
  const { name, description } = body;

  if (!name) {
    return NextResponse.json(
      { error: "name is required" },
      { status: 400 }
    );
  }

  try {
    const client = new TypeSafeClient({ apiKey: TYPESAFE_API_KEY });

    const state = {
      name,
      description: description || "",
    };

    const questions = {
      content_type: {
        type: "choice" as const,
        instructions: "Classify this content based on `name` and `description`. Choose the most appropriate type.",
        criteria: {
          "project": "A software development project or application",
          "artwork": "An illustration, graphic art, or visual creative work",
          "work": "A music composition, sound design, or audio production",
          "article": "A written article, blog post, or technical documentation",
          "research": "Market research, investment analysis, or analytical study",
        },
      },
    };

    const response = await client.system_one({
      state,
      questions,
      selectedModels: ["jev-latest"],
    });

    const contentType = response.answers.content_type.selected;

    return NextResponse.json({ contentType });
  } catch (error) {
    console.error("TypeSafe API error:", error);
    return NextResponse.json(
      { error: "Failed to classify content" },
      { status: 500 }
    );
  }
}
