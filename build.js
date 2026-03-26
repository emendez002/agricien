const fs = require('fs');
const path = require('path');

const dir = process.cwd();
const indexFile = path.join(dir, 'index.html');

let html = fs.readFileSync(indexFile, 'utf8');

// 1. Extract CSS
const styleStart = html.indexOf('<style>');
const styleEnd = html.indexOf('</style>') + '</style>'.length;
let cssContent = html.slice(styleStart + 7, styleEnd - 8);

// Append Floating Contact CSS
cssContent += `
    /* Floating Contact */
    .floatingContact {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--brand);
      color: var(--bg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(125,255,154,0.4);
      z-index: 99;
      transition: 0.2s ease;
    }
    .floatingContact:hover {
      transform: translateY(-3px);
      box-shadow: 0 14px 30px rgba(125,255,154,0.5);
    }
    .floatingContact svg {
      width: 28px;
      height: 28px;
    }
`;

fs.writeFileSync(path.join(dir, 'styles.css'), cssContent);

// Replace CSS in HTML
html = html.replace(html.substring(styleStart, styleEnd), '<link rel="stylesheet" href="styles.css" />');

// 2. Navigation
const newNav = `
        <nav class="links" aria-label="Navegación">
          <a href="index.html">Inicio</a>
          <a href="ganaderia-sostenible.html">Ganadería</a>
          <a href="factibilidad-agricola.html">Factibilidad</a>
          <a href="procesamiento-lidar.html">LiDAR</a>
          <a href="certificaciones-ambientales.html">Certificaciones</a>
          <a href="analitica-agricola.html">Analítica</a>
          <a href="agricultura-precision.html">Precisión</a>
          <a href="gestion-ambiental-setena.html">SETENA</a>
          <a href="#contacto">Contacto</a>
        </nav>
`;
html = html.replace(/<nav class="links"[\s\S]*?<\/nav>/, newNav.trim());

const newDrawer = `
      <div class="drawer" id="drawer" aria-label="Menú móvil">
        <a href="index.html">Inicio</a>
        <a href="ganaderia-sostenible.html">Ganadería</a>
        <a href="factibilidad-agricola.html">Factibilidad</a>
        <a href="procesamiento-lidar.html">LiDAR</a>
        <a href="certificaciones-ambientales.html">Certificaciones</a>
        <a href="analitica-agricola.html">Analítica</a>
        <a href="agricultura-precision.html">Precisión</a>
        <a href="gestion-ambiental-setena.html">SETENA</a>
        <a href="#contacto">Contacto</a>
      </div>
`;
html = html.replace(/<div class="drawer" id="drawer" aria-label="Menú móvil">[\s\S]*?<\/div>/, newDrawer.trim());

// Floating contact button HTML
const floatingBtn = `
<a href="#contacto" class="floatingContact" aria-label="Contacto Rápido">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
</a>
</body>`;
html = html.replace('</body>', floatingBtn);

// Contact Secton Backup
const contactStart = html.indexOf('<!-- CONTACTO -->');
const contactEnd = html.indexOf('<!-- FOOTER -->');
const contactSection = html.slice(contactStart, contactEnd);

// Base template
const baseHeader = html.slice(0, html.indexOf('<main'));
const baseFooter = html.slice(html.indexOf('<!-- FOOTER -->'));

