const fs = require('fs');

const dataPath = 'students.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Helper to convert to kebab-case
function toKebabCase(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

// 8 Master Groups
const MASTER_GROUPS = {
  REAL_ESTATE: 'Bất Động Sản',
  FNB: 'F&B & Ẩm Thực',
  EDUCATION: 'Giáo Dục & Đào Tạo',
  HEALTH_BEAUTY: 'Sức Khỏe & Làm Đẹp',
  RETAIL: 'Bán Lẻ & Thương Mại',
  SERVICES: 'Dịch Vụ Chuyên Gia',
  CREATIVE: 'Sáng Tạo & Truyền Thông',
  OTHER: 'Khác / Chưa Rõ'
};

function mapIndustry(ind) {
  if (!ind) return MASTER_GROUPS.OTHER;
  const l = ind.toLowerCase();
  
  // 1. Bất Động Sản
  if (l.includes('bất động sản') || l.includes('bđs')) return MASTER_GROUPS.REAL_ESTATE;
  
  // 2. F&B & Ẩm Thực
  if (l.includes('f&b') || l.includes('nhà hàng') || l.includes('bánh') || l.includes('trà') || l.includes('kombucha') || l.includes('đồ uống') || l.includes('ẩm thực') || l.includes('thực phẩm chay')) return MASTER_GROUPS.FNB;
  
  // 3. Giáo Dục & Đào Tạo
  if (l.includes('giáo dục') || l.includes('đào tạo') || l.includes('giáo viên') || l.includes('giảng viên')) return MASTER_GROUPS.EDUCATION;
  
  // 4. Sức Khỏe & Làm Đẹp
  if (l.includes('beauty') || l.includes('sức khỏe') || l.includes('dược') || l.includes('gym') || l.includes('thẩm mỹ') || l.includes('tóc') || l.includes('spa') || l.includes('dưỡng sinh') || l.includes('fitness') || l.includes('làm đẹp') || l.includes('da liễu') || l.includes('mỹ phẩm') || l.includes('clinic') || l.includes('tattoo') || l.includes('y tế') || l.includes('dinh dưỡng')) return MASTER_GROUPS.HEALTH_BEAUTY;
  
  // 5. Bán Lẻ & Thương Mại
  if (l.includes('bán lẻ') || l.includes('gia dụng') || l.includes('thương mại') || l.includes('thời trang') || l.includes('nội thất') || l.includes('decor') || l.includes('vật liệu xây dựng') || l.includes('xe máy') || l.includes('cơ khí') || l.includes('nông nghiệp') || l.includes('phân bón') || l.includes('kính mắt') || l.includes('thiết bị điện') || l.includes('năng lượng') || l.includes('sơn') || l.includes('ngũ cốc') || l.includes('hạt cườm') || l.includes('công nghệ') || l.includes('iphone')) return MASTER_GROUPS.RETAIL;
  
  // 6. Dịch Vụ Chuyên Gia
  if (l.includes('luật sư') || l.includes('coach') || l.includes('diễn giả') || l.includes('tài chính') || l.includes('chủ doanh nghiệp') || l.includes('quản lý') || l.includes('pháp lý') || l.includes('bảo hiểm') || l.includes('forex')) return MASTER_GROUPS.SERVICES;
  
  // 7. Sáng Tạo & Truyền Thông
  if (l.includes('sáng tạo') || l.includes('truyền thông') || l.includes('content') || l.includes('video') || l.includes('thiết kế') || l.includes('đồ họa') || l.includes('marketing') || l.includes('nhà báo') || l.includes('chụp ảnh') || l.includes('makeup') || l.includes('kênh')) return MASTER_GROUPS.CREATIVE;
  
  return MASTER_GROUPS.OTHER;
}

let industryChanged = 0;
let classChanged = 0;

data.forEach(s => {
  // --- INDUSTRY NORMALIZATION ---
  const origInd = s.industry;
  const newInd = mapIndustry(origInd);
  
  if (origInd && origInd !== newInd) {
    s.industry = newInd;
    s.industry_slug = toKebabCase(newInd);
    
    if (!s.notes) s.notes = "";
    if (!s.notes.includes(`[Ngành gốc: ${origInd}]`)) {
      s.notes = `[Ngành gốc: ${origInd}]\n` + s.notes;
    }
    industryChanged++;
  } else if (!origInd) {
    s.industry = MASTER_GROUPS.OTHER;
    s.industry_slug = 'khac-chua-ro';
  }

  // --- CLASS NORMALIZATION ---
  if (s.class) {
    const origClass = s.class;
    let newClass = origClass;
    
    if (origClass.toLowerCase().includes('skool')) {
      newClass = 'Khóa Online Skool';
    } else if (origClass === 'Khóa Video Marketing - NDV') {
      newClass = 'Khóa Video Marketing';
    }
    
    if (newClass !== origClass) {
      s.class = newClass;
      classChanged++;
    }
  }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`Successfully normalized ${industryChanged} industries and ${classChanged} classes.`);
