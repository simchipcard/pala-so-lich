
import React, { useState } from 'react';
import { Smartphone, Facebook } from 'lucide-react';
import { Button } from '../components/UIComponents';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Hardcoded credentials for Bich Tran
    if (username === 'bichtran' && password === 'panasonic123') {
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="h-full min-h-screen flex flex-col items-center justify-center p-8 font-sans animate-fade-in bg-white overflow-y-auto">
      
      <div className="w-full flex flex-col items-center max-w-sm">
        
        <div className="text-center mb-10 w-full">
            <h1 className="text-5xl font-extrabold text-primary tracking-wide mb-2 w-full leading-none uppercase">My Panasonic</h1>
            <p className="text-gray-400 text-sm mt-4">Welcome back, please login</p>
        </div>

        <div className="space-y-5 w-full">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Username</label>
            <input 
              type="text" 
              placeholder="bichtran" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-800 placeholder:text-gray-300 font-medium"
            />
          </div>
          <div>
             <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Password</label>
             <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-800 placeholder:text-gray-300 font-medium"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">{error}</p>}

          <div className="flex justify-center mt-6">
            <Button onClick={handleLogin} className="py-3 px-10 text-base rounded-2xl shadow-xl shadow-blue-500/20 w-40">
                Login
            </Button>
          </div>

          <div className="flex items-center gap-4 my-8">
             <div className="h-px bg-gray-200 flex-1"></div>
             <span className="text-gray-400 text-xs font-bold uppercase">Or login with</span>
             <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <button className="flex items-center justify-center p-3.5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
                <Smartphone className="text-gray-600" />
             </button>
             <button className="flex items-center justify-center p-3.5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
                {/* Google Icon SVG */}
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.065 0 12 0 7.31 0 3.256 2.69 1.402 6.688l3.864 3.077z"/>
                    <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-3.86 3.079C3.257 21.31 7.31 24 12 24c3.24 0 5.957-1.156 7.948-3.153l-3.908-2.834z"/>
                    <path fill="#4A90E2" d="M19.948 20.847C21.939 18.85 24 15.61 24 12c0-.85-.09-1.69-.25-2.5h-11.75v4.73h6.636a5.772 5.772 0 0 1-2.588 4.204l3.908 2.834a11.97 11.97 0 0 0 0 .013z"/>
                    <path fill="#FBBC05" d="M5.266 14.235A7.098 7.098 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.402 6.688A11.944 11.944 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l3.86-3.079z"/>
                </svg>
             </button>
             <button className="flex items-center justify-center p-3.5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
                 <Facebook className="text-[#1877F2]" />
             </button>
          </div>
        </div>
        
        <div className="text-center pt-12">
            <p className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">Version 2.4.0</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
