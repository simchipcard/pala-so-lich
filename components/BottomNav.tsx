import React from 'react';
import { Home, Grid, Bell, User } from 'lucide-react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
  unreadCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, setScreen, unreadCount }) => {
  const navItems = [
    { id: Screen.HOME, icon: Home, label: 'Home' },
    { id: Screen.DEVICES, icon: Grid, label: 'Devices' },
    { id: Screen.NOTIFICATIONS, icon: Bell, label: 'Alerts', badge: unreadCount > 0 },
    { id: Screen.ACCOUNT, icon: User, label: 'Account' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-between items-end pb-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`relative flex flex-col items-center gap-1 p-2 transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.badge && (
                <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;