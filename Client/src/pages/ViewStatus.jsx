import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRequestStatus } from '../api/requestApi.js';
import StatusBadge from '../components/StatusBadge.jsx';
import Loader from '../components/Loader.jsx';

const MESSAGES = {
  Pending: 'הבקשה שלך התקבלה ונמצאת בבדיקה. נעדכן אותך כשתתקבל החלטה.',
  Approved: 'מזל טוב! הבקשה שלך אושרה.',
  Rejected: 'לצערנו הבקשה שלך נדחתה. ניתן לפנות למרכז התמיכה לפרטים נוספים.'
};

export default function ViewStatus() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRequestStatus()
      .then((data) => setData(data))
      .catch((err) => setError(err.response?.data?.message || 'שגיאה בשליפת הסטטוס'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-shell">
      <div className="page-head">
        <div className="eyebrow">מעקב</div>
        <h1>סטטוס הבקשה שלי</h1>
        <p className="sub">בדיקת המצב העדכני של הבקשה האחרונה שהוגשה.</p>
      </div>

      {loading && <Loader label="בודק/ת סטטוס..." />}

      {!loading && error && (
        <div className="card">
          <div className="banner info">{error}</div>
          <Link to="/send-request" className="btn btn-gold">להגשת בקשה חדשה</Link>
        </div>
      )}

      {!loading && data && (
        <div className="card">
          <StatusBadge status={data.status} />
          <p style={{ marginTop: 18 }}>{MESSAGES[data.status] || ''}</p>
          {data.dateSubmitted && (
            <p className="muted">
              תאריך הגשה: {new Date(data.dateSubmitted).toLocaleDateString('he-IL')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