// 3. New Services Grid for Index
const indexServices = `
    <!-- SERVICIOS -->
    <section id="servicios">
      <div class="container">
        <div class="sectionHead">
          <div>
            <h2>Nuestros Servicios</h2>
            <p>Conocé nuestras líneas de negocio especializadas.</p>
          </div>
        </div>
        <div class="grid3">
          <article class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <h3>Ganadería Sostenible</h3>
              <p>Diseño Hidrológico, Arado YeomansPlow, retención de agua y biomasa.</p>
            </div>
            <div style="margin-top: 14px;"><a href="ganaderia-sostenible.html" class="btn">Leer más</a></div>
          </article>
          <article class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <h3>Factibilidad Agrícola</h3>
              <p>Estudios Geoespaciales y teledetección multitemporal.</p>
            </div>
            <div style="margin-top: 14px;"><a href="factibilidad-agricola.html" class="btn">Leer más</a></div>
          </article>
          <article class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <h3>Procesamiento LiDAR</h3>
              <p>Procesamiento masivo de nubes de puntos y DTM/DSM.</p>
            </div>
            <div style="margin-top: 14px;"><a href="procesamiento-lidar.html" class="btn">Leer más</a></div>
          </article>
          <article class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <h3>Certificaciones Ambientales</h3>
              <p>Auditoría Geoespacial y cumplimiento de normativas.</p>
            </div>
            <div style="margin-top: 14px;"><a href="certificaciones-ambientales.html" class="btn">Leer más</a></div>
          </article>
          <article class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <h3>Analítica Agrícola</h3>
              <p>Business Intelligence, Analítica Predictiva y Dashboards.</p>
            </div>
            <div style="margin-top: 14px;"><a href="analitica-agricola.html" class="btn">Leer más</a></div>
          </article>
          <article class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <h3>Agricultura de Precisión</h3>
              <p>Arquitectura de Fincas y vuelos con drones.</p>
            </div>
            <div style="margin-top: 14px;"><a href="agricultura-precision.html" class="btn">Leer más</a></div>
          </article>
          <article class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <h3>Gestión Ambiental SETENA</h3>
              <p>Planes de Gestión Ambiental y automatización de inventarios.</p>
            </div>
            <div style="margin-top: 14px;"><a href="gestion-ambiental-setena.html" class="btn">Leer más</a></div>
          </article>
        </div>
      </div>
    </section>
`;

// Modify Index.html body replacing "capacidad" section with "servicios"
let idxHtml = html.replace(/<!-- CAPACIDAD "EN GRANDE" -->[\s\S]*?<!-- INNOVACION -->/, indexServices + '\n    <!-- INNOVACION -->');
fs.writeFileSync(path.join(dir, 'index.html'), idxHtml);

