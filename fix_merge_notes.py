import re

with open("hocvien.html", "r") as f:
    content = f.read()

old_notes_line = "notes: (localS.notes && localS.notes.trim().length > 0) ? localS.notes : (initS.notes || ''),"
new_notes_line = """notes: (() => {
                let finalNotes = (localS.notes && localS.notes.trim().length > 0) ? localS.notes : (initS.notes || '');
                if (initS.notes && initS.notes.includes('[PHẢN HỒI TRÀ ĐÁ]') && !finalNotes.includes('[PHẢN HỒI TRÀ ĐÁ]')) {
                  const parts = initS.notes.split('[PHẢN HỒI TRÀ ĐÁ]');
                  if (parts.length > 1) {
                    finalNotes += '\\n\\n[PHẢN HỒI TRÀ ĐÁ]' + parts[1];
                  }
                }
                return finalNotes;
              })(),"""

if old_notes_line in content:
    content = content.replace(old_notes_line, new_notes_line)
    with open("hocvien.html", "w") as f:
        f.write(content)
    print("Patched hocvien.html!")
else:
    print("Could not find the line to replace.")
