import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Management from './pages/Management';
import Viewer from './pages/Viewer';
import Settings from './pages/Settings';
import VectorGeneration from './pages/VectorGeneration';
import MapStyles from './pages/MapStyles';
import TileServerConfig from './pages/TileServerConfig';
import DatabaseEditor from './pages/DatabaseEditor';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="viewer" element={<Viewer />} />
            
            {/* Protected Routes */}
            <Route path="management" element={<ProtectedRoute><Management /></ProtectedRoute>} />
            <Route path="management/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="management/vector-generation" element={<ProtectedRoute><VectorGeneration /></ProtectedRoute>} />
            <Route path="management/map-styles" element={<ProtectedRoute><MapStyles /></ProtectedRoute>} />
            <Route path="management/tile-server-config" element={<ProtectedRoute><TileServerConfig /></ProtectedRoute>} />
            <Route path="management/database-editor" element={<ProtectedRoute><DatabaseEditor /></ProtectedRoute>} />
            
            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;