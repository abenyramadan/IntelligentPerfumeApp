import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import LandingPage from "./LandingPage";
import HomePage from "./HomePage";
import ProfilePage from "./ProfilePage";
import RecommendationsPage from "./RecommendationsPage";
import HistoryPage from "./HistoryPage";
import QuestionnairePage from "./QuestionnairePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Dashboard from "./dashboard/dashboard";
import { Toaster } from "sonner";


function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  // Admin-only route wrapper
  const AdminRoute = ({ children }) => {
    if (!isAuthenticated || user?.role !== "admin") {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />
        {/* Protected routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout} user={user}>
                <HomePage user={user} />
              </Layout>
            ) : (
              <LandingPage />
            )
          }
        />
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout} user={user}>
                <HomePage user={user} />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout} user={user}>
                <ProfilePage user={user} />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/recommendations"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout} user={user}>
                <RecommendationsPage user={user} />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/history"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout} user={user}>
                <HistoryPage user={user} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/questionnaire"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout} user={user}>
                <QuestionnairePage user={user} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Admin dashboard route */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
