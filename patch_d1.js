const fs = require('fs');
let html = fs.readFileSync('hocvien.html', 'utf8');

const oldLoadStudents = `    async function loadStudents() {
      try {
        const res = await fetch('/students.json?t=' + Date.now());
        if (res.ok) {
          INITIAL_STUDENTS = await res.json();
        }
      } catch (e) {
        console.error("Lỗi fetch students.json:", e);
      }
      
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const parsedMap = new Map(parsed.map(s => [s.id, s]));

          // Smart merge: update each student with newest data from INITIAL_STUDENTS
          currentStudents = INITIAL_STUDENTS.map(initS => {
            const localS = parsedMap.get(initS.id);
            if (!localS) return initS;

            // Merge consultations
            const localConsults = localS.consultations || [];
            const localConsultUrls = new Set(localConsults.map(c => c.screenshot_url || c.id || c.topic));
            const newServerConsults = (initS.consultations || []).filter(c => !localConsultUrls.has(c.screenshot_url || c.id || c.topic));
            const mergedConsultations = [...newServerConsults, ...localConsults];

            // Merge videos
            const localVideos = localS.videos || [];
            const localVideoIds = new Set(localVideos.map(v => v.id || v.title));
            const newServerVideos = (initS.videos || []).filter(v => !localVideoIds.has(v.id || v.title));
            const mergedVideos = [...localVideos, ...newServerVideos];

            return {
              ...initS,
              ...localS,
              class: initS.class,
              industry: initS.industry,
              notes: (() => {
                let finalNotes = (localS.notes && localS.notes.trim().length > 0) ? localS.notes : (initS.notes || '');
                if (initS.notes && initS.notes.includes('[PHẢN HỒI TRÀ ĐÁ]') && !finalNotes.includes('[PHẢN HỒI TRÀ ĐÁ]')) {
                  const parts = initS.notes.split('[PHẢN HỒI TRÀ ĐÁ]');
                  if (parts.length > 1) {
                    finalNotes += '\n\n[PHẢN HỒI TRÀ ĐÁ]' + parts[1];
                  }
                }
                return finalNotes;
              })(),
              phone: localS.phone || initS.phone,
              zalo_url: localS.zalo_url || initS.zalo_url,
              facebook_url: localS.facebook_url || initS.facebook_url,
              drive_folder_url: localS.drive_folder_url || initS.drive_folder_url,
              avatar_url: initS.avatar_url || localS.avatar_url,
              consultations: mergedConsultations,
              videos: mergedVideos
            };
          });

          // Keep any locally created custom students not in INITIAL_STUDENTS
          const initIds = new Set(INITIAL_STUDENTS.map(s => s.id));
          const extraLocals = parsed.filter(s => !initIds.has(s.id));
          currentStudents = [...currentStudents, ...extraLocals];

          localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(currentStudents));
          document.getElementById('resetDataBtn').classList.remove('hidden');
        } catch(e) {
          console.error('Lỗi parse local data, dùng initial:', e);
          currentStudents = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
        }
      } else {
        currentStudents = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
      }
    }

    function saveStudents() {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(currentStudents));
      document.getElementById('resetDataBtn').classList.remove('hidden');
    }

    function resetToInitialData() {
      if (confirm(\`Khôi phục toàn bộ danh sách \${INITIAL_STUDENTS.length} học viên gốc ban đầu? Mọi chỉnh sửa cục bộ sẽ bị ghi đè.\`)) {
        localStorage.removeItem(STORAGE_KEY_DATA);
        currentStudents = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
        document.getElementById('resetDataBtn').classList.add('hidden');
        populateFilterDropdowns();
        renderAll();
        showToast(\`Đã khôi phục dữ liệu \${INITIAL_STUDENTS.length} học viên gốc!\`);
      }
    }`;


