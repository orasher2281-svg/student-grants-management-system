import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUnapprovedRequests } from '../../api/requestApi.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';

const EMPTY_FILTERS = {
  tz: '', fromDate: '', toDate: '', specificDate: '',
  minSiblings: '', maxSiblings: '', city: '',
  minAnnualTuition: '', maxAnnualTuition: '', sortField: 'date', sortOrder: 'desc'
};

export default function ViewRequests() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRows = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.tz) params.tz = filters.tz;
      if (filters.specificDate) params.specificDate = filters.specificDate;
      if (!filters.specificDate && filters.fromDate) params.fromDate = filters.fromDate;
      if (!filters.specificDate && filters.toDate) params.toDate = filters.toDate;
      if (filters.minSiblings) params.minSiblings = filters.minSiblings;
      if (filters.maxSiblings) params.maxSiblings = filters.maxSiblings;
      if (filters.city) params.city = filters.city;
      if (filters.minAnnualTuition) params.minAnnualTuition = filters.minAnnualTuition;
      if (filters.maxAnnualTuition) params.maxAnnualTuition = filters.maxAnnualTuition;
      params.sort = JSON.stringify([{ field: filters.sortField, order: filters.sortOrder }]);

      const data = await getUnapprovedRequests(params);
      setRows(data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בשליפת הבקשות');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRows(); }, []); // eslint-disable-line

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="app-shell">
      <div className="page-head">
        <div className="eyebrow">ניהול</div>
        <h1>בקשות במערכת</h1>
        <p className="sub">כל הבקשות שעדיין לא אושרו, עם אפשרות סינון ומיון.</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="filters">
          <div className="field">
            <label>תעודת זהות</label>
            <input className="input" name="tz" value={filters.tz} onChange={handleChange} />
          </div>
          <div className="field">
            <label>עיר</label>
            <input className="input" name="city" value={filters.city} onChange={handleChange} />
          </div>
          <div className="field">
            <label>תאריך מדויק</label>
            <input className="input" type="date" name="specificDate" value={filters.specificDate} onChange={handleChange} />
          </div>
          <div className="field">
            <label>מתאריך</label>
            <input className="input" type="date" name="fromDate" value={filters.fromDate} onChange={handleChange} disabled={!!filters.specificDate} />
          </div>
          <div className="field">
            <label>עד תאריך</label>
            <input className="input" type="date" name="toDate" value={filters.toDate} onChange={handleChange} disabled={!!filters.specificDate} />
          </div>
          <div className="field">
            <label>אחים מתחת ל-18, מינ׳</label>
            <input className="input" type="number" min="0" name="minSiblings" value={filters.minSiblings} onChange={handleChange} />
          </div>
          <div className="field">
            <label>אחים מתחת ל-18, מקס׳</label>
            <input className="input" type="number" min="0" name="maxSiblings" value={filters.maxSiblings} onChange={handleChange} />
          </div>
          <div className="field">
            <label>שכר לימוד, מינ׳</label>
            <input className="input" type="number" min="0" name="minAnnualTuition" value={filters.minAnnualTuition} onChange={handleChange} />
          </div>
          <div className="field">
            <label>שכר לימוד, מקס׳</label>
            <input className="input" type="number" min="0" name="maxAnnualTuition" value={filters.maxAnnualTuition} onChange={handleChange} />
          </div>
          <div className="field">
            <label>מיון לפי</label>
            <select className="input" name="sortField" value={filters.sortField} onChange={handleChange}>
              <option value="date">תאריך הגשה</option>
              <option value="siblings">מספר אחים</option>
              <option value="tuition">שכר לימוד</option>
            </select>
          </div>
          <div className="field">
            <label>כיוון מיון</label>
            <select className="input" name="sortOrder" value={filters.sortOrder} onChange={handleChange}>
              <option value="desc">מהגבוה לנמוך</option>
              <option value="asc">מהנמוך לגבוה</option>
            </select>
          </div>
        </div>
        <div className="btn-row" style={{ marginTop: 4 }}>
          <button className="btn btn-gold" onClick={fetchRows} disabled={loading}>
            {loading ? 'מסנן/ת...' : 'החלת סינון'}
          </button>
          <button className="btn btn-ghost" onClick={() => { setFilters(EMPTY_FILTERS); fetchRows(); }}>איפוס</button>
        </div>
      </div>

      {error && <div className="banner error">{error}</div>}

      {loading ? (
        <Loader label="טוען בקשות..." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ת.ז.</th>
                <th>שם משפחה</th>
                <th>שם פרטי</th>
                <th>מגמה</th>
                <th>סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} onClick={() => navigate(`/admin/requests/${r._id}`)}>
                  <td>{r.personalInfo?.tz}</td>
                  <td>{r.personalInfo?.lastname || r.personalInfo?.lastName || '—'}</td>
                  <td>{r.personalInfo?.firstname || r.personalInfo?.firstName || '—'}</td>
                  <td>{r.educationInfo?.major}</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="empty-state">
              <div className="icon">
                <svg viewBox="0 0 40 40" fill="none">
                  <rect x="8" y="6" width="24" height="30" rx="2" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M14 14h12M14 20h12M14 26h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
              <p>לא נמצאו בקשות התואמות לסינון</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
