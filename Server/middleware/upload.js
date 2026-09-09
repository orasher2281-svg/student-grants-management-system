// קוד לשרת - תיקיה middleware/upload.js

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// יצירת __dirname עבור ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ תיקיית uploads בנתיב מוחלט (לא יחסי!)
const uploadDir = path.join(__dirname, '..', 'uploads');

// ✅ וודא שהתיקייה קיימת
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('[Upload] Created uploads directory:', uploadDir);
}

// הגדרת המנוע של הדיסק
const storage = multer.diskStorage({
    // א. איפה לשמור את הקובץ הפיזי?
    destination: function (req, file, cb) {
        cb(null, uploadDir); // ✅ נתיב מוחלט!
    },
    
    // ב. איך לקרוא לקובץ שנשמר?
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// סינון קבצים - רק תמונות ו-PDFs
const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    const allowedExts = ['.jpg', '.jpeg', '.png', '.pdf'];
    
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`סוג קובץ לא מותר: ${file.mimetype}`));
    }
};

// יצירת ה-Middleware
export const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});
