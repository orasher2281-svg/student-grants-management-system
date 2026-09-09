import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authReducer.js';
import { validateLogin } from '../utils/validators.js';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ tz: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const cls = (name) => `input${fieldErrors[name] ? ' input-error' : ''}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errs = validateLogin(form);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setBusy(true);
    try {
      await dispatch(login(form)).unwrap();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'ההתחברות נכשלה, נסו שוב');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="auth-wrap">
        <div className="card">
          <div className="auth-eyebrow">כניסה למערכת</div>
          <h2>התחברות</h2>
          {error && <div className="banner error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="tz">תעודת זהות</label>
              <input
                className={cls('tz')} id="tz" name="tz" value={form.tz}
                onChange={handleChange} maxLength={9}
                placeholder="9 ספרות"
              />
              {fieldErrors.tz && <div className="error">{fieldErrors.tz}</div>}
            </div>
            <div className="field">
              <label htmlFor="password">סיסמה</label>
              <input
                className={cls('password')} id="password" type="password" name="password"
                value={form.password} onChange={handleChange}
              />
              {fieldErrors.password && <div className="error">{fieldErrors.password}</div>}
            </div>
            <button className="btn btn-gold" type="submit" disabled={busy} style={{ width: '100%' }}>
              {busy ? 'מתחבר/ת...' : 'התחברות'}
            </button>
          </form>
        </div>
        <p className="auth-foot">
          אין לך חשבון? <Link to="/register">צור אותו עכשיו</Link>
        </p>
      </div>
    </div>
  );
}
