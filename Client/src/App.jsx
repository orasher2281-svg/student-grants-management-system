import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import { initAuth } from './store/authReducer.js';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ViewStatus from './pages/ViewStatus.jsx';
import SendRequest from './pages/SendRequest/SendRequest.jsx';
import ViewRequests from './pages/Admin/ViewRequests.jsx';
import RequestDetails from './pages/Admin/RequestDetails.jsx';

export default function App() {
  const dispatch = useDispatch();

  // בדיוק כמו שה-AuthProvider הישן עשה בעת עליית האפליקציה: אימות טוקן קיים מול השרת.
  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* טופס הבקשה פתוח לצפייה גם למשתמש שאינו מחובר, אך שמירה/הגשה דורשות התחברות */}
        <Route path="/send-request" element={<SendRequest />} />

        <Route path="/status" element={
          <ProtectedRoute><ViewStatus /></ProtectedRoute>
        } />

        <Route path="/admin/requests" element={
          <AdminRoute><ViewRequests /></AdminRoute>
        } />
        <Route path="/admin/requests/:requestId" element={
          <AdminRoute><RequestDetails /></AdminRoute>
        } />

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
