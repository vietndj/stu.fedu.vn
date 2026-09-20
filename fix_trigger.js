const fs = require('fs');
let html = fs.readFileSync('hocvien.html', 'utf8');

const oldCode = `         for (const id of idsToSave) {
             const studentData = currentStudents.find(s => s.id === id);
             if (!studentData) continue;
             
             try {
                 const res = await fetch('/api/edits', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ pin: REQUIRED_PIN, id: id, data: studentData })
                 });
                 if (res.ok) successCount++;
             } catch (e) {
                 console.error("Cloud save failed for", id, e);
             }
         }`;

const newCode = `         for (const id of idsToSave) {
             const studentData = currentStudents.find(s => s.id === id);
             
             try {
                 const payload = { pin: REQUIRED_PIN, id: id };
                 if (!studentData) {
                     payload.action = "delete";
                 } else {
                     payload.data = studentData;
                 }
                 
                 const res = await fetch('/api/edits', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify(payload)
                 });
                 if (res.ok) successCount++;
             } catch (e) {
                 console.error("Cloud save failed for", id, e);
             }
         }`;

html = html.replace(oldCode, newCode);
fs.writeFileSync('hocvien.html', html);
