const fs = require('fs');
const ftp = require("basic-ftp");
const { exec } = require("child_process");
require('dotenv').config(); // تحميل متغيرات البيئة

// قراءة بيانات من env
const {
    FTP_HOST,
    FTP_USER,
    FTP_PASS,
    FTP_PORT,
    FTP_FOLDER
} = process.env;

const viteConfigPath = './vite.config.js';
const deploymentBase = `${FTP_FOLDER}/`;

// تحديث ملف vite.config.js بالمسار الصحيح
async function updateBase() {
    return new Promise((resolve, reject) => {
        fs.readFile(viteConfigPath, 'utf8', (err, data) => {
            if (err) {
                console.error('❌ Error reading vite.config.js:', err);
                reject(err);
                return;
            }

            const updatedData = data.replace(/base:\s*['"`].*['"`],?/, `base: '${deploymentBase}',`);

            fs.writeFile(viteConfigPath, updatedData, 'utf8', (err) => {
                if (err) {
                    console.error('❌ Error writing vite.config.js:', err);
                    reject(err);
                    return;
                }
                console.log(`✅ vite.config.js updated with base: '${deploymentBase}'`);
                resolve();
            });
        });
    });
}

// تنفيذ أمر build
async function buildProject() {
    return new Promise((resolve, reject) => {
        exec("npm run build", (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Build error: ${error.message}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`⚠️ Build stderr: ${stderr}`);
            }
            console.log(`✅ Build completed:\n${stdout}`);
            resolve();
        });
    });
}

// رفع الملفات عبر FTP
async function uploadToFTP() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: FTP_HOST,
            user: FTP_USER,
            password: FTP_PASS,
            port: FTP_PORT,
            secure: false,
        });

        console.log("✅ Connected to FTP");

        // ملاحظة مهمة: عندك فعلياً تدخل على مجلد website مباشرة، إذن:
        await client.uploadFromDir("./dist");
        console.log("✅ Upload completed successfully");
    } catch (err) {
        console.error("❌ FTP upload failed:", err);
    }
    client.close();
}

// التسلسل الكامل
(async () => {
    try {
        await updateBase();
        await buildProject();
        await uploadToFTP();
        console.log("🚀 Deployment Finished Successfully 🚀");
    } catch (err) {
        console.error("❌ Deployment failed:", err);
    }
})();

// هذا السكربت يقوم بتحديث ملف vite.config.js، بناء المشروع، ورفع الملفات إلى خادم FTP