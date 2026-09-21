import fs from "node:fs";
import { askJevForInstructions } from "./jev-orchestrator.mjs";

const filesToInspect = [
  "app/admin/page.tsx",
  "components/portfolio-map/portfolio-map.tsx",
  "app/calendar/page.tsx",
  "app/portfolio/developer/[activity]/page.tsx",
  "app/shop/page.tsx",
  "components/dev-project/dev-project-modal.tsx",
];

async function run() {
  const reports = [];
  for (const file of filesToInspect) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, "utf-8");
    const result = await askJevForInstructions(file, content.slice(0, 3800));
    reports.push({ file, result });
    console.log(`\n📋 Jev Directive for [${file}]:`);
    console.log(`   - Priority Action: 👉 ${result.critical_defects?.choice} (Confidence: ${(result.critical_defects?.confidence * 100).toFixed(0)}%)`);
    console.log(`   - Quality Score: ${result.quality_score?.score?.toFixed(1)} / 3.0`);
    console.log(`   - Needs A11y Upgrade: ${(result.requires_accessibility_upgrade?.noul * 100).toFixed(0)}%`);
    console.log(`   - Needs Error Boundary / Fallback: ${(result.requires_error_boundary?.noul * 100).toFixed(0)}%`);
  }
  return reports;
}

run().catch(console.error);