const newLoadStudents = `    // Đổi logic: Fetch từ cả students.json và D1 Database!
    async function loadStudents() {
      try {
        const res = await fetch('/students.json?t=' + Date.now());
        if (res.ok) {
          INITIAL_STUDENTS = await res.json();
        }
      } catch (e) {
        console.error("Lỗi fetch students.json:", e);
      }
      
      let d1Edits = [];
      try {
        const res = await fetch('/api/edits');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.edits) {
            d1Edits = data.edits.map(e => JSON.parse(e.data));
          }
        }
      } catch (e) {
        console.error("Lỗi fetch D1 edits:", e);
      }
      
      // Fallback cho localStorage cũ (để không mất data chưa sync)
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      let localEdits = [];
      if (saved) {
         try { localEdits = JSON.parse(saved); } catch(e){}
      }
      
      // Ưu tiên: D1 > LocalStorage > Initial
      const mergedMap = new Map();
      
      // 1. Nạp initial
      INITIAL_STUDENTS.forEach(s => mergedMap.set(s.id, s));
      
      // 2. Nạp local storage (cũ)
      localEdits.forEach(s => {
          if (mergedMap.has(s.id)) {
              mergedMap.set(s.id, { ...mergedMap.get(s.id), ...s });
          } else {
              mergedMap.set(s.id, s);
          }
      });
      
      // 3. Nạp D1 edits (mới nhất)
      d1Edits.forEach(s => {
          if (mergedMap.has(s.id)) {
              const initS = mergedMap.get(s.id);
              const localS = s;
              
              const localConsults = localS.consultations || [];
              const localConsultUrls = new Set(localConsults.map(c => c.screenshot_url || c.id || c.topic));
              const newServerConsults = (initS.consultations || []).filter(c => !localConsultUrls.has(c.screenshot_url || c.id || c.topic));
              const mergedConsultations = [...newServerConsults, ...localConsults];

              const localVideos = localS.videos || [];
              const localVideoIds = new Set(localVideos.map(v => v.id || v.title));
              const newServerVideos = (initS.videos || []).filter(v => !localVideoIds.has(v.id || v.title));
              const mergedVideos = [...localVideos, ...newServerVideos];
              
              mergedMap.set(s.id, {
                ...initS,
                ...localS,
                class: initS.class,
                industry: initS.industry,
                notes: (() => {
                  let finalNotes = (localS.notes && localS.notes.trim().length > 0) ? localS.notes : (initS.notes || '');
                  if (initS.notes && initS.notes.includes('[PHẢN HỒI TRÀ ĐÁ]') && !finalNotes.includes('[PHẢN HỒI TRÀ ĐÁ]')) {
                    const parts = initS.notes.split('[PHẢN HỒI TRÀ ĐÁ]');
                    if (parts.length > 1) {
                      finalNotes += '\\n\\n[PHẢN HỒI TRÀ ĐÁ]' + parts[1];
                    }
                  }
                  return finalNotes;
                })(),
                phone: localS.phone || initS.phone,
                zalo_url: localS.zalo_url || initS.zalo_url,
                facebook_url: localS.facebook_url || initS.facebook_url,
                drive_folder_url: localS.drive_folder_url || initS.drive_folder_url,
                avatar_url: initS.avatar_url || localS.avatar_url,
                consultations: mergedConsultations,
                videos: mergedVideos
              });
          } else {
              mergedMap.set(s.id, s);
          }
      });

      currentStudents = Array.from(mergedMap.values());
      // Sắp xếp lại giống ban đầu (ID match)
      const orderMap = new Map(INITIAL_STUDENTS.map((s, i) => [s.id, i]));
      currentStudents.sort((a, b) => {
          const idxA = orderMap.has(a.id) ? orderMap.get(a.id) : 99999;
          const idxB = orderMap.has(b.id) ? orderMap.get(b.id) : 99999;
          return idxA - idxB;
      });
      
      document.getElementById('resetDataBtn').classList.add('hidden'); // Ẩn hoàn toàn vì không dùng localStorage nữa
    }

    let saveTimeout = null;
    let pendingSaves = new Set();
    
    function saveStudents(updatedStudentId = null) {
      // Lưu tạm vào localStorage như 1 layer backup
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(currentStudents));
      
      // Auto-save lên D1
      if (updatedStudentId) {
          pendingSaves.add(updatedStudentId);
          triggerCloudSave();
      } else {
          // Lưu tất cả nếu ko chỉ định
          currentStudents.forEach(s => pendingSaves.add(s.id));
          triggerCloudSave();
      }
    }
    
    async function triggerCloudSave() {
      if (saveTimeout) clearTimeout(saveTimeout);
      showToast("⏳ Đang đồng bộ lên Cloud...");
      
      saveTimeout = setTimeout(async () => {
         const idsToSave = Array.from(pendingSaves);
         pendingSaves.clear();
         
         let successCount = 0;
         for (const id of idsToSave) {
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
         }
         
         if (successCount > 0) {
             showToast(\`✅ Đã lưu \${successCount} thay đổi lên Cloud\`);
         }
      }, 1000); // Debounce 1s
    }

    function resetToInitialData() {
        alert("Tính năng đã bị khóa để an toàn dữ liệu. Dữ liệu của bạn hiện được Auto-save trên Cloudflare D1.");
    }`;

html = html.replace(oldLoadStudents, newLoadStudents);
fs.writeFileSync('hocvien.html', html);
console.log("Patched hocvien.html for D1");
