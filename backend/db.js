const fs = require('fs');
const path = require('path');

const FICHIER = path.join(__dirname, 'adj-db.json');

function lire() {
  if (!fs.existsSync(FICHIER)) return { tokens: {}, notifications: [] };
  try { return JSON.parse(fs.readFileSync(FICHIER, 'utf8')); }
  catch { return { tokens: {}, notifications: [] }; }
}

function ecrire(data) {
  fs.writeFileSync(FICHIER, JSON.stringify(data, null, 2));
}

module.exports = { lire, ecrire };
