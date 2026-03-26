const fs = require('fs');
const path = require('path');

const dir = process.cwd();
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// 1. Create productos-falker.html
const templateFile = path.join(dir, 'ganaderia-sostenible.html');
let template = fs.readFileSync(templateFile, 'utf8');

// The template has a specific hero and details section string.
// We'll extract the generic header and footer around the <main> content.
const baseHeader = template.substring(0, template.indexOf('<main id="inicio">') + '<main id="inicio">'.length);
let baseFooter = template.substring(template.indexOf('<!-- CONTACTO -->'));

// But we need to make sure the base header/footer has the new links.
// So let's update baseHeader and baseFooter first.
const newNavLink = `\n          <a href="productos-falker.html">Equipos Falker</a>\n          <a href="#contacto">Contacto</a>\n        </nav>`;
const newDrawerLink = `\n        <a href="productos-falker.html">Equipos Falker</a>\n        <a href="#contacto">Contacto</a>\n      </div>`;

const falkerHtml = `
    <section class="hero" style="padding: 60px 0 30px;">
      <div class="container">
        <div class="panel">
          <div class="panelInner" style="padding: 40px; background: rgba(0,0,0,.2);">
            <div class="kicker"><span class="dot" aria-hidden="true"></span>Comercialización de Equipos</div>
            <h1 style="margin-top:16px;">Venta de Equipos Falker</h1>
            <p class="lead" style="margin-top:12px; font-size:18px;">Soluciones tecnológicas de alta precisión para medir compactación, humedad y salud del suelo y cultivos. Distribuidor Oficial.</p>
            <div class="heroCtas" style="margin-top:24px;">
              <a class="btn primary" href="#contacto">Solicitar Cotización</a>
              <a class="btn" href="https://www.falker.com.br/es" target="_blank">Ver sitio oficial Falker</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="detalles">
      <div class="container">
        <div class="sectionHead">
          <div>
            <h2>Catálogo de Productos Destacados</h2>
            <p>Conocé las herramientas que transformarán tu precisión en campo.</p>
          </div>
        </div>
        <div class="grid3">
          <article class="card">
            <h3 style="color: var(--brand2);">penetroLOG</h3>
            <p>Medidor electrónico de compactación de perfil de suelo. Diagnóstico profundo y confiable.</p>
          </article>
          <article class="card">
            <h3 style="color: var(--brand2);">clorofiLOG</h3>
            <p>Medidor óptico de clorofila. Diagnóstico de nitrógeno en tiempo real mediante sensor foliar no destructivo.</p>
          </article>
          <article class="card">
            <h3 style="color: var(--brand2);">HidroFarm</h3>
            <p>Medidor electrónico avanzado de humedad y temperatura del suelo para un riego de alta precisión.</p>
          </article>
          <article class="card">
            <h3 style="color: var(--brand2);">SoloDrill</h3>
            <p>Perforador de suelo hidráulico automatizado para optimizar y agilizar el muestreo en campo.</p>
          </article>
          <article class="card">
            <h3 style="color: var(--brand2);">FalkerMap</h3>
            <p>Software y App para mapas de productividad, fertilidad y grillas de muestreo georreferenciado.</p>
          </article>
          <article class="card">
            <h3 style="color: var(--brand2);">Terram</h3>
            <p>Equipos para conductividad eléctrica (CE) y mapeo del potencial agrícola del campo.</p>
          </article>
        </div>
      </div>
    </section>
`;

// 2. Add the Falker card to the Servicios/Productos grid in index.html
let indexContent = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const cardToInject = `
          <article class="card" style="display:flex; flex-direction:column; justify-content:space-between; border-color: var(--brand); background: rgba(125,255,154,0.05);">
            <div>
              <h3 style="color: var(--brand);">Equipos Falker</h3>
              <p>Sensores y automatización para mediciones precisas de suelo y planta.</p>
            </div>
            <div style="margin-top: 14px;"><a href="productos-falker.html" class="btn primary">Ver Equipos</a></div>
          </article>
        </div>
`;

// Replacing all HTML files to include Falker in Nav
files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // Replace Nav
  content = content.replace(/\n\s*<a href="#contacto">Contacto<\/a>\n\s*<\/nav>/, newNavLink);
  // Replace Drawer
  content = content.replace(/\n\s*<a href="#contacto">Contacto<\/a>\n\s*<\/div>/, newDrawerLink);
  
  if (file === 'index.html') {
    // Inject Falker card in the Grid of index.html
    // The grid closes with `</article>\n        </div>` -> we just find `</div>\n      </div>\n    </section>` in the servicios section
    // Actually finding `</article>\n        </div>\n      </div>\n    </section>` is easier
    const gridEndStr = `</article>\n        </div>\n      </div>\n    </section>`;
    if (content.indexOf(gridEndStr) !== -1) {
      content = content.replace(gridEndStr, `</article>` + '\n' + cardToInject + '\n      </div>\n    </section>');
    }
  }

  fs.writeFileSync(path.join(dir, file), content);
});

// Create new file
let newPageContent = template;
newPageContent = newPageContent.replace(/\n\s*<a href="#contacto">Contacto<\/a>\n\s*<\/nav>/, newNavLink);
newPageContent = newPageContent.replace(/\n\s*<a href="#contacto">Contacto<\/a>\n\s*<\/div>/, newDrawerLink);

const mainStart = newPageContent.indexOf('<main id="inicio">') + '<main id="inicio">'.length;
const contactStart = newPageContent.indexOf('<!-- CONTACTO -->');

const finalHtml = newPageContent.substring(0, mainStart) + '\n' + falkerHtml + '\n' + newPageContent.substring(contactStart);

fs.writeFileSync(path.join(dir, 'productos-falker.html'), finalHtml);

console.log('done');
