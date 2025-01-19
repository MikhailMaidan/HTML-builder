const fs = require('fs');
const txtPath = require('path');

const filePath = txtPath.join(__dirname, 'text.txt');

const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

readStream.pipe(process.stdout);
