import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ZoneView from './pages/ZoneView';
import MyBookings from './pages/MyBookings';
import ManageZones from './pages/admin/ManageZones';
import ManageSlots from './pages/admin/ManageSlots';
import './index.css';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1f36',
              color: '#f1f5f9',
              border: '1px solid rgba(148,163,184,0.1)',
              borderRadius: '10px',
              fontSize: '0.875rem',
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/zone/:id" element={<ProtectedRoute><ZoneView /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/admin/zones" element={<ProtectedRoute><AdminRoute><ManageZones /></AdminRoute></ProtectedRoute>} />
          <Route path="/admin/slots" element={<ProtectedRoute><AdminRoute><ManageSlots /></AdminRoute></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
