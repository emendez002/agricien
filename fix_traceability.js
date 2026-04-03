const fs = require('fs');
const path = require('path');

const dir = process.cwd();
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');

  const targetFnName = 'function googleFormSubmit(e){';
  
  if (content.includes(targetFnName) && !content.includes('[Trazabilidad Interna]')) {
    const appendLogic = `
    const msgField = document.querySelector('textarea[name="entry.540142033"]');
    const inputPagina = document.getElementById("origen_pagina");
    const inputElemento = document.getElementById("origen_elemento");
    
    // Adjuntar trazabilidad al mensaje de forma transparente antes de enviar
    if (msgField && inputPagina && inputElemento && msgField.value.trim() !== '') {
      const traceText = "\\n\\n--- [Trazabilidad Interna] ---\\nOrigen de Página: " + (inputPagina.value || 'N/A') + "\\nElemento/Botón: " + (inputElemento.value || 'N/A');
      if (!msgField.value.includes('[Trazabilidad')) {
        msgField.value += traceText;
      }
    }
`;
    content = content.replace(targetFnName, targetFnName + appendLogic);
    fs.writeFileSync(path.join(dir, file), content);
    console.log('Fixed ' + file);
  }
});

console.log('Traceability fixed to append to message.');
