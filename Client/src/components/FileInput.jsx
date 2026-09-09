import { API_BASE } from '../api/axios.js';

const UploadIcon = () => (
  <svg viewBox="0 0 18 18" fill="none">
    <path d="M9 12V3m0 0L5.5 6.5M9 3l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 12.5v1A2.5 2.5 0 0 0 5.5 16h7a2.5 2.5 0 0 0 2.5-2.5v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 18 18" fill="none">
    <path d="M5 2.5h5.5L14 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4" />
    <path d="M10 2.5V6h4" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 14 14" fill="none">
    <path d="M5.8 8.2l2.4-2.4M6.3 4l.5-.5a2 2 0 0 1 2.8 2.8l-.5.5M7.7 10l-.5.5a2 2 0 0 1-2.8-2.8l.5-.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/**
 * שדה העלאת קובץ אחיד לכל שלבי הטופס.
 * label - תווית השדה
 * file - אובייקט File שנבחר כרגע (אם נבחר)
 * existingUrl - נתיב קובץ קיים מהטיוטה (יחסי לשרת)
 * onChange - (file: File|null) => void
 */
export default function FileInput({ label, file, existingUrl, onChange, error }) {
  const fileName = file?.name;
  const hasAny = Boolean(file || existingUrl);

  return (
    <div className="field">
      <label>{label}</label>
      <div className={`dropzone ${hasAny ? 'has-file' : ''} ${error ? 'has-error' : ''}`}>
        <input type="file" accept="image/*,.pdf" onChange={(e) => onChange(e.target.files[0] || null)} />
        <span className="icon">{hasAny ? <FileIcon /> : <UploadIcon />}</span>
        <div className="text">
          {fileName ? (
            <>
              <div className="title">{fileName}</div>
              <div className="sub">קובץ נבחר - ייעלה בלחיצה על שמירה/הגשה</div>
            </>
          ) : existingUrl ? (
            <>
              <div className="title">קובץ הועלה בעבר</div>
              <a
                className="existing-link"
                href={`${API_BASE}${existingUrl}`}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <LinkIcon /> צפייה בקובץ
              </a>
            </>
          ) : (
            <>
              <div className="title">לחיצה לבחירת קובץ</div>
              <div className="sub">תמונה או PDF</div>
            </>
          )}
        </div>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
