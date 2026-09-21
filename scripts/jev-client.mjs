import fs from "node:fs";

const TYPESAFE_API_URL = "https://api.typesafe.ai/v1/systemone";
const TYPESAFE_MODEL = "jev-latest";

function loadEnv() {
  if (fs.existsSync(".env")) {
    const lines = fs.readFileSync(".env", "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || "";
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

const apiKey = process.env.TYPESAFE_API_KEY;
if (!apiKey) {
  console.error("❌ TYPESAFE_API_KEY is not set.");
  process.exit(1);
}

export async function askJev(state, questions) {
  const res = await fetch(TYPESAFE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      state,
      model: TYPESAFE_MODEL,
      questions,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`TypeSafe Jev API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.answers;
}
