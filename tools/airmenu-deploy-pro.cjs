const fs = require('fs/promises');
const ftp = require("basic-ftp");
const dotenv = require("dotenv");
const { exec } = require("child_process");
const { promisify } = require("util");

dotenv.config();

const execAsync = promisify(exec);
const viteConfigPath = './vite.config.js';
const deploymentBase = '/website/';

async function updateBase() {
  let data = await fs.readFile(viteConfigPath, 'utf8');
  const updatedData = data.replace(/base:\s*['"`].*['"`],?/, `base: '${deploymentBase}',`);
  await fs.writeFile(viteConfigPath, updatedData, 'utf8');
  console.log(`✅ vite.config.js updated with base: '${deploymentBase}'`);
}

async function buildProject() {
  console.log("🚀 Running build...");
  await execAsync("npm run build");
  console.log("✅ Build completed");
}

async function uploadToFTP() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      port: parseInt(process.env.FTP_PORT),
      secure: false
    });

    console.log("✅ Connected to FTP");

    await client.ensureDir(process.env.FTP_FOLDER);
    await client.clearWorkingDir();
    await client.uploadFromDir("./dist");
    console.log("✅ FTP Upload completed");
  } catch (err) {
    console.error("❌ FTP upload failed:", err);
    throw err;
  } finally {
    client.close();
  }
}

async function pushToGit() {
  console.log("🚀 Pushing to GitHub...");
  try {
    await execAsync("git add .");
    await execAsync("git commit -m \"Auto deploy: build & ftp upload\"");
    await execAsync("git push origin main");
    console.log("✅ Git push completed");
  } catch (err) {
    console.error("❌ Git push failed:", err);
  }
}

(async () => {
  try {
    await updateBase();
    await buildProject();
    await uploadToFTP();
    await pushToGit();
  } catch (err) {
    console.error("❌ Deployment failed:", err);
    process.exit(1);
  }
})();
