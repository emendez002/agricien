const fs = require('fs');
const path = require('path');

const dir = process.cwd();
const falkerDir = path.join(dir, 'Falker', 'www.falker.com.br', 'es');

const productFiles = [
  'clorofilog.html', 'falkermap.html', 'fieldbox.html', 'flexum.html', 
  'hidrofarm.html', 'kit_ap.html', 'penetrolog.html', 'solodrill.html', 
  'soloflux.html', 'solostar.html', 'terram.html'
];

let productsHtml = '';

productFiles.forEach(file => {
  const filePath = path.join(falkerDir, file);
  if (!fs.existsSync(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Extract name from Title "Falker - penetroLOG - Penetrómetro..."
  let name = file.replace('.html', '').toUpperCase();
  const titleMatch = content.match(/<title>Falker\s*-\s*(.*?)\s*-/i);
  if (titleMatch && titleMatch[1]) {
    name = titleMatch[1].trim();
  }
  
  // 2. Extract description from meta tag
  let desc = 'Solución tecnológica Falker.';
  const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  if (descMatch && descMatch[1]) {
    desc = descMatch[1].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  }
  
  // 3. Extract image (look for src="../images/products/... " or background-image)
  let imgSrc = '';
  // match background-image: url('../images/products/penetrolog/bg-top-es.webp');
  const bgMatch = content.match(/url\(['"]?\.\.\/(images\/products\/[^'"]+)['"]?\)/i);
  if (bgMatch && bgMatch[1]) {
    imgSrc = `Falker/www.falker.com.br/${bgMatch[1]}`;
  } else {
    // try img src
    const imgMatch = content.match(/src=["']\.\.\/(images\/products\/[^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
      imgSrc = `Falker/www.falker.com.br/${imgMatch[1]}`;
    }
  }

  // Build card HTML
  productsHtml += `
          <article class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              ${imgSrc ? `<div style="height:180px; margin:-18px -18px 18px -18px; overflow:hidden; border-radius: 20px 20px 0 0; background:rgba(0,0,0,.2); display:flex; align-items:center; justify-content:center;">
                <img src="${imgSrc}" style="width:100%; height:100%; object-fit:cover;" alt="${name}">
              </div>` : ''}
              <h3 style="color: var(--brand2);">${name}</h3>
              <p style="font-size:13px; margin-bottom:14px;">${desc}</p>
            </div>
            <div><a href="#contacto" class="btn primary" style="width:100%;">Cotizar Equipo</a></div>
          </article>
`;
});

// Update productos-falker.html exactly where the grid is
const targetFile = path.join(dir, 'productos-falker.html');
let pageHtml = fs.readFileSync(targetFile, 'utf8');

// Replace everything inside <div class="grid3"> ... </div> in the detalles section
const gridStartStr = '<div class="grid3">';
const sectionEndStr = '</div>\n      </div>\n    </section>';

const startIndex = pageHtml.indexOf(gridStartStr);
const endIndex = pageHtml.indexOf(sectionEndStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const newHtml = pageHtml.substring(0, startIndex + gridStartStr.length) + '\n' + productsHtml + '\n        ' + pageHtml.substring(endIndex);
  fs.writeFileSync(targetFile, newHtml);
  console.log('Falker page updated with dynamic folder data.');
} else {
  console.log('Could not find grid string to replace.');
}
