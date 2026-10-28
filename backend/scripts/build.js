// "Build" simples para Node: valida a sintaxe e gera dist/ pronto para empacotar.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.cpSync(path.join(root, 'src'), path.join(dist, 'src'), { recursive: true });
fs.copyFileSync(path.join(root, 'package.json'), path.join(dist, 'package.json'));

console.log('Build concluído em backend/dist');
