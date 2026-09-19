#!/usr/bin/env node
/**
 * normalize_v2.js — Chuẩn hóa triệt để class & industry trong students.json
 * Sau đó inject lại vào index.html & hocvien.html
 * 
 * Chạy: node normalize_v2.js
 */

const fs = require('fs');
const path = require('path');

const STUDENTS_PATH = path.join(__dirname, 'students.json');
const INDEX_PATH = path.join(__dirname, 'index.html');
const HOCVIEN_PATH = path.join(__dirname, 'hocvien.html');

// ========================== CLASS NORMALIZATION ==========================

function normalizeClass(originalClass) {
  if (!originalClass) return { normalized: 'Chưa Phân Loại', crmStatus: null };
  
  const c = originalClass.trim();
  const cLower = c.toLowerCase();
  
  // Extract CRM status from parentheses
  let crmStatus = null;
  const crmPatterns = [
    /\(Đã CK\)/i, /\(Đã Cọc\)/i, /\(Bảo lưu\)/i, /\(Chưa chốt\)/i,
    /\(Dừng tư vấn\)/i, /\(Sai tệp\)/i, /\(Không tiềm năng\)/i,
    /\(Đang ở Đà Nẵng\)/i, /\(Học 1 ngày\)/i, /- Học 1 ngày/i,
    /- Đã cọc 3tr/i, /\(Đã Cọc\)/i
  ];
  for (const pat of crmPatterns) {
    const m = c.match(pat);
    if (m) {
      crmStatus = m[0].replace(/^\(|\)$/g, '').replace(/^- /, '').trim();
    }
  }
  
  // Offline 3 and K3 variants
  if (/offline\s*3|offline\s*k3|offline\s*19[- ]?20|offline\s*hà\s*nội\s*19/i.test(cLower)) {
    return { normalized: 'Offline 3', crmStatus };
  }
  
  // Offline 1
  if (/offline\s*1(?!9)|offline\s*k1/i.test(cLower)) {
    return { normalized: 'Offline 1', crmStatus };
  }
  
  // Offline 2
  if (/offline\s*2(?!0)|offline\s*k2|offline\s*video\s*marketing\s*hn/i.test(cLower)) {
    return { normalized: 'Offline 2', crmStatus };
  }
  
  // Khóa Video Marketing
  if (/khóa\s*video\s*marketing/i.test(cLower) || cLower === 'khóa video marketing - ndv') {
    return { normalized: 'Khóa Video Marketing', crmStatus };
  }
  
  // Khóa Online Skool
  if (/skool|599k|active\s*skool/i.test(cLower)) {
    return { normalized: 'Khóa Online Skool', crmStatus };
  }
  
  // Tư Vấn
  if (/tư\s*vấn/i.test(cLower)) {
    // Extract the specific consulting type
    const tvType = c.replace(/^Tư Vấn\s*/i, '').trim();
    crmStatus = crmStatus || (tvType && tvType !== 'Fanpage' ? tvType : null);
    return { normalized: 'Tư Vấn', crmStatus: tvType || null };
  }
  
  // Đặc biệt (keep as-is)
  if (/diễn\s*giả|master|vip|kỹ\s*năng\s*kịch\s*bản|doanh\s*nghiệp|sản\s*phẩm\s*kỹ\s*thuật/i.test(cLower)) {
    return { normalized: 'Đặc Biệt', crmStatus: c };
  }
  
  return { normalized: c, crmStatus };
}

// ========================== INDUSTRY NORMALIZATION ==========================

