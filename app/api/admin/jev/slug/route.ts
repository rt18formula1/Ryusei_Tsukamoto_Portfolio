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
  const { name, existingSlugs } = body;

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
      existingSlugs: existingSlugs || [],
    };

    const questions = {
      slug_suggestion: {
        type: "choice" as const,
        instructions: "Generate a URL-friendly slug from `name`. Use lowercase letters, numbers, and hyphens only. Remove special characters and ensure the slug is unique from `existingSlugs`.",
        criteria: {
          "generated-slug": "The generated slug",
        },
      },
    };

    const response = await client.system_one({
      state,
      questions,
      selectedModels: ["jev-latest"],
    });

    const slug = response.answers.slug_suggestion.selected;

    return NextResponse.json({ slug });
  } catch (error) {
    console.error("TypeSafe API error:", error);
    return NextResponse.json(
      { error: "Failed to generate slug" },
      { status: 500 }
    );
  }
}
