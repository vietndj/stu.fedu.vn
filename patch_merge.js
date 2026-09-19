const fs = require('fs');

function patchMergeLogic(filename) {
    if (!fs.existsSync(filename)) return;
    let html = fs.readFileSync(filename, 'utf8');
    
    // Replace:
    // ...localS,
    // notes: (localS.notes && localS.notes.trim().length > 0) ? localS.notes : (initS.notes || ''),
    // industry: localS.industry || initS.industry,
    
    html = html.replace(/\.\.\.localS,/g, '...localS,\n              class: initS.class, // Force server normalized class\n              industry: initS.industry, // Force server normalized industry');
    
    fs.writeFileSync(filename, html);
    console.log('Patched ' + filename);
}

patchMergeLogic('index.html');
patchMergeLogic('hocvien.html');
