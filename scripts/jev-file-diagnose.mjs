import fs from "node:fs";
import { askJev } from "./jev-client.mjs";

const file = process.argv[2];
if (!file || !fs.existsSync(file)) {
  console.error("Usage: node scripts/jev-file-diagnose.mjs <filepath>");
  process.exit(1);
}

const content = fs.readFileSync(file, "utf-8");

async function diagnose() {
  console.log(`\n🔍 Jev Deep Diagnosis for: ${file}\n`);
  const answers = await askJev(
    {
      filePath: file,
      code: content.slice(0, 4000),
    },
    {
      specific_flaws: {
        type: "choice",
        instructions: "What is the primary technical debt or vulnerability in this code?",
        criteria: {
          "untyped_any": "Use of explicit or implicit 'any' bypassing TypeScript checking",
          "unhandled_rejection": "Async/Promise operations without try-catch or error handling",
          "missing_loading_or_empty_state": "UI fails to render graceful loading or empty state",
          "hardcoded_magic_strings": "Magic constants or URLs that should be central config",
          "dom_accessibility": "Missing aria labels, keyboard accessibility, or focus states",
        },
      },
      severity_score: {
        type: "score",
        instructions: "Rate how critical it is to refactor this file for production readiness.",
        criteria: [
          "Low (Minor cosmetic or non-critical improvement)",
          "Medium (Noticeable type looseness or styling gap)",
          "High (Substantial type hazard or error handling omission)",
          "Critical (Breaking potential or severe degradation in reliability)",
        ],
      },
      can_be_cleanly_typed: {
        type: "noul",
        instructions: "Can this file be refactored to achieve 100% strict TypeScript types without any 'any'?",
      },
    }
  );

  console.log("Jev Verdict:");
  console.log(`  - Primary Issue: 👉 ${answers.specific_flaws?.choice} (Confidence: ${answers.specific_flaws?.confidence?.toFixed(2)})`);
  console.log(`  - Severity Level: ${answers.severity_score?.score?.toFixed(1)} / 3.0`);
  console.log(`  - Strict Typing Achievable: ${Math.round((answers.can_be_cleanly_typed?.noul || 0) * 100)}%\n`);
}

diagnose().catch(console.error);
