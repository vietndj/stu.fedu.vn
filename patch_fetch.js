const fs = require('fs');
let html = fs.readFileSync('hocvien.html', 'utf8');

// Replace synchronous INITIAL_STUDENTS with an empty array
html = html.replace(/(const INITIAL_STUDENTS = )\[[\s\S]*?\];/, '$1[];');

// Replace synchronous loadStudents with async
const oldLoad = `    function loadStudents() {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);`;

const newLoad = `    let INITIAL_STUDENTS = [];
    async function loadStudents() {
      try {
        const res = await fetch('/students.json?t=' + Date.now());
        if (res.ok) {
          INITIAL_STUDENTS = await res.json();
        }
      } catch (e) {
        console.error("Lỗi fetch students.json:", e);
      }
      
      const saved = localStorage.getItem(STORAGE_KEY_DATA);`;

html = html.replace(oldLoad, newLoad);

// Make DOMContentLoaded async
const oldDOM = `    window.addEventListener('DOMContentLoaded', () => {
      checkPasscode();
      loadStudents();
      populateFilterDropdowns();
      renderAll();
      handleDeepLink();
    });`;

const newDOM = `    window.addEventListener('DOMContentLoaded', async () => {
      checkPasscode();
      await loadStudents();
      populateFilterDropdowns();
      renderAll();
      handleDeepLink();
    });`;

html = html.replace(oldDOM, newDOM);

fs.writeFileSync('hocvien.html', html);
console.log("Patched hocvien.html for async fetch!");
