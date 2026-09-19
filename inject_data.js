const fs = require('fs');

const data = fs.readFileSync('students.json', 'utf8');

function injectIntoHtml(filename) {
    if (!fs.existsSync(filename)) return;
    
    let html = fs.readFileSync(filename, 'utf8');
    
    // Find the const INITIAL_STUDENTS = ... ;
    // We can use a regex to match from `const INITIAL_STUDENTS = [` up to the end of the array, before `const STORAGE_KEY_DATA`
    const regex = /(const INITIAL_STUDENTS = )\[[\s\S]*?\];/;
    
    if (regex.test(html)) {
        html = html.replace(regex, `$1${data};`);
        fs.writeFileSync(filename, html);
        console.log(`Injected data into ${filename}`);
    } else {
        console.log(`Could not find INITIAL_STUDENTS in ${filename}`);
    }
}

injectIntoHtml('index.html');
injectIntoHtml('hocvien.html');
