import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRequestDetails, getRequestFile, changeStatus } from '../../api/requestApi.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';

const FILE_KEYS = [
  { key: 'studentIdCardUrl', label: 'ת.ז. הסטודנט' },
  { key: 'parentsIdCardsUrls', label: 'ת.ז. ההורים' },
  { key: 'enrollmentCertificateUrl', label: 'אישור לימודים' },
  { key: 'bankAccountConfirmationUrl', label: 'אישור ניהול חשבון' }
];

function Row({ k, v }) {
  return (
    <div className="summary-row">
      <span className="k">{k}</span>
      <span className="v">{v ?? '—'}</span>
    </div>
  );
}

export default function RequestDetails() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getRequestDetails(requestId)
      .then((data) => setRequest(data))
      .catch((err) => setError(err.response?.data?.message || 'שגיאה בשליפת פרטי הבקשה'));
  }, [requestId]);

  const viewFile = async (fileKey) => {
    try {
      const blob = await getRequestFile(requestId, fileKey);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch {
      setActionError('לא ניתן לפתוח את הקובץ המבוקש');
    }
  };

  const updateStatus = async (status) => {
    setBusy(true);
    setActionError('');
    try {
      await changeStatus(requestId, status);
      setRequest((prev) => ({ ...prev, status }));
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
        'עדכון הסטטוס נכשל. יש לוודא שבשרת מוגדר router.put (ולא router.get) עבור /request/changeStatus/:requestId.'
      );
    } finally {
      setBusy(false);
    }
  };

  if (error) {
    return (
      <div className="app-shell">
        <div className="banner error">{error}</div>
        <Link to="/admin/requests" className="btn btn-outline">חזרה לרשימת הבקשות</Link>
      </div>
    );
  }
  if (!request) {
    return <div className="app-shell"><Loader label="טוען פרטי בקשה..." /></div>;
  }

  const { personalInfo: p, familyInfo: f, educationInfo: e, bankInfo: b } = request;

  return (
    <div className="app-shell">
      <div className="page-head">
        <div className="eyebrow">ניהול</div>
        <h1>פרטי בקשה</h1>
        <StatusBadge status={request.status} />
      </div>

      {actionError && <div className="banner error">{actionError}</div>}

      <div className="card" style={{ marginBottom: 20 }}>
        <fieldset className="group">
          <legend>פרטים אישיים</legend>
          <Row k="תעודת זהות" v={p?.tz} />
          <Row k="שם מלא" v={`${p?.firstname || ''} ${p?.lastname || ''}`} />
          <Row k="תאריך לידה" v={p?.dateOfBirth?.substring(0, 10)} />
          <Row k="עיר" v={p?.city} />
          <Row k="כתובת" v={p?.address} />
          <Row k="טלפון נייד" v={p?.mobilePhone} />
          <Row k="טלפון נייח" v={p?.landlinePhone} />
        </fieldset>

        <fieldset className="group">
          <legend>פרטי משפחה</legend>
          <Row k="אב" v={`${f?.father?.firstname || ''} ${f?.father?.lastname || ''} (${f?.father?.tz || ''})`} />
          <Row k="אם" v={`${f?.mother?.firstname || ''} ${f?.mother?.lastname || ''} (${f?.mother?.tz || ''})`} />
          <Row k="אחים מתחת לגיל 18" v={f?.siblingsUnder18} />
          <Row k="אחים מעל 21 עם ילדים" v={f?.siblingsAbove21WithKids} />
        </fieldset>

        <fieldset className="group">
          <legend>פרטי לימודים</legend>
          <Row k="מגמה" v={e?.major} />
          <Row k="מוסד לימודים" v={e?.institutionName} />
          <Row k="שנות לימוד" v={e?.educationYears} />
          <Row k="שכר לימוד שנתי" v={e?.annualTuition} />
        </fieldset>

        <fieldset className="group">
          <legend>פרטי בנק</legend>
          <Row k="בעל החשבון" v={`${b?.accountHolderName || ''} (${b?.accountHolderId || ''})`} />
          <Row k="בנק" v={b?.bankName} />
          <Row k="סניף / חשבון" v={`${b?.branchNumber || ''} / ${b?.accountNumber || ''}`} />
        </fieldset>

        <h3>טפסים מצורפים</h3>
        <div>
          {FILE_KEYS.map(({ key, label }) => (
            <button key={key} type="button" className="file-pill" onClick={() => viewFile(key)}>
              <svg viewBox="0 0 14 14" fill="none"><path d="M5.8 8.2l2.4-2.4M6.3 4l.5-.5a2 2 0 0 1 2.8 2.8l-.5.5M7.7 10l-.5.5a2 2 0 0 1-2.8-2.8l.5-.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="btn-row">
        <button className="btn btn-ghost" onClick={() => navigate('/admin/requests')}>חזרה לרשימה</button>
        <button className="btn btn-danger" onClick={() => updateStatus('Rejected')} disabled={busy}>דחיית הבקשה</button>
        <button className="btn btn-gold" onClick={() => updateStatus('Approved')} disabled={busy}>אישור הבקשה</button>
      </div>
    </div>
  );
}
