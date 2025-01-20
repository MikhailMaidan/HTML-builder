const fs = require('fs/promises');
const path = require('path');

async function mergeStyles() {
  const folderWithStyles = path.join(__dirname, 'styles');
  const bundleDestination = path.join(__dirname, 'project-dist', 'bundle.css');
  let allCssContent = '';
  const thingsInFolder = await fs.readdir(folderWithStyles, {
    withFileTypes: true,
  });

  for (let i = 0; i < thingsInFolder.length; i++) {
    const item = thingsInFolder[i];

    if (item.isFile() && path.extname(item.name) === '.css') {
      const filePath = path.join(folderWithStyles, item.name);
      const data = await fs.readFile(filePath, 'utf-8');
      allCssContent += data + '\n';
    }
  }

  await fs.writeFile(bundleDestination, allCssContent);
}

mergeStyles();
