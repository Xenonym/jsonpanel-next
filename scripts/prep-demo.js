const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const demoLibPath = path.resolve('demo', pkg.name);
const distPath = path.resolve('dist');
const minLibName = `${pkg.name}.umd.min.js`;
const minStyleName = `${pkg.name}.min.css`;

if (!fs.existsSync(demoLibPath)) {
  fs.mkdirSync(demoLibPath);
}

fs.copyFileSync(
  path.join(distPath, minLibName),
  path.join(demoLibPath, minLibName)
);
fs.copyFileSync(
  path.join(distPath, `${minLibName}.map`),
  path.join(demoLibPath, `${minLibName}.map`)
);
fs.copyFileSync(
  path.join(distPath, minStyleName),
  path.join(demoLibPath, minStyleName)
);
fs.copyFileSync(
  path.join(distPath, `${minStyleName}.map`),
  path.join(demoLibPath, `${minStyleName}.map`)
);
