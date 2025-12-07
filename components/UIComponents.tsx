import React from 'react';
import { LucideIcon } from 'lucide-react';

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-2xl shadow-sm p-4 ${className} ${onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}>
    {children}
  </div>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', fullWidth, className = '', ...props }) => {
  const baseStyle = "py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-primary text-white shadow-md shadow-blue-900/20 active:bg-blue-800",
    secondary: "bg-secondary text-white shadow-md shadow-cyan-500/20 active:bg-cyan-600",
    outline: "border-2 border-primary text-primary bg-transparent active:bg-blue-50",
    ghost: "bg-gray-100 text-gray-700 active:bg-gray-200",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Quick Action Button (Big Icon) ---
export const QuickAction: React.FC<{ icon: LucideIcon; label: string; onClick?: () => void; active?: boolean }> = ({ icon: Icon, label, onClick, active }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-2xl w-full aspect-square transition-colors ${active ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
  >
    <Icon size={32} className="mb-2" />
    <span className="text-sm font-medium leading-tight">{label}</span>
  </button>
);

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'bg-red-500' }) => (
  <span className={`${color} text-white text-[10px] px-2 py-0.5 rounded-full absolute -top-1 -right-1 border-2 border-white`}>
    {children}
  </span>
);