const fs = require('fs/promises');
const path = require('path');

async function copyDir(sourceFolder, destinationFolder) {
  await fs.mkdir(destinationFolder, { recursive: true });
  const items = await fs.readdir(sourceFolder, { withFileTypes: true });

  for (const item of items) {
    const sourcePath = path.join(sourceFolder, item.name);
    const destinationPath = path.join(destinationFolder, item.name);

    if (item.isDirectory()) {
      await copyDir(sourcePath, destinationPath);
    } else {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
}

async function main() {
  const sourceDirectory = path.join(__dirname, 'files');
  const destinationDirectory = path.join(__dirname, 'files-copy');

  await fs.rm(destinationDirectory, { recursive: true, force: true });
  await copyDir(sourceDirectory, destinationDirectory);
}

main();
