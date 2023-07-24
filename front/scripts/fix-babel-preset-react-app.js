const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '..', 'node_modules/babel-preset-react-app/index.js');
const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
const nextFileContent = fileContent.replace(
  'const env = process.env.BABEL_ENV || process.env.NODE_ENV;',
  'const env = process.env.BABEL_ENV || process.env.NODE_ENV || "development";',
);
fs.writeFileSync(filePath, nextFileContent, { encoding: 'utf-8' });