function normalizeIndustry(originalIndustry) {
  if (!originalIndustry) return 'Chưa Phân Loại';
  
  const ind = originalIndustry.trim();
  const iLower = ind.toLowerCase();
  
  // Bất Động Sản
  if (/bất\s*động\s*sản|bđs|môi\s*giới\s*dự\s*án/i.test(iLower)) {
    return 'Bất Động Sản';
  }
  
  // F&B & Ẩm Thực
  if (/f&b|f\u0026b|nhà\s*hàng|bánh|trà\s*lên\s*men|kombucha|đồ\s*uống|ẩm\s*thực|thực\s*phẩm\s*chay|ngũ\s*cốc\s*dinh\s*dưỡng/i.test(iLower)) {
    return 'F&B & Ẩm Thực';
  }
  
  // Sức Khỏe & Làm Đẹp (BEFORE Thời Trang to catch beauty/spa first)
  if (/beauty|spa|salon\s*tóc|hair\s*salon|barber|hair\s*design|làm\s*đẹp|fitness|gym|coach\s*gym|dưỡng\s*sinh|dược|y\s*tế|thiết\s*bị\s*thẩm\s*mỹ|tattoo|makeup|sức\s*khỏe|da\s*liễu|clinic|trainer|dinh\s*dưỡng|herbalife|cắt\s*tóc|trị\s*nám|gội\s*đầu|giảm\s*cân|chăm\s*sóc\s*tóc|phòng\s*fit/i.test(iLower)) {
    return 'Sức Khỏe & Làm Đẹp';
  }
  
  // Giáo Dục & Đào Tạo
  if (/giáo\s*dục|đào\s*tạo|giáo\s*viên|giảng\s*viên|mầm\s*non|tiểu\s*học|coaching/i.test(iLower)) {
    return 'Giáo Dục & Đào Tạo';
  }
  
  // Thời Trang & Mỹ Phẩm
  if (/thời\s*trang|mỹ\s*phẩm\s*mẹ|mỹ\s*phẩm.*b2b|tiktok\s*shop/i.test(iLower)) {
    return 'Thời Trang & Mỹ Phẩm';
  }
  
  // Nông Nghiệp
  if (/nông\s*nghiệp|phân\s*bón|cây\s*trồng|rừng.*nông\s*sản/i.test(iLower)) {
    return 'Nông Nghiệp';
  }
  
  // Tài Chính & Bảo Hiểm
  if (/bảo\s*hiểm|aia|tài\s*chính|forex/i.test(iLower)) {
    return 'Tài Chính & Bảo Hiểm';
  }
  
  // Dịch Vụ Chuyên Gia
  if (/luật\s*sư|pháp\s*lý|chủ\s*doanh\s*nghiệp|quản\s*lý|nhà\s*báo|diễn\s*giả/i.test(iLower)) {
    return 'Dịch Vụ Chuyên Gia';
  }
  
  // Sáng Tạo & Truyền Thông
  if (/sáng\s*tạo|truyền\s*thông|content|thiết\s*kế\s*đồ\s*họa|đồ\s*họa|phong\s*cách\s*sống|xây\s*dựng\s*thương\s*hiệu|xây\s*kênh|video\s*maker|video\s*marketing|sản\s*xuất\s*nội\s*dung|nội\s*dung\s*số/i.test(iLower)) {
    return 'Sáng Tạo & Truyền Thông';
  }
  
  // Bán Lẻ & Thương Mại
  if (/bán\s*lẻ|gia\s*dụng|thương\s*mại|nội\s*thất|decor|vật\s*liệu|xe\s*máy|cơ\s*khí|kính\s*mắt|thiết\s*bị\s*điện|năng\s*lượng|sơn|hạt\s*cườm|công\s*nghệ|iphone|scan\s*in|cơ\s*điện|quảng\s*cáo|đồ\s*bếp|sửa\s*chữa|thủ\s*công/i.test(iLower)) {
    return 'Bán Lẻ & Thương Mại';
  }
  
  // Kinh Doanh Tổng Hợp
  if (/kinh\s*doanh|nội\s*trợ|nv\s*vp/i.test(iLower)) {
    return 'Kinh Doanh Tổng Hợp';
  }
  
  // Chưa Phân Loại
  if (/chưa\s*phân\s*loại|chưa\s*điền|chưa\s*rõ|tổng\s*quát|khác/i.test(iLower)) {
    return 'Chưa Phân Loại';
  }
  
  // Fallback
  return 'Chưa Phân Loại';
}

// ========================== MAIN EXECUTION ==========================

console.log('📦 Đọc students.json...');
const students = JSON.parse(fs.readFileSync(STUDENTS_PATH, 'utf8'));
console.log(`   Tổng: ${students.length} học viên`);

// Audit trước
const classesBefore = new Set(students.map(s => s.class).filter(Boolean));
const industriesBefore = new Set(students.map(s => s.industry).filter(Boolean));
console.log(`   Trước: ${classesBefore.size} lớp, ${industriesBefore.size} ngành nghề`);

// Normalize
let classChanges = 0;
let industryChanges = 0;

