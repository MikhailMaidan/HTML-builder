const path = require('path');
const fs = require('fs/promises');

async function listFilesInSecretFolder() {
  try {
    const folderPath = path.join(__dirname, 'secret-folder');

    const entries = await fs.readdir(folderPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile()) {
        const filePath = path.join(folderPath, entry.name);

        const stats = await fs.stat(filePath);

        const ext = path.extname(entry.name);
        const fileName = path.basename(entry.name, ext);

        const sizeInBytes = stats.size;

        console.log(`${fileName} - ${ext.slice(1)} - ${sizeInBytes}b`);
      }
    }
  } catch (error) {
    console.error('Error with taht folder:', error);
  }
}

listFilesInSecretFolder();
