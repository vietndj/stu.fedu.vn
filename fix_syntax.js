const fs = require('fs');
let html = fs.readFileSync('hocvien.html', 'utf8');

// The first replacement made it `const INITIAL_STUDENTS = [];`
// We need to change that to `let INITIAL_STUDENTS = [];` and remove the second declaration.
html = html.replace('const INITIAL_STUDENTS = [];', '');

fs.writeFileSync('hocvien.html', html);
console.log("Fixed SyntaxError");