students.forEach(s => {
  // Normalize class
  const origClass = s.class;
  const { normalized: newClass, crmStatus } = normalizeClass(origClass);
  if (origClass && newClass !== origClass) {
    // Save original to notes
    const notePrefix = `[Lớp gốc: ${origClass}]`;
    if (!s.notes || !s.notes.includes(notePrefix)) {
      s.notes = s.notes ? `${notePrefix}\n${s.notes}` : notePrefix;
    }
    s.class = newClass;
    classChanges++;
  }
  
  // Normalize industry
  const origIndustry = s.industry;
  const newIndustry = normalizeIndustry(origIndustry);
  if (origIndustry && newIndustry !== origIndustry) {
    // Save original to notes
    const notePrefix = `[Ngành gốc: ${origIndustry}]`;
    if (!s.notes || !s.notes.includes(notePrefix)) {
      s.notes = s.notes ? `${notePrefix}\n${s.notes}` : notePrefix;
    }
    s.industry = newIndustry;
    industryChanges++;
  }
});

// Audit sau
const classesAfter = new Set(students.map(s => s.class).filter(Boolean));
const industriesAfter = new Set(students.map(s => s.industry).filter(Boolean));

console.log(`\n✅ Chuẩn hóa xong:`);
console.log(`   Lớp: ${classesBefore.size} → ${classesAfter.size} (${classChanges} bản ghi đã sửa)`);
console.log(`   Ngành: ${industriesBefore.size} → ${industriesAfter.size} (${industryChanges} bản ghi đã sửa)`);
console.log(`\n   Lớp sau chuẩn hóa:`, [...classesAfter].sort());
console.log(`   Ngành sau chuẩn hóa:`, [...industriesAfter].sort());

// Ghi students.json
fs.writeFileSync(STUDENTS_PATH, JSON.stringify(students, null, 2), 'utf8');
console.log(`\n💾 Đã ghi students.json`);

// ========================== INJECT INTO HTML ==========================

function injectIntoHTML(htmlPath) {
  console.log(`\n🔧 Inject vào ${path.basename(htmlPath)}...`);
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Minify students for HTML embedding (single line)
  const studentsOneLine = JSON.stringify(students);
  
  // Replace INITIAL_STUDENTS
  const initRegex = /const INITIAL_STUDENTS = \[.*?\];/s;
  if (initRegex.test(html)) {
    html = html.replace(initRegex, `const INITIAL_STUDENTS = ${studentsOneLine};`);
    console.log(`   ✅ Đã thay thế INITIAL_STUDENTS`);
  } else {
    console.log(`   ⚠️ Không tìm thấy INITIAL_STUDENTS pattern`);
  }
  
  // Bump localStorage version v7 → v8
  if (html.includes("fedu_students_data_v7")) {
    html = html.replace(/fedu_students_data_v7/g, 'fedu_students_data_v8');
    console.log(`   ✅ Bump localStorage key v7 → v8`);
  }
  
  // Fix loadStudents merge logic: force class/industry from INITIAL_STUDENTS
  // Find the merge pattern and ensure class/industry are forced from initS
  const mergePatterns = [
    // Pattern: ...localS, (without forcing class/industry)
    /(\.\.\.(localS|local))\s*,?\s*\n?\s*(class:\s*initS\.class,)?\s*(industry:\s*initS\.industry,?)?/g
  ];
  
  // More targeted: find the loadStudents merge block
  const loadStudentsRegex = /(currentStudents\s*=\s*INITIAL_STUDENTS\.map\(initS\s*=>\s*\{[\s\S]*?const\s*localS[\s\S]*?return\s*\{)([\s\S]*?)(\}[\s\S]*?\}[\s\S]*?\))/;
  const loadMatch = html.match(loadStudentsRegex);
  if (loadMatch) {
    const mergeBlock = loadMatch[2];
    // Check if class/industry are already forced
    if (!mergeBlock.includes('class: initS.class')) {
      // Replace spread to include force overrides
      const newMerge = mergeBlock.replace(
        /\.\.\.localS,?\s*/,
        '...localS, class: initS.class, industry: initS.industry, '
      );
      html = html.replace(loadMatch[0], loadMatch[1] + newMerge + loadMatch[3]);
      console.log(`   ✅ Force class/industry from INITIAL_STUDENTS in merge logic`);
    } else {
      console.log(`   ℹ️ class/industry already forced from initS`);
    }
  }
  
  fs.writeFileSync(htmlPath, html, 'utf8');
  const sizeKB = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(0);
  console.log(`   💾 Đã ghi (${sizeKB} KB)`);
}

injectIntoHTML(INDEX_PATH);
injectIntoHTML(HOCVIEN_PATH);

console.log('\n🎉 HOÀN TẤT! Deploy lên stu.fedu.vn để áp dụng.');
