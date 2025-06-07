@echo off
echo 🚀 Starting Git Push Process...

:: انتقل إلى مجلد المشروع (تأكد من وضع المسار الصحيح)
cd /d "E:\Air Menu\00_Air Menu\WebSite\04\air-menu-website"

:: أضف جميع التعديلات
git add .

:: اطلب من المستخدم كتابة رسالة الكوميت
set /p commitMsg=Enter Commit Message: 

:: نفذ عملية الكوميت
git commit -m "%commitMsg%"

:: ادفع التغييرات إلى GitHub
git push origin main

pause
