const fs = require('fs');
const data = JSON.parse(fs.readFileSync('students.json', 'utf8'));

let modified = 0;

data.forEach(s => {
  if (!s.class) return;
  
  const originalClass = s.class;
  let newClass = originalClass;
  
  // Normalize Offline 3 variations
  // Only match "Offline 3", "Offline K3", "Offline 19", "Offline Hà Nội 19"
  if (originalClass.match(/Offline 3|Offline K3|Offline 19-20|Offline Hà Nội 19-20/i)) {
    newClass = 'Offline 3';
    
    // Extract CRM states to tags or notes
    const matchMatch = originalClass.match(/\((.*?)\)|- (.*)/);
    if (matchMatch && matchMatch[0] && !originalClass.includes('(19-20/09)')) {
       // if it contains things like (Bảo lưu), (Sai tệp), (Đã CK)
       if (originalClass.match(/Bảo lưu|Chưa chốt|Dừng tư vấn|Sai tệp|Đã CK|Đã Cọc|Đã cọc|Không tiềm năng|Học 1 ngày/i)) {
           // Append to notes if not already there
           if (!s.notes) s.notes = "";
           if (!s.notes.includes(originalClass)) {
               s.notes = `[Nguồn Gốc: ${originalClass}]\n` + s.notes;
           }
       }
    }
  }
  // Normalize Offline 1 variations
  else if (originalClass.match(/Offline 1(?!9)|Offline K1/i)) { // Match 1 but not 19
    newClass = 'Offline 1';
  }
  // Normalize Offline 2 variations
  else if (originalClass.match(/Offline 2(?!0)|Offline K2/i) || originalClass === 'Offline 2 ngày') { // Match 2 but not 20
    newClass = 'Offline 2';
  }

  // Khóa Video Marketing - NDV -> Khóa Video Marketing
  if (originalClass === 'Khóa Video Marketing - NDV') {
      newClass = 'Khóa Video Marketing';
  }

  // Skool variations -> Khóa Online Skool
  if (originalClass.toLowerCase().includes('skool')) {
      newClass = 'Khóa Online Skool';
  }

  // Tư Vấn variations -> Tư Vấn
  if (originalClass.toLowerCase().includes('tư vấn')) {
      newClass = 'Tư Vấn';
      if (!s.notes) s.notes = "";
      if (!s.notes.includes(originalClass)) {
          s.notes = `[Nguồn Gốc Lớp: ${originalClass}]\n` + s.notes;
      }
  }


  if (newClass !== originalClass) {
    s.class = newClass;
    modified++;
  }
});

fs.writeFileSync('students.json', JSON.stringify(data, null, 2));
console.log(`Normalized ${modified} student records.`);
