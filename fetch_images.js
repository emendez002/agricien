const https = require('https');
const fs = require('fs');

const urls = [
  'https://www.maherelectronica.com/riego-convencional/programador-riego-inteligente/',
  'https://www.maherelectronica.com/riego-hidroponico-y-fertirrigacion/programador-agricola-ferti-8000/',
  'https://www.maherelectronica.com/accesorios-para-programador/transmisor-sondas-maher-trm04/'
];

let results = {};
let pending = urls.length;

urls.forEach(u => {
  https.get(u, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      const matches = data.match(/<img[^>]+src=\"(https:\/\/www\.maherelectronica\.com\/wp-content\/uploads\/[^\"]+)\"/g);
      if (matches) {
        let links = [...new Set(matches.map(m => m.match(/src=\"([^\"]+)\"/)[1]))]
          .filter(l => !l.toLowerCase().includes('logo') && !l.toLowerCase().includes('icon'))
          .slice(0, 3); // Get first 3 images that aren't logos
        
        results[u] = links;
      }
      
      pending--;
      if (pending === 0) {
        fs.writeFileSync('c:/Users/XSF/.gemini/antigravity/agricien/extracted_img.json', JSON.stringify(results, null, 2), 'utf8');
        console.log('Images extracted successfully.');
      }
    });
  });
});
