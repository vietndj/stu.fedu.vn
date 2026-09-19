const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Add the button to Quick Filters
const btnHtml = `
        <button onclick="setStatusFilter('offline3')" id="status-offline3" class="status-chip px-2.5 py-1 rounded-xl text-xs font-semibold transition bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 flex items-center gap-1.5 whitespace-nowrap">
          <span>🔥</span> Offline 3 <span id="badgeCountOffline3" class="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded-full font-bold">0</span>
        </button>`;

if (!html.includes('id="status-offline3"')) {
    html = html.replace('id="status-has_notes"', 'id="status-has_notes"'); // find insertion point
    html = html.replace(/(<button onclick="setStatusFilter\('has_drive'\)".*?<\/button>)/s, '$1' + btnHtml);
}

// Update the badge count JS
const badgeCountJs = `      const countDrive = currentStudents.filter(s => s.drive_folder_url && s.drive_folder_url.trim()).length;
      const countOffline3 = currentStudents.filter(s => s.class === 'Offline 3').length;`;

const badgeSetJs = `      const elDrive = document.getElementById('badgeCountDrive');
      if (elDrive) elDrive.textContent = countDrive;
      const elOffline3 = document.getElementById('badgeCountOffline3');
      if (elOffline3) elOffline3.textContent = countOffline3;`;

if (!html.includes('countOffline3')) {
    html = html.replace(/const countDrive =.*?;/, badgeCountJs);
    html = html.replace(/const elDrive = document\.getElementById\('badgeCountDrive'\);\s*if \(elDrive\) elDrive\.textContent = countDrive;/, badgeSetJs);
}

// Update the filter logic JS
const filterLogicJs = `        // Status filter (Điểm 1 UI/UX: Lọc Nhanh 1-Chạm)
        if (activeStatusFilter !== 'all') {
          if (activeStatusFilter === 'has_video' && (!s.videos || s.videos.length === 0)) return false;
          if (activeStatusFilter === 'has_notes' && (!s.notes || !s.notes.trim())) return false;
          if (activeStatusFilter === 'missing_phone' && (s.phone && s.phone.trim() !== '')) return false;
          if (activeStatusFilter === 'has_drive' && (!s.drive_folder_url || !s.drive_folder_url.trim())) return false;
          if (activeStatusFilter === 'offline3' && s.class !== 'Offline 3') return false;
        }`;

if (!html.includes("activeStatusFilter === 'offline3'")) {
    html = html.replace(/\/\/ Status filter[\s\S]*?(?=\/\/ Industry filter)/, filterLogicJs + '\n\n        ');
}

fs.writeFileSync('index.html', html);
console.log('Patched index.html');
