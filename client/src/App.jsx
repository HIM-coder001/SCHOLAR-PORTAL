import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PastPapers from "./pages/PastPapers";
import AIAssistant from "./pages/AIAssistant";
import Notes from "./pages/Notes";
import Bookmarks from "./pages/Bookmarks";
import Downloads from "./pages/Downloads";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Projects from "./pages/Projects";

// Route guard component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page and store source path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Pages */}
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/past-papers" 
        element={<ProtectedRoute><PastPapers /></ProtectedRoute>} 
      />
      <Route 
        path="/resources" 
        element={<ProtectedRoute><PastPapers /></ProtectedRoute>} 
      />
      <Route 
        path="/ai-assistant" 
        element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} 
      />
      <Route 
        path="/notes" 
        element={<ProtectedRoute><Notes /></ProtectedRoute>} 
      />
      <Route 
        path="/projects" 
        element={<ProtectedRoute><Projects /></ProtectedRoute>} 
      />
      <Route 
        path="/bookmarks" 
        element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} 
      />
      <Route 
        path="/downloads" 
        element={<ProtectedRoute><Downloads /></ProtectedRoute>} 
      />
      <Route 
        path="/profile" 
        element={<ProtectedRoute><Profile /></ProtectedRoute>} 
      />
      <Route 
        path="/settings" 
        element={<ProtectedRoute><Settings /></ProtectedRoute>} 
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;