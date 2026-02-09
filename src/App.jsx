import { useState, useEffect, useCallback, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ChatRoomPage from './pages/ChatRoomPage.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx';
import './App.css';

export const UserContext = createContext(null);

function App() {
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
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const verifyUser = async () => {
      setIsLoading(false);
    };
    verifyUser();
  }, [token]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="flex flex-col items-center gap-6">
          <div className="text-6xl font-black">⚡</div>
          <div className="text-2xl font-bold">LOADING...</div>
        </div>
      </div>
    );
  }

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    console.error("VITE_BACKEND_URL is not defined in your .env file!");
    return (
      <div className="error-screen">
        <div className="brutal-border brutal-shadow-lg bg-[--color-brutal-pink] px-8 py-6">
          <h1 className="text-3xl font-black">ERROR!</h1>
          <p className="mt-2">Backend URL missing</p>
        </div>
      </div>
    );
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
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </SocketProvider>
      </UserContext.Provider>
    </Router>
  );
}

export default App;