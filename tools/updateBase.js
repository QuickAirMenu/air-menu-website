const fs = require('fs');

const viteConfigPath = './vite.config.js';
const deploymentBase = '/website/';

fs.readFile(viteConfigPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading vite.config.js:', err);
    return;
  }

  const updatedData = data.replace(/base:\s*['"`].*['"`],?/,
    `base: '${deploymentBase}',`);

  fs.writeFile(viteConfigPath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing vite.config.js:', err);
      return;
    }
    console.log(`✅ vite.config.js updated with base: '${deploymentBase}'`);
  });
});