// 4. Page Generation Data
const pages = [
  {
    file: "ganaderia-sostenible.html",
    title: "Ganadería Sostenible",
    desc: "Diseño Hidrológico y manejo de tierras para optimizar el recurso hídrico, asegurando rentabilidad y resiliencia climática.",
    details: [
      { t: "Diseño Hidrológico", d: "Hipsolíneas/Líneas de infiltración para manejo inteligente del agua." },
      { t: "Arado YeomansPlow", d: "Estrategias de retención de agua en el suelo profundo." },
      { t: "Crecimiento de Biomasa", d: "Aumento progresivo del hato y la biomasa disponible." }
    ]
  },
  {
    file: "factibilidad-agricola.html",
    title: "Factibilidad Agrícola",
    desc: "Estudios rigurosos con datos geoespaciales para determinar la viabilidad real y financiera de tu proyecto.",
    details: [
      { t: "Estudios Geoespaciales", d: "Análisis integral del territorio y vocación del terreno." },
      { t: "Teledetección", d: "Análisis multitemporal utilizando Google Earth Engine." },
      { t: "Análisis de Riesgos", d: "Histórico de inundaciones (1984-presente) y clasificación de pendientes topográficas." }
    ]
  },
  {
    file: "procesamiento-lidar.html",
    title: "Procesamiento LiDAR",
    desc: "Precisión milimétrica a través del procesamiento masivo de datos topográficos aerotransportados.",
    details: [
      { t: "Nubes de Puntos", d: "Procesamiento masivo de nubes de puntos LiDAR (filtrado/clasificación de miles de millones de puntos)." },
      { t: "Modelos Digitales", d: "Modelos Digitales de Terreno (DTM/DSM) de altísima precisión." },
      { t: "Ingeniería de Detalle", d: "Cálculo volumétrico y perfiles de elevación." }
    ]
  },
  {
    file: "certificaciones-ambientales.html",
    title: "Certificaciones Ambientales",
    desc: "Aseguramos el cumplimiento normativo con tecnología de punta satelital y automatización.",
    details: [
      { t: "Auditoría Geoespacial", d: "Estudios de Cambio de Uso de Suelo (LUCC) con evidencia innegable." },
      { t: "Normativas Globales", d: "Cumplimiento estricto de normativas internacionales RSPO e ISCC." },
      { t: "Imágenes Satelitales", d: "Automatización y análisis continuo con Landsat/Sentinel." }
    ]
  },
  {
    file: "analitica-agricola.html",
    title: "Analítica Agrícola",
    desc: "Transformamos datos dispersos del campo en decisiones rentables mediante Business Intelligence.",
    details: [
      { t: "Business Intelligence", d: "Inteligencia de Negocios (BI) y Analítica Predictiva para agro." },
      { t: "Arquitectura de Datos", d: "Procesos maduros ETL, integrados en SQL Server, PostgreSQL y R." },
      { t: "Decisiones Ejecutivas", d: "Dashboards personalizados en Tableau/PowerBI para la gerencia." }
    ]
  },
  {
    file: "agricultura-precision.html",
    title: "Agricultura de Precisión",
    desc: "Arquitectura de fincas utilizando tecnología geoespacial, drones e integración de datos climáticos.",
    details: [
      { t: "Arquitectura de Fincas", d: "Diseño óptimo de la finca para maximizar eficiencia operativa." },
      { t: "Vuelo de Drones", d: "Drones/VANT para generación de ortomosaicos y topografía detallada." },
      { t: "Diseño de Precisión", d: "Diseño de surcos en contorno (ridges) y Keylines, cruce de datos meteorológicos/edafológicos." }
    ]
  },
  {
    file: "gestion-ambiental-setena.html",
    title: "Gestión Ambiental SETENA",
    desc: "Planes estratégicos y cumplimiento ágil y técnico ante la Secretaría Técnica Nacional Ambiental.",
    details: [
      { t: "Planes de Gestión", d: "Gestión Ambiental Estratégica, Planes de Gestión Ambiental (PGAI)." },
      { t: "Evaluaciones de Impacto", d: "Elaboración de Evaluaciones de Impacto Ambiental (EsIA) completas." },
      { t: "Seguimiento Tecnológico", d: "Seguimiento técnico ante SETENA automatizando inventarios de campo." }
    ]
  }
];

pages.forEach(p => {
  const pageHtml = `
  <main id="inicio">
    <section class="hero" style="padding: 60px 0 30px;">
      <div class="container">
        <div class="panel">
          <div class="panelInner" style="padding: 40px; background: rgba(0,0,0,.2);">
            <div class="kicker"><span class="dot" aria-hidden="true"></span>Servicio Especializado</div>
            <h1 style="margin-top:16px;">${p.title}</h1>
            <p class="lead" style="margin-top:12px; font-size:18px;">${p.desc}</p>
            <div class="heroCtas" style="margin-top:24px;">
              <a class="btn primary" href="#contacto">Solicitar Cotización</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="detalles">
      <div class="container">
        <div class="sectionHead">
          <div>
            <h2>Detalles y Beneficios</h2>
            <p>Conocé el rigor técnico detrás de este servicio.</p>
          </div>
        </div>
        <div class="grid3">
          ${p.details.map(d => `
          <article class="card">
            <h3 style="color: var(--brand2);">${d.t}</h3>
            <p>${d.d}</p>
          </article>
          `).join('')}
        </div>
      </div>
    </section>

    ${contactSection}
  `;

  fs.writeFileSync(path.join(dir, p.file), baseHeader + pageHtml + baseFooter);
});

console.log('Build complete. all files generated successfully.');
