// Backend Engine usando Google Forms + Sheets como Base de Datos Serverless
// La configuración de diseño es Global (Pública)
// Los usuarios se consultan en el Sheet respectivo y en LocalStorage auxiliar.

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1_ZeKkYOt3FojkzphdqstRz8UcgvsV8XvmOKCnb3zRpU/export?format=csv';
const FORM_POST_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdR3WL2SCxmFL2fKIr-YSJvzjsZDrPD4WIUePw-xo8TcsiJTA/formResponse';
const FORM_ENTRY_ID = 'entry.13807278';

const USERS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1t3aJFZtFUl8EcgWi8brqCzgpLUjUfPpTLfRCjuK1g-w/export?format=csv';
const USERS_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeTI3wUNzx0bVHDgwe9MtfSstDY0LgBD1rUcKFvcesCteERAg/formResponse';
const USERS_EMAIL_ENTRY = 'entry.137980382';
const USERS_ROLE_ENTRY = 'entry.1166896746';

// Para evitar parpadeos "Stale-while-Revalidate"
function getLocalConfig() {
    let raw = localStorage.getItem('agricienCMSGlobal');
    return raw ? JSON.parse(raw) : { pages: {} };
}
function setLocalConfig(cb) {
    localStorage.setItem('agricienCMSGlobal', JSON.stringify(cb));
}

// Parseador nativo de CSV para Sheets configs
function parseCSVLastJSON(csv) {
    if(!csv || !csv.includes(',')) return null;
    let records = csv.split('\n');
    let lastRow = records[records.length - 1].trim();
    if (lastRow === '') lastRow = records[records.length - 2]?.trim();
    if (!lastRow) return null;
    
    let jsonStart = lastRow.indexOf(',"');
    if (jsonStart === -1) {
        jsonStart = lastRow.indexOf(',{');
        if(jsonStart === -1) return null;
        try { return JSON.parse(lastRow.substring(jsonStart + 1)); } catch(e) { return null; }
    }
    
    let jsonStr = lastRow.substring(jsonStart + 2, lastRow.length - 1);
    jsonStr = jsonStr.replace(/""/g, '"');
    
    try {
        return JSON.parse(jsonStr);
    } catch(e) {
        console.error('Error parseando DB remota:', e);
        return null;
    }
}

// Envío a Google Forms hiper robusto (Iframe anti-CORS y anti-Bloqueadores)
function submitToGoogleForms(url, data) {
    const iframeId = 'gform_' + Math.floor(Math.random()*10000);
    const iframe = document.createElement('iframe');
    iframe.name = iframeId;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = iframeId;
    
    for (let key in data) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
    }
    
    document.body.appendChild(form);
    form.submit();
    
    setTimeout(() => {
        form.remove();
        iframe.remove();
    }, 3500);
}

// ========== FUNCIONES DE USUARIO ASINCRONAS ==========
function getSession() { 
    let s = localStorage.getItem('agricienSession');
    return s ? JSON.parse(s) : null; 
}
function logoutUser() { localStorage.removeItem('agricienSession'); }

// Fallback de usuarios creados recientemente que aún no han bajado desde el Sheet de Google
function getLocalUsersDB() {
    let raw = localStorage.getItem('agricienCMSUsersLocalDB');
    return raw ? JSON.parse(raw) : [];
}

async function loginUser(email, password) {
    email = email.trim();
    password = password.trim();
    
    // Admin maestro por seguridad de fallo de red
    if(email === 'edgarmendezduran@gmail.com' && password === 'admin') {
        localStorage.setItem('agricienSession', JSON.stringify({ email, role: 'admin' }));
        return true;
    }
    
    // Auth: intentar en Google y Local
    let foundRole = null;
    
    const localUsers = getLocalUsersDB();
    const lUser = localUsers.find(u => u.email === email);
    if (lUser) {
        foundRole = lUser.role;
    }
    
    if (!foundRole) {
        try {
            const res = await fetch(USERS_CSV_URL, { cache: "no-store" });
            const csv = await res.text();
            const records = csv.split('\n');
            
            // csv formato: Marca temporal,usuario,rol
            for (let i = 1; i < records.length; i++) {
                let cols = records[i].split(',');
                if(cols.length >= 3) {
                    let uEmail = cols[1].trim();
                    let uRole = cols[2].trim().toLowerCase();
                    if (uEmail === email) {
                        foundRole = uRole; break;
                    }
                }
            }
        } catch(e) {
            console.error("No se pudo validar desde Google, fall back temporal", e);
        }
    }
    
    if (foundRole) {
        // Contraseña por defecto basada en el rol (temporal al no tener contraseñas seguras en el Sheet)
        if(password === foundRole || password === 'editor' || password === 'admin') {
            localStorage.setItem('agricienSession', JSON.stringify({ email: email, role: foundRole }));
            return true;
        }
    }

    return false;
}

