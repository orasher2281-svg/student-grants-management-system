import { STATUS_LABELS } from '../../constants/options.js';

function Row({ k, v }) {
  return (
    <div className="summary-row">
      <span className="k">{k}</span>
      <span className="v">{v || '—'}</span>
    </div>
  );
}

export default function Verify({ data, confirmed, onConfirmedChange }) {
  const { personalInfo: p, familyInfo: f, educationInfo: e, bankInfo: b } = data;

  return (
    <div>
      <h3>אישור ושליחה</h3>
      <p className="muted">נא לבדוק שכל הפרטים נכונים לפני ההגשה.</p>

      <fieldset className="group">
        <legend>פרטים אישיים</legend>
        <Row k="תעודת זהות" v={p.tz} />
        <Row k="שם מלא" v={`${p.firstname || ''} ${p.lastname || ''}`} />
        <Row k="תאריך לידה" v={p.dateOfBirth?.substring(0, 10)} />
        <Row k="עיר" v={p.city} />
        <Row k="כתובת" v={p.address} />
        <Row k="טלפון נייד" v={p.mobilePhone} />
      </fieldset>

      <fieldset className="group">
        <legend>פרטי משפחה</legend>
        <Row k="אב" v={`${f.father?.firstname || ''} ${f.father?.lastname || ''} (${f.father?.tz || ''})`} />
        <Row k="אם" v={`${f.mother?.firstname || ''} ${f.mother?.lastname || ''} (${f.mother?.tz || ''})`} />
        <Row k="אחים מתחת לגיל 18" v={f.siblingsUnder18} />
        <Row k="אחים מעל 21 עם ילדים" v={f.siblingsAbove21WithKids} />
      </fieldset>

      <fieldset className="group">
        <legend>פרטי לימודים</legend>
        <Row k="מגמה" v={e.major} />
        <Row k="מוסד לימודים" v={e.institutionName} />
        <Row k="שנות לימוד" v={e.educationYears} />
        <Row k="שכר לימוד שנתי" v={e.annualTuition} />
      </fieldset>

      <fieldset className="group">
        <legend>פרטי בנק</legend>
        <Row k="בעל החשבון" v={`${b.accountHolderName || ''} (${b.accountHolderId || ''})`} />
        <Row k="בנק" v={b.bankName} />
        <Row k="סניף / חשבון" v={`${b.branchNumber || ''} / ${b.accountNumber || ''}`} />
      </fieldset>

      {data.status && (
        <p className="muted">סטטוס נוכחי: {STATUS_LABELS[data.status] || data.status}</p>
      )}

      <label className="confirm-row">
        <input type="checkbox" checked={confirmed} onChange={(e) => onConfirmedChange(e.target.checked)} />
        <span>אני מאשר/ת כי הפרטים שמסרתי נכונים ומלאים.</span>
      </label>
    </div>
  );
}
