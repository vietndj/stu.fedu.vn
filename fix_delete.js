const fs = require('fs');
let html = fs.readFileSync('hocvien.html', 'utf8');

html = html.replace(
  '      currentStudents = currentStudents.filter(s => s.id !== deleteTargetId);\n      saveStudents(id);',
  '      currentStudents = currentStudents.filter(s => s.id !== deleteTargetId);\n      saveStudents(deleteTargetId);'
);

fs.writeFileSync('hocvien.html', html);
