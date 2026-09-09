import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectAuthLoading } from '../store/authReducer.js';

export default function ProtectedRoute({ children }) {
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
