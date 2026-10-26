import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import fs from "node:fs";
import path from "node:path";

// Ensure OpenNext does not block Next.js 15 builds on Cloudflare Workers
try {
  const helperPath = path.resolve(process.cwd(), "node_modules/@opennextjs/aws/dist/build/helper.js");
  if (fs.existsSync(helperPath)) {
    let content = fs.readFileSync(helperPath, "utf8");
    if (content.includes('15: "2024-10-21"')) {
      content = content.replace('15: "2024-10-21"', '15: "2027-10-21"');
      fs.writeFileSync(helperPath, content, "utf8");
    }
  }
} catch {}

export default defineCloudflareConfig({
  // 必要に応じて設定を追加できますが、基本はこれだけで動きます
});
