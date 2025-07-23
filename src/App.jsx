import React, { useState, useEffect, useCallback, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ChatRoomPage from './pages/ChatRoomPage.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx';
import './App.css'; // Import App.css for global styles

// Create a UserContext to manage user state globally
export const UserContext = createContext(null);

function App() {
  // Try to load user and token from localStorage on initial load
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true); // To manage initial auth check

  // Function to update user and token, and store in localStorage
  const updateUserAndToken = useCallback((userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
    if (userToken) {
      localStorage.setItem('token', userToken);
    } else {
      localStorage.removeItem('token');
    }
  }, []);

  // Effect to re-authenticate or clear user if token is invalid
  useEffect(() => {
    const verifyUser = async () => {
      setIsLoading(false);
    };
    verifyUser();
  }, [token]);


  if (isLoading) {
    return <div className="loading-screen">Loading application...</div>;
  }

  // Access Vite env variables using import.meta.env
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    console.error("VITE_BACKEND_URL is not defined in your .env file!");
    return <div className="error-screen">Configuration Error: Backend URL missing.</div>;
  }

  return (
    <Router>
      <UserContext.Provider value={{ user, token, updateUserAndToken }}>
        <SocketProvider backendUrl={backendUrl}>
          <div className="app-container">
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
              <Route path="/room/:roomId" element={user ? <ChatRoomPage /> : <Navigate to="/auth" />} />
              {/* Fallback for unknown routes */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </SocketProvider>
      </UserContext.Provider>
    </Router>
  );
}

export default App;