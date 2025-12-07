import React, { useState } from 'react';
import { Screen, Device, DeviceMode } from './types';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import DevicesScreen from './screens/DevicesScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import AccountScreen from './screens/AccountScreen';
import { ChatBot } from './components/ChatBot';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);
  
  // --- Chat State ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatScenario, setChatScenario] = useState('DEFAULT');

  const openChat = (scenario: string = 'DEFAULT') => {
    setChatScenario(scenario);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };
  
  // --- Global Device State ---
  const [activeScene, setActiveScene] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Living Room AC', type: 'AC', mode: 'ON', statusDetails: '24°C Cool', energy: '1.2 kWh' },
    { id: '2', name: 'Smart Washer', type: 'WASHER', mode: 'OFF', statusDetails: 'Ready', energy: '0.0 kWh' },
    { id: '3', name: 'Kitchen Fridge', type: 'FRIDGE', mode: 'ECO', statusDetails: '-18°C Eco', energy: '0.8 kWh' },
    { id: '4', name: 'Master Bedroom TV', type: 'TV', mode: 'OFF', statusDetails: 'Standby', energy: '0.1 kWh' },
  ]);

  // --- Handlers ---

  const toggleDeviceMode = (id: string) => {
    setActiveScene(null); // Manual override clears scene
    setDevices(prev => prev.map(d => {
      if (d.id !== id) return d;
      // Cycle: OFF -> ON -> ECO -> OFF
      let newMode: DeviceMode = 'ON';
      if (d.mode === 'OFF') newMode = 'ON';
      else if (d.mode === 'ON') newMode = 'ECO';
      else if (d.mode === 'ECO') newMode = 'OFF';
      
      return { ...d, mode: newMode };
    }));
  };

  const applyGlobalAction = (action: 'ALL_ON' | 'ALL_OFF' | 'ECO_MODE') => {
    setActiveScene(null);
    setDevices(prev => prev.map(d => {
      let newMode: DeviceMode = 'OFF';
      if (action === 'ALL_ON') newMode = 'ON';
      if (action === 'ALL_OFF') newMode = 'OFF';
      if (action === 'ECO_MODE') newMode = 'ECO';
      return { ...d, mode: newMode };
    }));
  };

  const applyScene = (sceneName: string) => {
    setActiveScene(sceneName);
    setDevices(prev => prev.map(d => {
      let newMode: DeviceMode = 'OFF';
      
      if (sceneName === 'Sleep') {
        // AC Eco, TV Off, Washer Off, Fridge Eco
        if (d.type === 'AC' || d.type === 'FRIDGE') newMode = 'ECO';
        else newMode = 'OFF';
      } else if (sceneName === 'Away') {
        // Fridge Eco, everything else Off
        if (d.type === 'FRIDGE') newMode = 'ECO';
        else newMode = 'OFF';
      } else if (sceneName === 'Home') {
        // All On (Standard)
        newMode = 'ON';
      }
      return { ...d, mode: newMode };
    }));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.HOME:
        return <HomeScreen 
          devices={devices} 
          onGlobalAction={applyGlobalAction}
          onOpenChat={openChat}
        />;
      case Screen.DEVICES:
        return <DevicesScreen 
          devices={devices} 
          onToggleDevice={toggleDeviceMode}
          activeScene={activeScene}
          onApplyScene={applyScene}
        />;
      case Screen.NOTIFICATIONS:
        return <NotificationsScreen />;
      case Screen.ACCOUNT:
        return <AccountScreen />;
      default:
        return <HomeScreen 
          devices={devices} 
          onGlobalAction={applyGlobalAction}
          onOpenChat={openChat}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-gray-900">
      <div className="max-w-md mx-auto min-h-screen bg-white relative shadow-2xl overflow-hidden flex flex-col">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-6">
          {renderScreen()}
        </main>

        {/* Floating ChatBot */}
        <ChatBot 
          isOpen={isChatOpen} 
          onClose={closeChat} 
          onOpen={() => setIsChatOpen(true)}
          scenario={chatScenario}
        />

        {/* Bottom Navigation */}
        <BottomNav 
          currentScreen={currentScreen} 
          setScreen={setCurrentScreen} 
          unreadCount={2} 
        />
      </div>
    </div>
  );
};

export default App;