async function addEditor(email, password) {
    const session = getSession();
    if(session?.role !== 'admin') return false;
    
    // Verificamos si existe antes de subirlo
    const users = await getUsers();
    if(!users.find(u => u.email === email)) {
        
        // Guardado local de emergencia (asegurando el login)
        const localDB = getLocalUsersDB();
        localDB.push({ email: email, role: 'editor' });
        localStorage.setItem('agricienCMSUsersLocalDB', JSON.stringify(localDB));
        
        // Envío asíncrono robusto
        let formData = {};
        formData[USERS_EMAIL_ENTRY] = email;
        formData[USERS_ROLE_ENTRY] = 'editor';
        submitToGoogleForms(USERS_FORM_URL, formData);
        
        return true;
    }
    return false;
}

async function getUsers() {
    let users = [];
    try {
        const res = await fetch(USERS_CSV_URL, { cache: "no-store" });
        const csv = await res.text();
        const records = csv.split('\n');
        for (let i = 1; i < records.length; i++) {
            let cols = records[i].split(',');
            if(cols.length >= 3) {
                let uEmail = cols[1].trim();
                let uRole = cols[2].trim();
                if(uEmail && uEmail !== "usuario") users.push({ email: uEmail, role: uRole });
            }
        }
    } catch(e) {}
    
    // Mezclar locales
    const localDB = getLocalUsersDB();
    localDB.forEach(l => {
        if(!users.find(u => u.email === l.email)) users.push(l);
    });
    
    return users;
}

// ========== MOTOR CMS ==========
let globalCMSDb = getLocalConfig();

function sendUpdateToGoogle(newPagesConfig) {
    let fields = {};
    fields[FORM_ENTRY_ID] = JSON.stringify(newPagesConfig);
    submitToGoogleForms(FORM_POST_URL, fields);
}

function initCMS() {
    const session = getSession();
    const isEditing = session !== null;
    const pageId = window.location.pathname.split('/').pop().replace('.html', '') || 'index';

    const loginLinks = document.querySelectorAll('.cms-login-link');
    if (isEditing) {
        loginLinks.forEach(l => {
            if(!l.hasAttribute('data-cms-bound')) {
                l.textContent = 'Cerrar Sesión (' + session.role + ')';
                l.href = '#';
                l.setAttribute('data-cms-bound', 'true');
                l.addEventListener('click', (e) => {
                    e.preventDefault();
                    logoutUser();
                    window.location.href = window.location.pathname + '?t=' + new Date().getTime();
                });
            }
        });
    }

    const grids = document.querySelectorAll('.grid3, .servicesGrid, .grid');
    if (!grids.length) return; 
    
    const grid = grids[0];
    
    fetch(SHEET_CSV_URL, { cache: "no-store" })
      .then(r => r.text())
      .then(csvText => {
          const remoteJson = parseCSVLastJSON(csvText);
          if(remoteJson && remoteJson.pages) {
              globalCMSDb = remoteJson;
              setLocalConfig(globalCMSDb); 
              applyCMSConfig(globalCMSDb, grid, pageId, isEditing);
          } else {
              applyCMSConfig(globalCMSDb, grid, pageId, isEditing);
          }
      }).catch(err => {
          console.warn("Fallo revalidación de Google Forms", err);
          applyCMSConfig(globalCMSDb, grid, pageId, isEditing);
      });
      
    applyCMSConfig(globalCMSDb, grid, pageId, isEditing);
}

