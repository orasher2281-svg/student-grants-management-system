import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectIsAdmin, logout as logoutAction } from '../store/authReducer.js';

export default function Navbar() {
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="mark">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 10.5l3.2 3.2L16 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          מענקים לסטודנטים
        </Link>
        <div className="nav-links">
          <Link to="/">בית</Link>
          <Link to="/send-request">הגשת בקשה</Link>
          {user && <Link to="/status">סטטוס בקשה</Link>}
          {isAdmin && <Link to="/admin/requests">בקשות במערכת</Link>}
          {!user && <Link to="/login">התחברות</Link>}
          {!user && <Link to="/register" className="pill">הרשמה</Link>}
          {user && (
            <button className="link-btn" onClick={handleLogout}>
              התנתקות ({user.firstname})
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
