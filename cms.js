// Backend Mock Engine usando LocalStorage
const defaultDB = {
    users: [
        { email: 'edgarmendezduran@gmail.com', password: 'admin', role: 'admin' },
        { email: 'aguero.jose@gmail.com', password: 'editor', role: 'editor' }
    ],
    pages: {} // pageName -> { order: ['id1', 'id2'], hidden: ['id1'] }
};

if (!localStorage.getItem('agricienCMS')) {
    localStorage.setItem('agricienCMS', JSON.stringify(defaultDB));
}

function getDB() { return JSON.parse(localStorage.getItem('agricienCMS')); }
function saveDB(db) { localStorage.setItem('agricienCMS', JSON.stringify(db)); }
function getSession() { 
    let s = localStorage.getItem('agricienSession');
    return s ? JSON.parse(s) : null; 
}
function loginUser(email, password) {
    const db = getDB();
    const user = db.users.find(u => u.email === email && u.password === password);
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
    const db = getDB();
    if(!db.users.find(u => u.email === email)) {
        db.users.push({ email, password, role: 'editor' });
        saveDB(db);
        return true;
    }
    return false;
}
function getUsers() {
    return getDB().users.filter(u => u.role === 'editor');
}

// Inicialización CMS en Cliente
document.addEventListener('DOMContentLoaded', () => {
    const session = getSession();
    const isEditing = session !== null; // admin o editor
    const pageId = window.location.pathname.split('/').pop().replace('.html', '') || 'index';

    // Ocultar enlace de Login si ya está logeado (en footer)
    const loginLinks = document.querySelectorAll('.cms-login-link');
    if (isEditing) {
        loginLinks.forEach(l => {
            l.textContent = 'Cerrar Sesión (' + session.role + ')';
            l.href = '#';
            l.addEventListener('click', (e) => {
                e.preventDefault();
                logoutUser();
                location.reload();
            });
        });
    }

    const grids = document.querySelectorAll('.grid3, .servicesGrid, .grid');
    if (!grids.length) return; // No hay grid en esta página
    
    // Asumiremos el primer grid relevante
    const grid = grids[0];
    const db = getDB();
    const pageConfig = db.pages[pageId] || { order: [], hidden: [] };
    
    // Obtener todas las tarjetas y asegurar que tienen ID
    let cards = Array.from(grid.querySelectorAll('article.card'));
    cards.forEach((c, idx) => {
        if (!c.id) {
            let title = c.querySelector('h2, h3, h4');
            if (title) {
                c.id = 'crd_' + title.textContent.trim().toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 15);
            } else {
                c.id = 'crd_' + idx;
            }
        }
    });

    // 1. REORDENAR Y OCULTAR DOM ANTES DE MOSTRAR (VISIÓN PÚBLICA)
    if (pageConfig.order && pageConfig.order.length > 0) {
        pageConfig.order.forEach(id => {
            const el = document.getElementById(id);
            if (el) grid.appendChild(el); // Re-agrega al final en el orden correcto
        });
    }

    if (!isEditing) {
        // Vista anónima: ocultar tarjetas
        cards.forEach(c => {
            if(pageConfig.hidden && pageConfig.hidden.includes(c.id)) {
                c.style.display = 'none';
            }
        });
    } else {
        // Vista Editor: Inyectar estilos para el modo edición
        const style = document.createElement('style');
        style.innerHTML = `
            .cms-edit-wrap { position: relative; border: 2px dashed rgba(255,255,255,0.2) !important; padding-top: 40px !important; transition: all 0.2s;}
            .cms-edit-wrap.hidden-card { opacity: 0.4; }
            .cms-controls { position: absolute; top: 0; left: 0; width: 100%; height: 40px; background: rgba(0,0,0,0.8); display: flex; align-items:center; justify-content:space-between; padding: 0 10px; z-index: 10; cursor: grab;}
            .cms-controls:active { cursor: grabbing; }
            .cms-btn { background:#333; border:1px solid #555; color:white; padding:4px 10px; font-size:12px; border-radius:4px; cursor:pointer;}
            .cms-btn:hover { background:#555;}
            .cms-label { font-size: 11px; color: #ccc; text-transform:uppercase; pointer-events:none;}
        `;
        document.head.appendChild(style);

        // Añadir controles a cada tarjeta
        cards.forEach(c => {
            c.classList.add('cms-edit-wrap');
            c.draggable = true;
            
            const isHid = pageConfig.hidden.includes(c.id);
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

            // Drag and Drop Lógica
            c.addEventListener('dragstart', (e) => {
                c.classList.add('dragging');
                e.dataTransfer.setData('text/plain', c.id);
            });
            c.addEventListener('dragend', () => {
                c.classList.remove('dragging');
                saveCardState();
            });
        });

        grid.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(grid, e.clientY);
            const draggable = document.querySelector('.dragging');
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
        const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];
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
        const newDb = getDB();
        const currentCards = Array.from(grid.querySelectorAll('article.card'));
        
        const currentOrder = currentCards.map(c => c.id);
        const currentHidden = currentCards.filter(c => c.classList.contains('hidden-card')).map(c => c.id);
        
        newDb.pages[pageId] = { order: currentOrder, hidden: currentHidden };
        saveDB(newDb);
    }
});
