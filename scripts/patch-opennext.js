const fs = require('fs');
const path = require('path');

const helperPath = path.join(__dirname, '..', 'node_modules', '@opennextjs', 'aws', 'dist', 'build', 'helper.js');

if (fs.existsSync(helperPath)) {
  let content = fs.readFileSync(helperPath, 'utf8');
  if (content.includes('15: "2024-10-21"')) {
    content = content.replace('15: "2024-10-21"', '15: "2027-10-21"');
    fs.writeFileSync(helperPath, content, 'utf8');
    console.log('[patch-opennext] Extended Next.js 15 support date in @opennextjs/aws');
  }
}
