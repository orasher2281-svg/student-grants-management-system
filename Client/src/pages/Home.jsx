import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAdmin } from '../store/authReducer.js';

export default function Home() {
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);

  return (
    <div className="app-shell">
      <section className="hero">
        <div>
          <div className="eyebrow">קרן מענקים אקדמית</div>
          <h1>תמיכה כלכלית בדרך שלך ללימודים</h1>
          <p className="lede">
            הגישו בקשה למענק לימודים במספר שלבים פשוטים, עקבו אחרי הסטטוס בכל
            רגע, ושמרו טיוטה כדי להמשיך מאיפה שעצרתם.
          </p>
          <div className="btn-row">
            {!user && (
              <>
                <Link to="/register" className="btn btn-gold">הרשמה למערכת</Link>
                <Link to="/login" className="btn btn-outline">התחברות</Link>
              </>
            )}
            {user && !isAdmin && (
              <>
                <Link to="/send-request" className="btn btn-gold">הגשת בקשה</Link>
                <Link to="/status" className="btn btn-outline">בדיקת סטטוס</Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin/requests" className="btn btn-gold">לוח ניהול בקשות</Link>
            )}
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-card-head">
            <h3 className="hero-card-title">איך זה עובד</h3>
            <span className="stamp pending">בהמתנה לאישור</span>
          </div>
          <ol>
            <li>נרשמים למערכת עם מספר תעודת זהות וסיסמה.</li>
            <li>ממלאים את הטופס הרב-שלבי: פרטים אישיים, משפחה, לימודים ובנק.</li>
            <li>מעלים את הטפסים הנדרשים ומאשרים את הפרטים.</li>
            <li>עוקבים אחרי הסטטוס עד למתן תשובה.</li>
          </ol>
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature">
          <span className="num">01</span>
          <h4>שמירת טיוטה</h4>
          <p className="muted">אפשר לעצור באמצע ולחזור להמשיך מאותה נקודה בכל עת.</p>
        </div>
        <div className="feature">
          <span className="num">02</span>
          <h4>מעקב סטטוס</h4>
          <p className="muted">בהמתנה, אושרה או נדחתה — תמיד תדעו היכן הבקשה עומדת.</p>
        </div>
        <div className="feature">
          <span className="num">03</span>
          <h4>ניהול למנהל המערכת</h4>
          <p className="muted">סינון, מיון ובדיקת בקשות הסטודנטים במקום אחד.</p>
        </div>
      </section>
    </div>
  );
}
