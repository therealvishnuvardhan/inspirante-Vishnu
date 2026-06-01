const fs = require('fs');
const path = require('path');

const logFilePath = 'C:\\Users\\VISHNU VARDHAN\\.gemini\\antigravity-ide\\brain\\1954118f-e497-4233-abd7-874504c91b57\\.system_generated\\logs\\transcript.jsonl';

try {
  const fileContent = fs.readFileSync(logFilePath, 'utf8');
  const lines = fileContent.split('\n');
  if (lines.length > 0) {
    const firstLine = JSON.parse(lines[0]);
    const content = firstLine.content;
    console.log("FOUND BRIEF:");
    console.log(content);
    fs.writeFileSync('scratch/brief.md', content);
    console.log("Written to scratch/brief.md successfully!");
  } else {
    console.log("No lines found in log file");
  }
} catch (err) {
  console.error("Error reading file:", err);
}
