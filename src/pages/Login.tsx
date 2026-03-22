import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { validateCredentials } from '../lib/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = validateCredentials(username, password);

    if (user) {
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('username', username);
      navigate(user.role === 'admin' ? '/admin' : '/owner');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-[#754052] via-[#754052] to-[#754052]">
      {/* Centered Login Card */}
      <div className="w-full max-w-[420px] bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl p-8 md:p-10 flex flex-col items-center animate-in fade-in zoom-in duration-300">

        {/* Logo Section */}
        <div className="w-20 h-20 bg-pink-500 rounded-full p-0.5 mb-6 ring-8 ring-pink-100/50 shadow-inner">
          <div className="w-full h-full bg-white rounded-full overflow-hidden flex items-center justify-center">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Love, Xoxo Access</h1>
          <p className="text-[13px] text-gray-500 font-medium mt-1">Inventory & Sales Management</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full space-y-5">
          {error && (
            <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase ml-4">Username</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#ee6996] transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-pink-50/30 border-2 border-pink-100/30 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all text-gray-700"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase ml-4">Password</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#ee6996] transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-pink-50/30 border-2 border-pink-100/30 rounded-2xl pl-11 pr-12 py-3.5 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all text-gray-700"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#ee6996] to-[#fc4e8d] hover:from-[#d55a84] hover:to-[#e1407a] text-white py-4 rounded-2xl font-bold text-md shadow-xl shadow-pink-200/50 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
          >
            Sign In
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-8 text-center space-y-1">
          <p className="text-[10px] font-semibold text-gray-400">Owner: @xzelise (Telegram)</p>
          <p className="text-[10px] font-semibold text-gray-400">Channel: @xoxoelisee</p>
        </div>
      </div>
    </div>
  );
}
