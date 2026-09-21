import { NextResponse } from "next/server";
import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

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
    const client = new TypeSafeClient();

    const state = {
      name,
      existingSlugs: existingSlugs || [],
    };

    const response = await client.systemOne({
      state,
      questions: {
        slug_suggestion: choice(
          "Generate a URL-friendly slug from `name`. Use lowercase letters, numbers, and hyphens only. Remove special characters and ensure the slug is unique from `existingSlugs`.",
          {
            "generated-slug": "The generated slug",
          }
        ),
      },
    });

    const slug = response.answers.slug_suggestion.choice;

    return NextResponse.json({ slug });
  } catch (error) {
    console.error("TypeSafe API error:", error);
    return NextResponse.json(
      { error: "Failed to generate slug" },
      { status: 500 }
    );
  }
}
