import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DispatchBoard from './pages/DispatchBoard';
import Compliance from './pages/Compliance';
import Carriers from './pages/Carriers';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import DispatcherList from './pages/DispatcherList';
import MyDrivers from './pages/MyDrivers';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dispatch" element={<DispatchBoard />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="carriers" element={<Carriers />} />
            <Route path="messages" element={<Messages />} />
            <Route path="dispatchers" element={<DispatcherList />} />
            <Route path="my-drivers" element={<MyDrivers />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Profile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
