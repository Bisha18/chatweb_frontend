import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../api/auth';
import { UserContext } from '../App.jsx';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const { updateUserAndToken } = useContext(UserContext);

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
        navigate('/');
      } else {
        const data = await signup(username, email, password);
        setSuccessMessage('Registration successful! Please log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  const handleGuestLogin = () => {
    if (!email.trim()) {
      setError('Please enter an email/username to proceed as guest.');
      return;
    }
    updateUserAndToken({ id: `guest-${Date.now()}`, email: email.trim(), isGuest: true }, null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[--color-brutal-yellow] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8 animate-[slideInUp_0.5s_ease-out]">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 transform -rotate-2">
            <span className="inline-block bg-[--color-brutal-pink] brutal-border brutal-shadow-lg px-6 py-3">
              CHAT
            </span>
          </h1>
          <p className="text-xl font-bold uppercase tracking-wider">
            Connect. Talk. Vibe. 💬
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-[--color-brutal-white] brutal-border brutal-shadow-xl p-6 sm:p-8 animate-[slideInUp_0.6s_ease-out]">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 font-bold text-lg uppercase brutal-border transition-all duration-200 ${
                isLogin
                  ? 'bg-[--color-brutal-blue] brutal-shadow-md translate-x-0 translate-y-0'
                  : 'bg-[--color-brutal-gray] hover:translate-x-[2px] hover:translate-y-[2px]'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 font-bold text-lg uppercase brutal-border transition-all duration-200 ${
                !isLogin
                  ? 'bg-[--color-brutal-green] brutal-shadow-md translate-x-0 translate-y-0'
                  : 'bg-[--color-brutal-gray] hover:translate-x-[2px] hover:translate-y-[2px]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-[--color-brutal-pink] brutal-border brutal-shadow-sm animate-[shake_0.5s_ease]">
              <p className="font-bold text-sm uppercase">❌ {error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-[--color-brutal-green] brutal-border brutal-shadow-sm animate-[slideInUp_0.5s_ease]">
              <p className="font-bold text-sm uppercase">✅ {successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-bold uppercase mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={!isLogin}
                  className="w-full px-4 py-3 brutal-border bg-[--color-brutal-gray] font-medium focus:outline-none focus:bg-white focus:brutal-shadow-md transition-all duration-200"
                  placeholder="cooluser123"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-bold uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 brutal-border bg-[--color-brutal-gray] font-medium focus:outline-none focus:bg-white focus:brutal-shadow-md transition-all duration-200"
                placeholder="you@awesome.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 brutal-border bg-[--color-brutal-gray] font-medium focus:outline-none focus:bg-white focus:brutal-shadow-md transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-[--color-brutal-pink] brutal-border brutal-shadow-lg font-black text-xl uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_var(--color-brutal-black)] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none transition-all duration-100"
            >
              {isLogin ? '→ Login' : '→ Sign Up'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t-4 border-dashed border-[--color-brutal-black]">
            <button
              onClick={handleGuestLogin}
              className="w-full py-3 px-6 bg-[--color-brutal-yellow] brutal-border brutal-shadow-md font-bold text-lg uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_var(--color-brutal-black)] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none transition-all duration-100"
            >
              👻 Guest Mode
            </button>
            <p className="text-xs text-center mt-3 font-medium uppercase opacity-70">
              No registration needed
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 opacity-80">
          <p className="text-sm font-bold uppercase">
            Made with ⚡ and ☕
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;