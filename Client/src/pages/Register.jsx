import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../store/authReducer.js';
import { validateRegister } from '../utils/validators.js';

const EMPTY = { tz: '', firstname: '', lastname: '', email: '', password: '', secretCode: '' };

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const cls = (name) => `input${fieldErrors[name] ? ' input-error' : ''}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errs = validateRegister(form);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setBusy(true);
    try {
      await dispatch(register(form)).unwrap();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'ההרשמה נכשלה, נסו שוב');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="auth-wrap">
        <div className="card">
          <div className="auth-eyebrow">הצטרפות למערכת</div>
          <h2>הרשמה</h2>
          {error && <div className="banner error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="tz">תעודת זהות</label>
              <input className={cls('tz')} id="tz" name="tz" value={form.tz} onChange={handleChange} maxLength={9} placeholder="9 ספרות" />
              {fieldErrors.tz && <div className="error">{fieldErrors.tz}</div>}
            </div>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="firstname">שם פרטי</label>
                <input className={cls('firstname')} id="firstname" name="firstname" value={form.firstname} onChange={handleChange} />
                {fieldErrors.firstname && <div className="error">{fieldErrors.firstname}</div>}
              </div>
              <div className="field">
                <label htmlFor="lastname">שם משפחה</label>
                <input className={cls('lastname')} id="lastname" name="lastname" value={form.lastname} onChange={handleChange} />
                {fieldErrors.lastname && <div className="error">{fieldErrors.lastname}</div>}
              </div>
            </div>
            <div className="field">
              <label htmlFor="email">דוא"ל</label>
              <input className={cls('email')} id="email" type="email" name="email" value={form.email} onChange={handleChange} />
              {fieldErrors.email && <div className="error">{fieldErrors.email}</div>}
            </div>
            <div className="field">
              <label htmlFor="password">סיסמה</label>
              <input className={cls('password')} id="password" type="password" name="password" value={form.password} onChange={handleChange} />
              {fieldErrors.password && <div className="error">{fieldErrors.password}</div>}
            </div>
            <div className="field">
              <label htmlFor="secretCode">קוד מנהל (אופציונלי)</label>
              <input className="input" id="secretCode" name="secretCode" value={form.secretCode} onChange={handleChange} placeholder="להזנה רק אם הונחיתם לכך" />
              <div className="hint">השדה מיועד לבעלי הרשאת ניהול בלבד.</div>
            </div>
            <button className="btn btn-gold" type="submit" disabled={busy} style={{ width: '100%' }}>
              {busy ? 'נרשם/ת...' : 'הרשמה'}
            </button>
          </form>
        </div>
        <p className="auth-foot">
          יש לך חשבון? <Link to="/login">התחברות</Link>
        </p>
      </div>
    </div>
  );
}
