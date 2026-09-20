const fs = require('fs');
const html = fs.readFileSync('hocvien.html', 'utf8');

// Extract the script tag content
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  const scriptContent = scriptMatch[1];
  try {
    const vm = require('vm');
    // Using a fake DOM environment just to check syntax
    new vm.Script(scriptContent);
    console.log("Valid JS");
  } catch(e) {
    console.error("SyntaxError:", e);
  }
} else {
  console.log("No script tag found");
}
