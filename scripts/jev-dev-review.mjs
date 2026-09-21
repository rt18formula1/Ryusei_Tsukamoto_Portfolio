import fs from "node:fs";
import { askJev } from "./jev-client.mjs";

const targetFiles = [
  "app/admin/page.tsx",
  "components/portfolio-map/portfolio-map.tsx",
  "components/dev-project/dev-project-detail-client.tsx",
  "components/dev-project/dev-project-modal.tsx",
  "lib/supabase-queries.ts",
  "app/portfolio/developer/[activity]/page.tsx",
  "app/shop/page.tsx",
  "app/calendar/page.tsx",
];

async function main() {
  console.log("🚀 Running Jev System One Codebase Quality Review...\n");

  for (const relativePath of targetFiles) {
    if (!fs.existsSync(relativePath)) continue;
    const content = fs.readFileSync(relativePath, "utf-8");
    const snippet = content.slice(0, 3500);

    console.log(`Analyzing [${relativePath}] with Jev...`);

    const answers = await askJev(
      {
        filePath: relativePath,
        codeSnippet: snippet,
      },
      {
        has_potential_bugs_or_unhandled_errors: {
          type: "noul",
          instructions: "Does this code have potential runtime bug risks, unhandled edge cases, or missing error boundaries?",
        },
        ui_polish_score: {
          type: "score",
          instructions: "Rate the UI/UX polish, visual consistency, and completeness of this component.",
          criteria: [
            "Prototype / unpolished with rough styling",
            "Functional but basic layout and styling",
            "High quality with good responsiveness and interaction feedback",
            "Production-grade excellence with refined typography, micro-interactions, and robust edge cases",
          ],
        },
        type_safety_score: {
          type: "score",
          instructions: "Rate the TypeScript type safety (avoidance of loose 'any', proper null checking, strict typing).",
          criteria: [
            "Heavily relies on 'any' or lacks type validation",
            "Basic types with occasional loose types",
            "Strong typed interfaces and reliable props",
            "Strictly typed with exhaustive checks and no unsafe any",
          ],
        },
        highest_priority_improvement: {
          type: "choice",
          instructions: "What is the single most valuable improvement needed to maximize quality in this file?",
          criteria: {
            "type_strictness": "Eliminate 'any' casts and tighten TypeScript interfaces",
            "error_handling": "Add graceful error states, loading skeletons, or fallback UI",
            "responsive_styling": "Enhance mobile responsive breakpoints and visual spacing",
            "accessibility": "Add aria-labels, keyboard navigation, and semantic HTML",
            "code_modularization": "Break down large functions or extract reusable helpers",
          },
        },
      }
    );

    console.log(`  - Bug/Unhandled Risk: ${Math.round((answers.has_potential_bugs_or_unhandled_errors?.noul || 0) * 100)}%`);
    console.log(`  - UI Polish Score: ${answers.ui_polish_score?.score?.toFixed(1)} / 3.0 (Confidence: ${answers.ui_polish_score?.confidence?.toFixed(2)})`);
    console.log(`  - Type Safety Score: ${answers.type_safety_score?.score?.toFixed(1)} / 3.0`);
    console.log(`  - Highest Priority Improvement: 👉 [${answers.highest_priority_improvement?.choice}] (Confidence: ${answers.highest_priority_improvement?.confidence?.toFixed(2)})\n`);
  }

  console.log("✅ Jev review complete.");
}

main().catch(console.error);
