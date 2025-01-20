const fs = require('fs/promises');
const path = require('path');

async function buildHtmlFile() {
  const templateFilePath = path.join(__dirname, 'template.html');
  const componentsDir = path.join(__dirname, 'components');
  const distDir = path.join(__dirname, 'project-dist');
  const distHtmlPath = path.join(distDir, 'index.html');
  let templateContent = await fs.readFile(templateFilePath, 'utf-8');
  const tagRegex = /{{\s*([a-zA-Z0-9-_]+)\s*}}/;
  let match = tagRegex.exec(templateContent);

  while (match) {
    const tagName = match[1];
    const componentFilePath = path.join(componentsDir, `${tagName}.html`);
    let componentContent = '';

    try {
      componentContent = await fs.readFile(componentFilePath, 'utf-8');
    } catch (e) {
      componentContent = '';
    }

    templateContent = templateContent.replace(match[0], componentContent);
    match = tagRegex.exec(templateContent);
  }

  await fs.writeFile(distHtmlPath, templateContent);
}

async function buildStylesFile() {
  const stylesDir = path.join(__dirname, 'styles');
  const distDir = path.join(__dirname, 'project-dist');
  const distCssPath = path.join(distDir, 'style.css');
  let mergedCss = '';
  const items = await fs.readdir(stylesDir, { withFileTypes: true });

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.isFile() && path.extname(item.name) === '.css') {
      const filePath = path.join(stylesDir, item.name);
      const cssContent = await fs.readFile(filePath, 'utf-8');

      mergedCss += cssContent + '\n';
    }
  }

  await fs.writeFile(distCssPath, mergedCss);
}

async function copyAssetsFolder(src, dest) {
  await fs.mkdir(dest, { recursive: true });

  const items = await fs.readdir(src, { withFileTypes: true });

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    if (item.isDirectory()) {
      await copyAssetsFolder(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function buildPage() {
  const distDir = path.join(__dirname, 'project-dist');
  const assetsSrc = path.join(__dirname, 'assets');
  const assetsDest = path.join(distDir, 'assets');

  await fs.mkdir(distDir, { recursive: true });
  await buildHtmlFile();
  await buildStylesFile();
  await fs.rm(assetsDest, { recursive: true, force: true });
  await copyAssetsFolder(assetsSrc, assetsDest);

  console.log('Page was constructed');
}

buildPage();
