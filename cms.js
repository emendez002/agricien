// Backend Engine usando Google Forms + Sheets como Base de Datos
// La configuración de diseño es Global (Pública)
// Los usuarios (Editores) se mantienen en LocalStorage por seguridad.

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1_ZeKkYOt3FojkzphdqstRz8UcgvsV8XvmOKCnb3zRpU/export?format=csv';
const FORM_POST_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdR3WL2SCxmFL2fKIr-YSJvzjsZDrPD4WIUePw-xo8TcsiJTA/formResponse';
const FORM_ENTRY_ID = 'entry.13807278';

const defaultUsers = [
    { email: 'edgarmendezduran@gmail.com', password: 'admin', role: 'admin' },
    { email: 'aguero.jose@gmail.com', password: 'editor', role: 'editor' },
    { email: 'edgar@geociencias.net', password: 'admin', role: 'editor' }
];

if (!localStorage.getItem('agricienCMSUsers')) {
    localStorage.setItem('agricienCMSUsers', JSON.stringify(defaultUsers));
}

// Para evitar parpadeos "Stale-while-Revalidate"
function getLocalConfig() {
    let raw = localStorage.getItem('agricienCMSGlobal');
    return raw ? JSON.parse(raw) : { pages: {} };
}
function setLocalConfig(cb) {
    localStorage.setItem('agricienCMSGlobal', JSON.stringify(cb));
}

// Parseador nativo de CSV para Sheets (extraer última fila de JSON)
function parseCSVLastJSON(csv) {
    if(!csv || !csv.includes(',')) return null;
    let records = csv.split('\n');
    let lastRow = records[records.length - 1].trim();
    if (lastRow === '') lastRow = records[records.length - 2]?.trim();
    if (!lastRow) return null;
    
    // Busca donde empieza el JSON
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

// Funciones de Usuario
function getUsersDB() { return JSON.parse(localStorage.getItem('agricienCMSUsers')); }
function getSession() { 
    let s = localStorage.getItem('agricienSession');
    return s ? JSON.parse(s) : null; 
}
function loginUser(email, password) {
    const users = getUsersDB();
    const user = users.find(u => u.email === email && u.password === password);
    if(user) {
        localStorage.setItem('agricienSession', JSON.stringify({ email: user.email, role: user.role }));
        return true;
    }
    return false;
}
function logoutUser() { localStorage.removeItem('agricienSession'); }
function addEditor(email, password) {
    const session = getSession();
    if(session?.role !== 'admin') return false;
    const users = getUsersDB();
    if(!users.find(u => u.email === email)) {
        users.push({ email, password, role: 'editor' });
        localStorage.setItem('agricienCMSUsers', JSON.stringify(users));
        return true;
    }
    return false;
}
function getUsers() { return getUsersDB().filter(u => u.role === 'editor'); }

let globalCMSDb = getLocalConfig(); // Estado en memoria (Rápido)

function sendUpdateToGoogle(newPagesConfig) {
    const formData = new URLSearchParams();
    formData.append(FORM_ENTRY_ID, JSON.stringify(newPagesConfig));
    
    fetch(FORM_POST_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    }).catch(e => console.error("Error guardando en Google Forms:", e));
}

// Lógica de CMS / UI
function initCMS() {
    const session = getSession();
    const isEditing = session !== null;
    const pageId = window.location.pathname.split('/').pop().replace('.html', '') || 'index';

    // Manejar Navbars de estado
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
    
    // Obtener la data Remota si no somos editores directos (para garantizar la verdad absoluta)
    fetch(SHEET_CSV_URL, { cache: "no-store" })
      .then(r => r.text())
      .then(csvText => {
          const remoteJson = parseCSVLastJSON(csvText);
          if(remoteJson && remoteJson.pages) {
              globalCMSDb = remoteJson; // Tomar remoto como la verdad absoluta
              setLocalConfig(globalCMSDb); // Caché local para siguiente reload
              applyCMSConfig(globalCMSDb, grid, pageId, isEditing);
          } else {
              applyCMSConfig(globalCMSDb, grid, pageId, isEditing);
          }
      }).catch(err => {
          console.warn("No se pudo cargar la DB Remota de Google. Usando estado local.", err);
          applyCMSConfig(globalCMSDb, grid, pageId, isEditing);
      });
      
    // Por ser SPA/státicos, aplicamos *inmediatamente* la caché local para no causar "saltos" en la pantalla
    applyCMSConfig(globalCMSDb, grid, pageId, isEditing);
}

function applyCMSConfig(db, grid, pageId, isEditing) {
    const pageConfig = db.pages[pageId] || { order: [], hidden: [] };
    
    let cards = Array.from(grid.querySelectorAll('article.card'));
    
    // Garantizar que todos tengan IDs sólidos
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

    // 1. REORDENAR Y OCULTAR DOM (MÁSCARA)
    if (pageConfig.order && pageConfig.order.length > 0) {
        pageConfig.order.forEach(id => {
            const el = document.getElementById(id);
            if (el) grid.appendChild(el); 
        });
    }

    cards.forEach(c => {
        // Limpiamos residuales
        c.style.display = '';
        const existingCtrl = c.querySelector('.cms-controls');
        if(existingCtrl) existingCtrl.remove();
        c.classList.remove('cms-edit-wrap', 'hidden-card');
        c.draggable = false;
        
        // Anti-ghosting event listeners
        const clone = c.cloneNode(true);
        c.replaceWith(clone);
    });

    cards = Array.from(grid.querySelectorAll('article.card'));

    if (!isEditing) {
        // MODO ANÓNIMO
        cards.forEach(c => {
            if(pageConfig.hidden && pageConfig.hidden.includes(c.id)) {
                c.style.display = 'none';
            }
        });
    } else {
        // MODO EDITOR
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

            // Drag
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
            
            // 1. Instantly feedback in the client cache
            setLocalConfig(globalCMSDb);
            
            // 2. Publish to Google Database (Global)
            sendUpdateToGoogle(globalCMSDb);
            
        }, 50);
    }
}

// BFCache Protection
window.addEventListener('pageshow', (e) => {
    initCMS();
});
