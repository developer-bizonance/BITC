import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../utils';

// 1. Yahan apne logo ka path daal de (e.g., logo.png ya logo.svg)
// Using BITC logo from public directory

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Remove # from URL
  React.useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(`${getApiUrl()}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard'); 
      } else {
        setError(data.error || 'Invalid email or password!');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEF2F7] p-4 overflow-hidden relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Background Shapes */}
      <div className="absolute top-[-5%] right-[-5%] w-80 h-80 bg-[#DCE4F0] rounded-full -z-10 opacity-60" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#E3E8F0] rounded-full -z-10 opacity-60" />

      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden relative border border-white/40">
        
        {/* Left Side: Branding */}
        <div className="w-full md:w-5/12 px-10 py-14 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/40">
          <div className="mb-5">
            {/* BITC Logo */}
            <img 
              src="/BITC.svg" 
              alt="BITC Logo" 
              className="w-24 h-auto object-contain"
            />
          </div>
          
          <h1 className="text-2xl font-semibold text-[#333333] mb-1.5">Sign in to Dashboard</h1>
          <p className="text-sm text-gray-400 font-normal">Use your Login Credentials</p>
          
          {error && <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>}
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 px-10 py-14 flex flex-col justify-center">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <label className="absolute -top-3 left-3 px-2 text-xs font-medium text-gray-500 z-10 bg-[#F8FAFC] rounded-sm">
                Email
              </label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-gray-700 transition-colors"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-3 left-3 px-2 text-xs font-medium text-gray-500 z-10 bg-[#F8FAFC] rounded-sm">
                Password
              </label>
              <div className="relative">
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-gray-700 transition-colors"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#D1E3F8] hover:bg-[#bbd4f0] text-[#1E4E8C] font-semibold py-3 rounded-md transition-all shadow-sm active:scale-[0.98] hover:shadow-md"
            >
              Login
            </button>
          </form>
        </div>

        {/* Bottom Three-Color Strip */}
        <div className="absolute bottom-0 left-0 w-full h-[5px] flex">
          <div className="h-full w-1/3 bg-[#FFD700]"></div> 
          <div className="h-full w-1/3 bg-[#002BBD]"></div> 
          <div className="h-full w-1/3 bg-[#E31E24]"></div> 
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
