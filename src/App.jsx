import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FarmDataProvider } from './context/FarmDataContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Layouts
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Animals from './pages/Animals';
import Vaccinations from './pages/Vaccinations';
import DiseaseTracking from './pages/DiseaseTracking';
import FeedInventory from './pages/FeedInventory';
import MedicineInventory from './pages/MedicineInventory';
import Biosecurity from './pages/Biosecurity';
import WorkerManagement from './pages/WorkerManagement';
import Reports from './pages/Reports';
import AdminSettings from './pages/AdminSettings';

const AppContent = () => {
  const { user } = useAuth();

  // Public Routes Shell if not logged in
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Dashboard Layout Shell if authenticated
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Fixed Sidebar navigation */}
      <Sidebar />

      {/* Main content grid */}
      <div className="flex-grow pl-64 flex flex-col min-h-screen">
        {/* Dynamic header titles */}
        <Routes>
          <Route path="/dashboard" element={<Header title="Farm Overview Dashboard" />} />
          <Route path="/animals" element={<Header title="Animal Registry Database" />} />
          <Route path="/vaccinations" element={<Header title="Vaccine Administration Portal" />} />
          <Route path="/diseases" element={<Header title="Disease Cases & Isolation Logs" />} />
          <Route path="/feed" element={<Header title="Feed Stocks & Consumption Logs" />} />
          <Route path="/medicine" element={<Header title="Veterinary Dispensary Stock" />} />
          <Route path="/biosecurity" element={<Header title="Biosecurity & Sanitation Audits" />} />
          <Route path="/workers" element={<Header title="Labor & Duties Assignments" />} />
          <Route path="/reports" element={<Header title="Farm Reports & Export Center" />} />
          <Route path="/settings" element={<Header title="Admin System Configuration" />} />
          <Route path="*" element={<Header title="AgriSmart Dashboard" />} />
        </Routes>

        {/* Scrolling Viewport */}
        <main className="p-8 flex-grow">
          <Routes>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/animals" element={
              <ProtectedRoute>
                <Animals />
              </ProtectedRoute>
            } />
            <Route path="/vaccinations" element={
              <ProtectedRoute>
                <Vaccinations />
              </ProtectedRoute>
            } />
            <Route path="/diseases" element={
              <ProtectedRoute>
                <DiseaseTracking />
              </ProtectedRoute>
            } />
            <Route path="/feed" element={
              <ProtectedRoute allowedRoles={['Admin', 'Farm Manager', 'Farm Worker']}>
                <FeedInventory />
              </ProtectedRoute>
            } />
            <Route path="/medicine" element={
              <ProtectedRoute allowedRoles={['Admin', 'Farm Manager', 'Veterinarian']}>
                <MedicineInventory />
              </ProtectedRoute>
            } />
            <Route path="/biosecurity" element={
              <ProtectedRoute allowedRoles={['Admin', 'Farm Manager', 'Farm Worker']}>
                <Biosecurity />
              </ProtectedRoute>
            } />
            <Route path="/workers" element={
              <ProtectedRoute allowedRoles={['Admin', 'Farm Manager', 'Farm Worker']}>
                <WorkerManagement />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={['Admin', 'Farm Manager']}>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminSettings />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <FarmDataProvider>
          <AppContent />
        </FarmDataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
