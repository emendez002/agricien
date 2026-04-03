const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'admin.html');

let modified = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let changed = false;
    // 1. Inject cms.js
    if (!content.includes('src="cms.js"')) {
        content = content.replace('</head>', '  <!-- CMS Engine -->\n  <script src="cms.js"></script>\n</head>');
        changed = true;
    }
    
    // 2. Inject Admin Footer Login Node
    if (!content.includes('href="admin.html"')) {
        const footLinkTarget = 'class="footLinks" aria-label="Enlaces">';
        if (content.includes(footLinkTarget)) {
            content = content.replace(
                footLinkTarget, 
                footLinkTarget + '\n            <a href="admin.html" class="cms-login-link" style="margin-left:auto; color:rgba(255,255,255,0.4);">Acceso Panel</a>'
            );
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        modified++;
    }
});

console.log('Modified ' + modified + ' HTML files successfully.');