function applyCMSConfig(db, grid, pageId, isEditing) {
    const pageConfig = db.pages[pageId] || { order: [], hidden: [] };
    let cards = Array.from(grid.querySelectorAll('article.card'));
    
    cards.forEach((c, idx) => {
        if (!c.id) {
            let title = c.querySelector('h2, h3, h4');
            if (title) {
                c.id = 'crd_' + title.textContent.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            } else {
                c.id = 'crd_gen_' + idx;
            }
        }
    });

    if (pageConfig.order && pageConfig.order.length > 0) {
        pageConfig.order.forEach(id => {
            const el = document.getElementById(id);
            if (el) grid.appendChild(el); 
        });
    }

    cards.forEach(c => {
        c.style.display = '';
        const existingCtrl = c.querySelector('.cms-controls');
        if(existingCtrl) existingCtrl.remove();
        c.classList.remove('cms-edit-wrap', 'hidden-card');
        c.draggable = false;
        
        const clone = c.cloneNode(true);
        c.replaceWith(clone);
    });

    cards = Array.from(grid.querySelectorAll('article.card'));

    if (!isEditing) {
        cards.forEach(c => {
            if(pageConfig.hidden && pageConfig.hidden.includes(c.id)) {
                c.style.display = 'none';
            }
        });
    } else {
        if(!document.getElementById('cms-styles')) {
            const style = document.createElement('style');
            style.id = 'cms-styles';
            style.innerHTML = `
                .cms-edit-wrap { position: relative; border: 2px dashed rgba(255,255,255,0.4) !important; padding-top: 40px !important; transition: all 0.2s;}
                .cms-edit-wrap.hidden-card { opacity: 0.3 !important; filter: grayscale(1); }
                .cms-controls { position: absolute; top: 0; left: 0; width: 100%; height: 40px; background: rgba(0,0,0,0.9); display: flex; align-items:center; justify-content:space-between; padding: 0 10px; z-index: 10; cursor: grab;}
                .cms-controls:active { cursor: grabbing; }
                .cms-btn { background:#333; border:1px solid #555; color:white; padding:4px 10px; font-size:12px; border-radius:4px; cursor:pointer;}
                .cms-btn:hover { background:#555;}
                .cms-label { font-size: 11px; color: #ccc; text-transform:uppercase; pointer-events:none;}
            `;
            document.head.appendChild(style);
        }

        cards.forEach(c => {
            c.classList.add('cms-edit-wrap');
            c.draggable = true;
            
            const isHid = pageConfig.hidden && pageConfig.hidden.includes(c.id);
            if(isHid) c.classList.add('hidden-card');

            const ctrl = document.createElement('div');
            ctrl.className = 'cms-controls';
            
            const lbl = document.createElement('span');
            lbl.className = 'cms-label';
            lbl.textContent = 'Arrastrar para ordenar';
            
            const toggle = document.createElement('button');
            toggle.className = 'cms-btn';
            toggle.textContent = isHid ? 'Mostrar' : 'Ocultar';
            
            toggle.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                let isNowHidden = c.classList.toggle('hidden-card');
                toggle.textContent = isNowHidden ? 'Mostrar' : 'Ocultar';
                saveCardState();
            };

            ctrl.appendChild(lbl);
            ctrl.appendChild(toggle);
            c.insertBefore(ctrl, c.firstChild);

            c.addEventListener('dragstart', (e) => {
                c.classList.add('dragging');
                if(e.dataTransfer) e.dataTransfer.setData('text/plain', c.id);
            });
            c.addEventListener('dragend', () => {
                c.classList.remove('dragging');
                saveCardState();
            });
        });

        grid.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(grid, e.clientY);
            const draggable = grid.querySelector('.dragging');
            if(draggable) {
                if (afterElement == null) {
                    grid.appendChild(draggable);
                } else {
                    grid.insertBefore(draggable, afterElement);
                }
            }
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('article.card:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function saveCardState() {
        setTimeout(() => {
            const currentCards = Array.from(grid.querySelectorAll('article.card'));
            const currentOrder = currentCards.map(c => c.id);
            const currentHidden = currentCards.filter(c => c.classList.contains('hidden-card')).map(c => c.id);
            
            if(!globalCMSDb.pages) globalCMSDb.pages = {};
            globalCMSDb.pages[pageId] = { order: currentOrder, hidden: currentHidden };
            
            setLocalConfig(globalCMSDb);
            sendUpdateToGoogle(globalCMSDb);
            
        }, 50);
    }
}

window.addEventListener('pageshow', (e) => {
    initCMS();
});
