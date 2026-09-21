// Client-side hook for calling Jev API endpoints
// This orchestrates calls to the TypeSafe/Jev API routes

interface SlugGenerationResponse {
  slug: string;
  error?: string;
}

interface ClassifyResponse {
  contentType: "project" | "artwork" | "work" | "article" | "research";
  error?: string;
}

interface CompletenessResponse {
  score: number;
  confidence: number;
  error?: string;
}

export async function generateSlug(name: string, existingSlugs: string[] = []): Promise<string> {
  try {
    const response = await fetch("/api/admin/jev/slug", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, existingSlugs }),
    });

    const data: SlugGenerationResponse = await response.json();

    if (data.error) {
      console.error("Slug generation error:", data.error);
      // Fallback to simple slug generation
      return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    return data.slug;
  } catch (error) {
    console.error("Slug generation failed:", error);
    // Fallback to simple slug generation
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
}

export async function classifyContentType(
  name: string,
  description?: string
): Promise<"project" | "artwork" | "work" | "article" | "research"> {
  try {
    const response = await fetch("/api/admin/jev/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    const data: ClassifyResponse = await response.json();

    if (data.error) {
      console.error("Classification error:", data.error);
      return "project"; // Fallback
    }

    return data.contentType;
  } catch (error) {
    console.error("Classification failed:", error);
    return "project"; // Fallback
  }
}

export async function scoreContentCompleteness(content: {
  hasMainVisual: boolean;
  hasInformation: boolean;
  hasDetails: boolean;
  hasGallery: boolean;
  hasLinks: boolean;
}): Promise<{ score: number; confidence: number }> {
  try {
    const response = await fetch("/api/admin/jev/completeness", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });

    const data: CompletenessResponse = await response.json();

    if (data.error) {
      console.error("Completeness scoring error:", data.error);
      // Fallback to simple calculation
      const score = Object.values(content).filter(Boolean).length / 5;
      return { score, confidence: 1 };
    }

    return { score: data.score, confidence: data.confidence };
  } catch (error) {
    console.error("Completeness scoring failed:", error);
    // Fallback to simple calculation
    const score = Object.values(content).filter(Boolean).length / 5;
    return { score, confidence: 1 };
  }
}
