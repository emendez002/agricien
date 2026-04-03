const https = require('https');
const fs = require('fs');
const path = require('path');

const urlsAndPrefixes = [
  { url: 'https://www.maherelectronica.com/riego-hidroponico-y-fertirrigacion/equipos-fertirrigacion/', prefix: 'bancadas' },
  { url: 'https://www.maherelectronica.com/monitorizacion-sensores/sensores-agricultura-precision/', prefix: 'sensors' },
  { url: 'https://www.maherelectronica.com/control-de-distancia/control-remoto-programadores-riego/', prefix: 'app' },
  { url: 'https://www.maherelectronica.com/accesorios-para-programador/ampliacion-de-entradas-analogicas/', prefix: 'componentes' }
];

const dir = path.join(__dirname, 'images', 'maher');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

let pendingUrls = urlsAndPrefixes.length;
let downloads = [];

function startDownloads() {
  let pendingDownloads = downloads.length;
  if(pendingDownloads === 0) { console.log('No images found.'); return; }
  
  downloads.forEach(d => {
    https.get(d.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://www.maherelectronica.com/',
        'Accept': 'image/avif,image/webp,*/*'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        console.log('Error ' + res.statusCode + ' downloading ' + d.name);
      } else {
        const file = fs.createWriteStream(path.join(dir, d.name));
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('Downloaded ' + d.name + ' from ' + d.url);
          pendingDownloads--;
          if (pendingDownloads === 0) {
            console.log('All downloads finished! Check images/maher/');
          }
        });
      }
    }).on('error', err => {
      console.error('Error with ' + d.name, err);
    });
  });
}

urlsAndPrefixes.forEach(item => {
  https.get(item.url, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      const matches = data.match(/<img[^>]+src=\"(https:\/\/www\.maherelectronica\.com\/wp-content\/uploads\/[^\"]+)\"/g);
      if (matches) {
        let links = [...new Set(matches.map(m => m.match(/src=\"([^\"]+)\"/)[1]))]
          .filter(l => !l.toLowerCase().includes('logo') && !l.toLowerCase().includes('icon'))
          .slice(0, 2); // Get first 2 images
        
        links.forEach((link, idx) => {
          // get extension
          let ext = link.substring(link.lastIndexOf('.'));
          if (ext.indexOf('?') > -1) ext = ext.substring(0, ext.indexOf('?'));
          
          downloads.push({
            url: link,
            name: `${item.prefix}-${idx+1}${ext}`
          });
        });
      }
      
      pendingUrls--;
      if (pendingUrls === 0) {
         startDownloads();
      }
    });
  });
});
