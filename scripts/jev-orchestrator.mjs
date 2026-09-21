import fs from "node:fs";
import { askJev } from "./jev-client.mjs";

/**
 * Jev Orchestrator: Antigravity が Jev にコードを提示して
 * 改善の指示（具体的なアクション、修正箇所、優先順位）を判定させる。
 */

export async function askJevForInstructions(filePath, codeSnippet, context) {
  console.log(`\n🧠 Sending code to Jev for evaluation & directive: [${filePath}]`);
  
  const questions = {
    critical_defects: {
      type: "choice",
      instructions: {
        context: context || "Portfolio Next.js application codebase",
        question: "What is the most pressing issue or missing edge-case in this code that needs immediate fixing?",
      },
      criteria: {
        "loose_types": "Replace 'any' with strict, type-safe interfaces",
        "missing_error_fallback": "Add graceful error catch, skeleton or empty fallback UI",
        "accessibility_gap": "Add proper ARIA labels, role attributes, and keyboard listeners",
        "performance_leak": "Optimize re-renders, useEffect dependencies, or memory cleanup",
        "none": "Code is clean and production ready",
      },
    },
    quality_score: {
      type: "score",
      instructions: "Score the overall production readiness and polish of this file (0=Poor, 3=Flawless).",
      criteria: [
        "Unfinished or prone to bugs / loose types",
        "Working but basic with gaps in safety or polish",
        "High quality with solid typing and error boundaries",
        "World-class production grade quality",
      ],
    },
    requires_accessibility_upgrade: {
      type: "noul",
      instructions: "Does this component lack necessary ARIA accessibility attributes or keyboard navigation handlers?",
    },
    requires_error_boundary: {
      type: "noul",
      instructions: "Is this code missing fallback UI or try-catch protection against network/data fetch failures?",
    },
  };

  const answers = await askJev({ filePath, codeSnippet }, questions);
  return answers;
}
