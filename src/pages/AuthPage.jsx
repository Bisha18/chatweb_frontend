import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../api/auth';
import { UserContext } from '../App.jsx'; // Import UserContext

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const { updateUserAndToken } = useContext(UserContext); // Use context to update user state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !password || (!isLogin && !username)) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      if (isLogin) {
        const data = await login(email, password);
        updateUserAndToken({ id: data.userId, email: data.email }, data.token);
        navigate('/'); // Redirect to home page
      } else {
        const data = await signup(username, email, password);
        setSuccessMessage('Registration successful! Please log in.');
        setIsLogin(true); // Switch to login form after successful signup
        // Optionally auto-login: updateUserAndToken({ id: data.userId, email: data.email }, data.token); navigate('/');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  const handleGuestLogin = () => {
    // For guest mode, we just need a username/email to identify them in chat.
    // No backend auth needed.
    if (!email.trim()) {
      setError('Please enter an email/username to proceed as guest.');
      return;
    }
    // Simulate guest user data
    updateUserAndToken({ id: `guest-${Date.now()}`, email: email.trim(), isGuest: true }, null);
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
        <p>
          Or{' '}
          <button onClick={handleGuestLogin}>
            Continue as Guest
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;