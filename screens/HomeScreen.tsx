import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Sun, Power, Zap, Leaf, ChevronRight, Droplets, X, ArrowLeft, Lightbulb, PieChart, CloudRain, Info } from 'lucide-react';
import { Card, QuickAction } from '../components/UIComponents';
import { Device } from '../types';

const data = [
  { name: 'Yesterday', kwh: 12.5 },
  { name: 'Today', kwh: 14.2 },
];

interface HomeScreenProps {
  devices: Device[];
  onGlobalAction: (action: 'ALL_ON' | 'ALL_OFF' | 'ECO_MODE') => void;
  onOpenChat: (scenario: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ devices, onGlobalAction, onOpenChat }) => {
  const [showEnergyDetails, setShowEnergyDetails] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<{title: string, desc: string} | null>(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [showHumidityPopup, setShowHumidityPopup] = useState(false);
  const bannerScrollRef = useRef<HTMLDivElement>(null);

  // Derive state for button active look
  const allOn = devices.every(d => d.mode === 'ON');
  const allOff = devices.every(d => d.mode === 'OFF');
  const ecoMode = devices.every(d => d.mode === 'ECO');

  const banners = [
    {
       id: 1,
       icon: Droplets,
       iconColor: 'text-primary',
       bg: 'bg-blue-50',
       title: "AC Cleaning",
       short: "Professional service. 20% off.",
       full: "Book a professional AC cleaning service today and get 20% off! Regular cleaning improves air quality and reduces energy consumption by up to 15%."
    },
    {
       id: 2,
       icon: Leaf,
       iconColor: 'text-green-600',
       bg: 'bg-green-50',
       title: "Smart Air Filter",
       short: "Improve your health today.",
       full: "Upgrade to our new HEPA Smart Filters. They trap 99.9% of dust and allergens, ensuring your family breathes clean, fresh air all day long."
    },
    {
       id: 3,
       icon: Zap,
       iconColor: 'text-yellow-600',
       bg: 'bg-yellow-50',
       title: "Energy Saver",
       short: "Tips to save 10% more.",
       full: "Did you know? Switching to Eco Mode during the night can save you up to 10% on your monthly bill without compromising comfort."
    }
  ];

  const handleScroll = () => {
    if (bannerScrollRef.current) {
      const scrollLeft = bannerScrollRef.current.scrollLeft;
      const width = bannerScrollRef.current.offsetWidth;
      const index = Math.round(scrollLeft / (width * 0.8)); // Approx based on card width
      setActiveBannerIndex(Math.min(index, banners.length - 1));
    }
  };

  const handleWhatsThatClick = () => {
    setShowHumidityPopup(false);
    onOpenChat('HUMIDITY');
  };

  // --- SUB-SCREEN: ENERGY DETAILS ---
  if (showEnergyDetails) {
    const deviceUsage = [
      { name: 'Living Room AC', kwh: 8.5, percent: 60, color: 'bg-primary' },
      { name: 'Kitchen Fridge', kwh: 3.5, percent: 25, color: 'bg-blue-400' },
      { name: 'Smart Washer', kwh: 1.2, percent: 8, color: 'bg-cyan-400' },
      { name: 'Master Bedroom TV', kwh: 1.0, percent: 7, color: 'bg-indigo-300' },
    ];

    return (
      <div className="space-y-6 pb-24 h-full flex flex-col animate-fade-in">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowEnergyDetails(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Energy Consumption</h1>
        </div>

        {/* Big Summary Card */}
        <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden shrink-0">
           <div className="absolute -left-4 -bottom-4 opacity-10">
              <PieChart size={120} />
           </div>
           <p className="text-blue-200 text-sm font-medium uppercase mb-1">Total Today</p>
           <h2 className="text-5xl font-bold tracking-tight">14.2 <span className="text-xl font-normal opacity-80">kWh</span></h2>
           <p className="text-sm mt-2 opacity-90">+1.7 kWh vs Yesterday</p>
        </div>

        {/* Breakdown List */}
        <div className="flex-1 space-y-4 overflow-y-auto">
           <h3 className="font-bold text-gray-800 text-lg">Breakdown by Device</h3>
           {deviceUsage.map((d, i) => (
             <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex-1">
                   <div className="flex justify-between items-end mb-1">
                      <span className="font-semibold text-gray-700 text-sm">{d.name}</span>
                      <span className="font-bold text-gray-900">{d.kwh} kWh</span>
                   </div>
                   <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${d.color}`} style={{ width: `${d.percent}%` }} />
                   </div>
                </div>
                <div className="ml-4 text-xs font-bold text-gray-400 w-8 text-right">
                  {d.percent}%
                </div>
             </div>
           ))}
        </div>

        {/* Saving Tip - Green Background */}
        <div className="mt-auto bg-green-50 border border-green-200 rounded-xl p-5 flex gap-4 items-start shrink-0">
           <div className="bg-green-100 text-green-700 p-2 rounded-full mt-0.5">
              <Lightbulb size={20} />
           </div>
           <div>
              <h4 className="font-bold text-green-800 mb-1">Energy Saving Tip</h4>
              <p className="text-sm text-green-700 leading-relaxed">
                Your AC consumes <span className="font-bold">60%</span> of total energy. Setting the temperature to 26°C can save you up to <span className="font-bold">10%</span> on electricity.
              </p>
           </div>
        </div>
      </div>
    );
  }

  // --- MAIN HOME SCREEN ---
  return (
    <div className="space-y-6 pb-24 relative">
      {/* Header / Greeting */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hello, Bich</h1>
          <div className="flex items-center gap-2 text-gray-500 mt-1">
            <Sun className="text-yellow-500" size={18} />
            <span className="text-sm">It's 35°C outside. Turning on AC is recommended.</span>
          </div>
        </div>
      </div>

      {/* Hero: Energy Monitor Widget */}
      <Card className="bg-gradient-to-br from-primary to-blue-700 text-white border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Zap size={100} />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">Energy Monitor</h2>
              <p className="text-blue-100 text-sm">Today vs Yesterday</p>
            </div>
            <button 
              onClick={() => setShowEnergyDetails(true)}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg text-xs backdrop-blur-sm transition-colors"
            >
              Details
            </button>
          </div>
          
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={70} tick={{ fill: 'white', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="kwh" barSize={20} radius={[0, 4, 4, 0]}>
                   {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 1 ? '#009ade' : 'rgba(255,255,255,0.3)'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm text-blue-100">
            <Leaf size={14} />
            <span>1.2 kg CO2 saved this week</span>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          <QuickAction 
            icon={Power} 
            label="Turn All On" 
            active={allOn}
            onClick={() => onGlobalAction('ALL_ON')}
          />
          <QuickAction 
            icon={Power} 
            label="Turn All Off" 
            active={allOff} 
            onClick={() => onGlobalAction('ALL_OFF')} 
          />
          <QuickAction 
            icon={Leaf} 
            label="Eco Mode" 
            active={ecoMode} 
            onClick={() => onGlobalAction('ECO_MODE')} 
          />
        </div>
      </div>

      {/* Banner Slider */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">For You</h3>
        <div 
          ref={bannerScrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory"
        >
           {banners.map((b) => (
             <div 
                key={b.id} 
                onClick={() => setSelectedBanner({title: b.title, desc: b.full})}
                className="snap-center min-w-[85%] bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 border border-gray-100 cursor-pointer active:scale-95 transition-transform"
             >
                <div className={`${b.bg} p-3 rounded-full ${b.iconColor}`}>
                  <b.icon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{b.title}</h4>
                  <p className="text-xs text-gray-500">{b.short}</p>
                </div>
                <ChevronRight className="text-gray-400" />
             </div>
           ))}
        </div>
        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-1">
          {banners.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeBannerIndex ? 'w-6 bg-primary' : 'w-1.5 bg-gray-300'}`} 
            />
          ))}
        </div>
      </div>

      {/* Today Message Banner (Moved to Bottom) */}
      <div 
        onClick={() => setShowHumidityPopup(true)}
        className="bg-primary rounded-xl p-4 text-white shadow-lg shadow-blue-500/20 cursor-pointer active:scale-95 transition-transform flex items-center gap-4 relative overflow-hidden"
      >
         <div className="absolute top-0 right-0 p-4 opacity-10">
           <CloudRain size={80} />
         </div>
         <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm shrink-0">
            <CloudRain size={24} className="text-white" />
         </div>
         <div className="relative z-10 pr-2">
            <p className="font-bold text-sm leading-tight">Ms. Bich, today's humidity is up to 90%.</p>
         </div>
         <ChevronRight size={18} className="ml-auto text-white/70" />
      </div>

      {/* Banner Modal Overlay */}
      {selectedBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
              <button 
                onClick={() => setSelectedBanner(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                 <Zap size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedBanner.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{selectedBanner.desc}</p>
              <button 
                onClick={() => setSelectedBanner(null)}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-700"
              >
                Got it
              </button>
           </div>
        </div>
      )}

      {/* Humidity Popup */}
      {showHumidityPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
             <button 
               onClick={() => setShowHumidityPopup(false)}
               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
             >
               <X size={20} />
             </button>

             <div className="mb-6 mt-2">
                <p className="text-gray-800 font-medium leading-relaxed mb-4">
                  ☔ Ms. Bich, today's humidity is up to 90%. Baby clothes are very susceptible to mold. Have you activated the antibacterial 'shield' on the washing machine?
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                  <div className="text-blue-600 mt-1"><Info size={20} /></div>
                  <div>
                    <h4 className="font-bold text-blue-900 text-sm mb-1">High Humidity Alert</h4>
                    <p className="text-xs text-blue-800 font-semibold mb-1">90% humidity detected</p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      High humidity can cause mold growth on clothes, especially baby items. It's important to use antibacterial protection during washing.
                    </p>
                  </div>
                </div>
             </div>

             <button 
               onClick={handleWhatsThatClick}
               className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20"
             >
               What's that
             </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomeScreen;
