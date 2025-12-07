
import React from 'react';
import { Wind, Tv, Disc, Snowflake, Moon, Sun, LogOut, Power, Leaf } from 'lucide-react';
import { Card } from '../components/UIComponents';
import { Device, DeviceMode } from '../types';

interface DevicesScreenProps {
  devices: Device[];
  activeScene: string | null;
  onToggleDevice: (id: string) => void;
  onApplyScene: (scene: string) => void;
}

const DevicesScreen: React.FC<DevicesScreenProps> = ({ devices, activeScene, onToggleDevice, onApplyScene }) => {

  const getIcon = (type: string) => {
    switch(type) {
      case 'AC': return Snowflake;
      case 'WASHER': return Disc;
      case 'FRIDGE': return Wind;
      case 'TV': return Tv;
      default: return Power;
    }
  };

  const getStatusColor = (mode: DeviceMode) => {
    switch(mode) {
      case 'ON': return 'bg-primary text-white';
      case 'ECO': return 'bg-green-500 text-white';
      case 'OFF': return 'bg-gray-100 text-gray-400';
    }
  };

  const scenes = [
    { id: 'Home', icon: Sun, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { id: 'Sleep', icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 'Away', icon: LogOut, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-gray-800">My Devices</h1>

      {/* Smart Scenes */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
        {scenes.map((scene) => {
           const isActive = activeScene === scene.id;
           return (
            <button 
              key={scene.id} 
              onClick={() => onApplyScene(scene.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full whitespace-nowrap font-medium transition-all duration-200 border
                ${isActive 
                  ? `${scene.bg} ${scene.color} border-${scene.color.split('-')[1]}-200 shadow-md transform scale-105` 
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
            >
              <scene.icon size={18} />
              {scene.id}
            </button>
           );
        })}
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-2 gap-4">
        {devices.map((device) => {
          const Icon = getIcon(device.type);
          const isOff = device.mode === 'OFF';
          
          return (
            <Card key={device.id} className={`flex flex-col justify-between aspect-[4/5] p-5 transition-all duration-300 ${!isOff ? 'border-2 border-primary/20 shadow-md' : 'border border-transparent'}`}>
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-full transition-colors ${getStatusColor(device.mode)}`}>
                  <Icon size={24} />
                </div>
                
                {/* 3-State Toggle Visual */}
                <div 
                  className="relative flex flex-col items-center cursor-pointer" 
                  onClick={() => onToggleDevice(device.id)}
                >
                    <div className={`w-12 h-6 rounded-full border-2 transition-colors duration-300 relative
                      ${device.mode === 'ON' ? 'bg-primary border-primary' : 
                        device.mode === 'ECO' ? 'bg-green-500 border-green-500' : 'bg-gray-200 border-gray-300'}
                    `}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300
                           ${device.mode === 'OFF' ? 'left-1' : 'translate-x-[26px]'}
                        `}/>
                    </div>
                    <span className="text-[10px] font-bold mt-1 uppercase text-gray-400">
                        {device.mode}
                    </span>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{device.name}</h3>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${device.mode === 'OFF' ? 'bg-gray-300' : device.mode === 'ECO' ? 'bg-green-500' : 'bg-primary'}`} />
                  <p className={`text-sm font-medium ${!isOff ? 'text-gray-600' : 'text-gray-400'}`}>
                    {device.statusDetails}
                  </p>
                </div>
                {device.mode === 'ECO' && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-green-600 font-semibold animate-pulse">
                     <Leaf size={10} /> Saving Energy
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DevicesScreen;
