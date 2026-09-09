import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectAuthLoading, selectIsAdmin } from '../store/authReducer.js';

export default function AdminRoute({ children }) {
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const isAdmin = useSelector(selectIsAdmin);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
