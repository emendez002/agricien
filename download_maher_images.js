const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'images', 'maher');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const downloads = [
  { url: "https://www.maherelectronica.com/wp-content/uploads/2018/11/cicln-1-600x600.jpg", name: "ciclon-1.jpg" },
  { url: "https://www.maherelectronica.com/wp-content/uploads/2018/11/cicln-3-600x600.jpg", name: "ciclon-2.jpg" },
  { url: "https://www.maherelectronica.com/wp-content/uploads/2018/11/armario-ciclon-600x600.jpg", name: "armario-ciclon.jpg" },
  { url: "https://www.maherelectronica.com/wp-content/uploads/2018/11/ferti-8000-3-600x600.jpg", name: "ferti-1.jpg" },
  { url: "https://www.maherelectronica.com/wp-content/uploads/2018/11/ferti-8000-4-600x600.jpg", name: "ferti-2.jpg" },
  { url: "https://www.maherelectronica.com/wp-content/uploads/2019/02/3-arriba-1-e1623916385609-600x527.png", name: "trm04-1.png" },
  { url: "https://www.maherelectronica.com/wp-content/uploads/2019/02/8-caja-cerradda-600x399.png", name: "trm04-2.png" }
];

let pending = downloads.length;

// Using specific headers to bypass basic hotlink protection
const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Referer': 'https://www.maherelectronica.com/riego-convencional/programador-riego-inteligente/',
    'Accept': 'image/avif,image/webp,*/*'
  }
};

downloads.forEach(d => {
  https.get(d.url, options, (res) => {
    if (res.statusCode !== 200) {
      console.log('Error downloading ' + d.name + ' Status: ' + res.statusCode);
    }
    const file = fs.createWriteStream(path.join(dir, d.name));
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded ' + d.name);
      pending--;
      if (pending === 0) console.log('All downloads finished.');
    });
  }).on('error', err => {
    console.error('Error with ' + d.name, err);
  });
});
