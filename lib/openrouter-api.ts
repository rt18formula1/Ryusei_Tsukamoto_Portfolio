import type { F1CalendarSchedule } from "./calendar-service";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "google/gemma-4-26b-a4b-it:free";

export interface OpenRouterResultData {
  grandPrix: string;
  sessionLabel?: string;
  results: string[];
  notes: string | null;
}

async function callOpenRouter(systemPrompt: string, userPrompt: string): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_SITE_URL || "https://ryusei-tsukamoto-portfolio.rb18vcarb.workers.dev/",
        "X-Title": "rt18_formula1 F1 DB",
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      console.warn("OpenRouter API error:", response.status, await response.text().catch(() => ""));
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (error) {
    console.warn("OpenRouter fetch failed:", error);
    return null;
  }
}

function parseJson<T>(text: string): T | null {
  try {
    return JSON.parse(text.replace(/```json\n?|```\n?/g, "").trim()) as T;
  } catch {
    return null;
  }
}

const SCHEDULE_SYSTEM = `You are an F1 data specialist. Return ONLY valid JSON for the official weekend schedule from Formula1.com.
Include ALL sessions with local track time and Japan Time (JST = UTC+9). Format dates as MM/DD.
For sprint weekends use Sprint Qualifying and Sprint instead of Practice 2/3.

Schema:
{
  "grandPrix": "FORMULA 1 GRAND PRIX NAME YEAR",
  "isSprintWeekend": false,
  "sessions": [
    {
      "name": "Practice 1",
      "date": "MM/DD",
      "japanDate": "MM/DD",
      "trackTime": "HH:MM - HH:MM",
      "japanTime": "HH:MM - HH:MM",
      "trackTimezone": "UTC+X"
    }
  ],
  "notes": null
}`;

const RESULT_SYSTEM = `You are an F1 data specialist. Return ONLY valid JSON for the official session result from Formula1.com.
List ALL drivers who participated. Use format "P1: Full Name" with colon.
Include steward notes (DSQ, penalties, 107% exceptions) in notes if any.

Schema:
{
  "grandPrix": "FORMULA 1 GRAND PRIX NAME YEAR",
  "sessionLabel": "SESSION NAME",
  "results": ["P1: Full Name", ...],
  "notes": "string or null"
}`;

export async function fetchScheduleFromOpenRouter(
  grandPrix: string,
  year: number
): Promise<F1CalendarSchedule | null> {
  const text = await callOpenRouter(
    SCHEDULE_SYSTEM,
    `Grand Prix: ${grandPrix}\nYear: ${year}\nFetch the complete official weekend schedule.`
  );
  if (!text) return null;

  const parsed = parseJson<{
    grandPrix: string;
    isSprintWeekend: boolean;
    sessions: F1CalendarSchedule["sessions"];
    notes: string | null;
  }>(text);

  if (!parsed?.sessions?.length) return null;

  return {
    grandPrix: parsed.grandPrix || grandPrix,
    isSprintWeekend: parsed.isSprintWeekend ?? false,
    sessions: parsed.sessions.map((s) => ({
      name: s.name,
      date: s.date,
      japanDate: s.japanDate || s.date,
      trackTime: s.trackTime,
      japanTime: s.japanTime,
      trackTimezone: s.trackTimezone || "UTC+0",
      startTime: "",
      endTime: null,
    })),
    notes: parsed.notes,
  };
}

export async function fetchResultFromOpenRouter(
  grandPrix: string,
  year: number,
  sessionLabel: string
): Promise<OpenRouterResultData | null> {
  const text = await callOpenRouter(
    RESULT_SYSTEM,
    `Grand Prix: ${grandPrix}\nSession: ${sessionLabel}\nYear: ${year}\nFetch the complete official result.`
  );
  if (!text) return null;

  const parsed = parseJson<OpenRouterResultData>(text);
  if (!parsed?.results?.length) return null;

  return {
    grandPrix: parsed.grandPrix || grandPrix,
    sessionLabel: parsed.sessionLabel || sessionLabel,
    results: parsed.results.map((r) => (r.includes(":") ? r : r.replace(/^P(\d+)\s+/, "P$1: "))),
    notes: parsed.notes ?? null,
  };
}

export function isOpenRouterConfigured() {
  return Boolean(process.env.OPENROUTER_API_KEY);
}
