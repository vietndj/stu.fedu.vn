const fs = require('fs');
const html = fs.readFileSync('hocvien.html', 'utf8');

// Try to execute the script part to see if there are syntax errors
try {
  // Just a simple syntax check
  require('vm').Script(html);
  console.log("Valid JS");
} catch(e) {
  console.error(e);
}
