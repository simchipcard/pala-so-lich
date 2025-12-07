
import React, { useState, useRef } from 'react';
import { User, Award, ShieldCheck, Headphones, Share2, ChevronRight, ChevronLeft, QrCode, ArrowLeft, Calendar, FileText, CheckCircle, CreditCard, Smartphone, Tv, Wind, Snowflake, Disc, Coins, Ticket, Sparkles, Gift, Phone, Percent, X, Play } from 'lucide-react';
import { Card, Button } from '../components/UIComponents';
import SupportFlow from './SupportFlow';

type AccountView = 'MAIN' | 'SUPPORT' | 'WARRANTY' | 'COINS' | 'BENEFITS';

const AccountScreen: React.FC = () => {
  const [view, setView] = useState<AccountView>('MAIN');
  const [showRefQR, setShowRefQR] = useState(false);
  const [shareModal, setShareModal] = useState<'APPSTORE' | 'PLAYSTORE' | null>(null);

  // --- COINS / LOYALTY VIEW COMPONENT ---
  const CoinsView = () => {
    const vouchers = [
      { 
        id: 1, 
        title: "2,500,000 VND Discount", 
        desc: "For Washing Machine purchases over 10,000,000 VND", 
        cost: 7500 
      },
      { 
        id: 2, 
        title: "20% Off Voucher", 
        desc: "Trade-in upgrade voucher - Up to 6,000,000 VND discount on purchases over 20,000,000 VND", 
        cost: 15000 
      },
      { 
        id: 3, 
        title: "1,000,000 VND Discount", 
        desc: "For kitchen appliances - purchases over 5,000,000 VND", 
        cost: 3000 
      },
      { 
        id: 4, 
        title: "7,500,000 VND Discount", 
        desc: "For Refrigerator purchases over 30,000,000 VND", 
        cost: 22500 
      },
    ];

    return (
      <div className="h-full flex flex-col pb-24 animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setView('MAIN')}><ArrowLeft className="text-gray-600" /></button>
          <h1 className="text-2xl font-bold text-gray-800">Panasonic Coins</h1>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Coins size={100} />
          </div>
          <div className="relative z-10 text-center">
             <p className="text-blue-200 text-sm font-medium uppercase tracking-wider mb-2">Your Balance</p>
             <h2 className="text-4xl font-extrabold mb-1">87,920</h2>
             <p className="font-medium opacity-90">Panasonic Coins</p>
             <div className="mt-4 inline-block bg-white/20 px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                1,000 VND = 1 Panasonic Coin
             </div>
          </div>
        </div>

        {/* Vouchers List */}
        <div className="space-y-4">
           <h3 className="font-bold text-gray-800 text-lg px-1">Available Vouchers</h3>
           {vouchers.map((v) => (
             <Card key={v.id} className="flex flex-col gap-3 p-5 border border-gray-100 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-4">
                   <div className="bg-orange-100 text-orange-600 p-3 rounded-xl">
                      <Ticket size={24} />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg leading-tight">{v.title}</h4>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">{v.desc}</p>
                   </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-1">
                   <div className="text-primary font-bold text-sm flex items-center gap-1">
                      <Coins size={14} /> {v.cost.toLocaleString()} Coins
                   </div>
                   <button className="bg-primary text-white text-xs font-bold py-2 px-4 rounded-lg shadow-md shadow-blue-500/20 active:scale-95 transition-transform">
                      Claim Voucher
                   </button>
                </div>
             </Card>
           ))}
        </div>
      </div>
    );
  };

  // --- BENEFITS VIEW COMPONENT ---
  const BenefitsView = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollNext = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: scrollRef.current.offsetWidth * 0.9, behavior: 'smooth' });
      }
    };

    const scrollPrev = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: -scrollRef.current.offsetWidth * 0.9, behavior: 'smooth' });
      }
    };

    const tiers = [
      {
        id: 'silver',
        name: 'Silver',
        bg: 'bg-gradient-to-br from-gray-300 to-gray-400',
        text: 'text-gray-800',
        subtext: 'text-gray-700',
        status: 'Passed Tier',
        statusDesc: 'You have already passed this tier',
        benefits: [
          { icon: Percent, label: 'Points accumulation', val: '1% of order value' },
          { icon: ShieldCheck, label: 'Warranty', val: 'Standard' },
          { icon: Headphones, label: 'Customer service response', val: 'Within 24 hours' },
          { icon: Sparkles, label: 'Cleaning / Maintenance service', val: 'List price' },
          { icon: Gift, label: 'Birthday gift', val: 'Voucher 100k' },
          { icon: Calendar, label: 'Product launch events', val: 'Invited via Email' },
        ]
      },
      {
        id: 'gold',
        name: 'Gold',
        bg: 'bg-gradient-to-br from-[#FFD700] to-[#E6C200]',
        text: 'text-yellow-900',
        subtext: 'text-yellow-800',
        status: 'Current Tier',
        statusDesc: 'You have unlocked these benefits',
        benefits: [
          { icon: Percent, label: 'Points accumulation', val: '2% of order value' },
          { icon: ShieldCheck, label: 'Warranty', val: '+3 months' },
          { icon: Headphones, label: 'Customer service response', val: 'Priority (Within 4 hours)' },
          { icon: Sparkles, label: 'Cleaning / Maintenance service', val: '20% discount' },
          { icon: Gift, label: 'Birthday gift', val: 'Voucher 500k' },
          { icon: Smartphone, label: 'Product launch events', val: 'Invited via App' },
        ]
      },
      {
        id: 'platinum',
        name: 'Platinum',
        bg: 'bg-gradient-to-br from-slate-800 to-slate-900',
        text: 'text-white',
        subtext: 'text-gray-300',
        status: 'Spend 2.080.000 VND',
        statusDesc: 'more to unlock this tier',
        benefits: [
          { icon: Percent, label: 'Points accumulation', val: '5% of order value' },
          { icon: ShieldCheck, label: 'Warranty', val: '+6 months' },
          { icon: Phone, label: 'Customer service response', val: 'Dedicated hotline (24/7)' },
          { icon: Sparkles, label: 'Cleaning / Maintenance service', val: 'Free once per year' },
          { icon: Gift, label: 'Birthday gift', val: 'Premium physical gift' },
          { icon: Ticket, label: 'Product launch events', val: 'VIP invitation ticket' },
        ]
      },
    ];

    return (
      <div className="h-full flex flex-col pb-24 animate-fade-in relative">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setView('MAIN')}><ArrowLeft className="text-gray-600" /></button>
          <h1 className="text-2xl font-bold text-gray-800">My Benefits</h1>
        </div>

        {/* Floating Navigation Arrows */}
        <div className="absolute top-1/2 left-0 right-0 -mt-10 flex justify-between px-2 pointer-events-none z-20">
            <button onClick={scrollPrev} className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-gray-800 shadow-sm pointer-events-auto transition-all">
                <ChevronLeft size={24} />
            </button>
            <button onClick={scrollNext} className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-gray-800 shadow-sm pointer-events-auto transition-all">
                <ChevronRight size={24} />
            </button>
        </div>

        <div 
            ref={scrollRef}
            className="flex-1 overflow-x-auto snap-x snap-mandatory flex gap-4 no-scrollbar pb-6 px-1"
        >
          {tiers.map((tier) => (
            <div key={tier.id} className="snap-center min-w-[90%] flex flex-col">
              <Card className={`${tier.bg} ${tier.text} border-none shadow-xl h-full flex flex-col relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <Award size={120} />
                </div>
                
                {/* Header */}
                <div className="relative z-10 mb-6">
                   <span className="font-bold tracking-widest text-xs uppercase opacity-80">Panasonic</span>
                   <h2 className="text-4xl font-extrabold mt-1 tracking-tight">{tier.name}</h2>
                   <div className="mt-4 bg-white/20 backdrop-blur-md rounded-xl p-3 inline-block w-full">
                      <p className="text-xs font-bold uppercase tracking-wider opacity-80">{tier.status}</p>
                      <p className="text-sm font-medium mt-1">{tier.statusDesc}</p>
                   </div>
                </div>

                {/* Benefits List */}
                <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex-1 overflow-y-auto">
                   <h3 className="font-bold text-sm uppercase tracking-wider mb-4 opacity-90 flex items-center gap-2">
                     <Award size={16}/> Benefits
                   </h3>
                   <div className="space-y-4">
                     {tier.benefits.map((b, idx) => (
                       <div key={idx} className="flex items-start gap-3">
                         <div className="bg-white/20 p-1.5 rounded-lg mt-0.5">
                            <b.icon size={14} />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold uppercase opacity-70 mb-0.5">{b.label}</p>
                            <p className="text-sm font-semibold">{b.val}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- WARRANTY VIEW COMPONENT ---
  const WarrantyList = () => {
    const warranties = [
      {
        id: 1,
        device: "Living-room air conditioner",
        model: "Panasonic 1.5 HP — CU/CS-U12ZKH-8",
        icon: Snowflake,
        color: "text-blue-500",
        bg: "bg-blue-50",
        type: "Extended Warranty (3 years)",
        serial: "AC2023081245",
        purchaseDate: "August 15, 2023",
        validUntil: "August 15, 2026",
        coverage: ["Parts & Labor Coverage", "Free Annual Maintenance", "24/7 Technical Support"],
        price: "13,550,000 VND"
      },
      {
        id: 2,
        device: "Washing machine",
        model: "Panasonic NA-S96FR1BVT — washer-dryer",
        icon: Disc,
        color: "text-cyan-500",
        bg: "bg-cyan-50",
        type: "Extended Warranty (3 years)",
        serial: "WM2023072189",
        purchaseDate: "July 20, 2023",
        validUntil: "July 20, 2026",
        coverage: ["Parts & Labor Coverage", "Motor Lifetime Warranty", "Priority Service Support"],
        price: "19,490,000 VND"
      },
      {
        id: 3,
        device: "Refrigerator",
        model: "Panasonic NR-YW590XJKV — 540 L PRIME+",
        icon: Wind,
        color: "text-green-500",
        bg: "bg-green-50",
        type: "Extended Warranty (3 years)",
        serial: "RF2023091034",
        purchaseDate: "September 10, 2023",
        validUntil: "September 10, 2026",
        coverage: ["Parts & Labor Coverage", "Compressor 10-Year Warranty", "Free Installation & Setup"],
        price: "44,890,000 VND"
      },
      {
        id: 4,
        device: "Smart TV",
        model: "Panasonic TH-43MX650V — 43\" 4K Google TV",
        icon: Tv,
        color: "text-indigo-500",
        bg: "bg-indigo-50",
        type: "Extended Warranty (3 years)",
        serial: "TV2023060512",
        purchaseDate: "June 5, 2023",
        validUntil: "June 5, 2026",
        coverage: ["Parts & Labor Coverage", "Panel Replacement Coverage", "On-Site Service Available"],
        price: "9,990,000 VND"
      }
    ];

    return (
      <div className="h-full flex flex-col pb-24 animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setView('MAIN')}><ArrowLeft className="text-gray-600" /></button>
          <h1 className="text-2xl font-bold text-gray-800">E-Warranty</h1>
        </div>

        <div className="space-y-6">
          {warranties.map((item) => (
            <Card key={item.id} className="border border-gray-100 overflow-hidden relative">
               {/* Status Badge */}
               <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                 <CheckCircle size={10} /> ACTIVE
               </div>

               {/* Header */}
               <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-full ${item.bg} ${item.color}`}>
                    <item.icon size={24} />
                  </div>
                  <div className="pr-16">
                    <h3 className="font-bold text-gray-900 leading-tight">{item.device}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.model}</p>
                    <div className="inline-block bg-primary/5 text-primary text-[10px] font-bold px-2 py-0.5 rounded mt-2">
                       {item.type}
                    </div>
                  </div>
               </div>

               {/* Info Grid */}
               <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-3 mb-4">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Serial Number</span>
                    <span className="text-xs font-mono font-medium text-gray-700">{item.serial}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Purchase Price</span>
                    <span className="text-xs font-medium text-gray-700">{item.price}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Purchased</span>
                    <span className="text-xs font-medium text-gray-700">{item.purchaseDate}</span>
                  </div>
                   <div>
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Valid Until</span>
                    <span className="text-xs font-bold text-primary">{item.validUntil}</span>
                  </div>
               </div>

               {/* Coverage */}
               <div className="mb-2">
                 <h4 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1">
                   <ShieldCheck size={12} className="text-gray-400"/> Coverage Details
                 </h4>
                 <ul className="space-y-1">
                   {item.coverage.map((detail, idx) => (
                     <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                       <div className="w-1 h-1 rounded-full bg-gray-300" />
                       {detail}
                     </li>
                   ))}
                 </ul>
               </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---

  if (view === 'SUPPORT') {
    return <SupportFlow onBack={() => setView('MAIN')} />;
  }

  if (view === 'WARRANTY') {
    return <WarrantyList />;
  }

  if (view === 'COINS') {
    return <CoinsView />;
  }

  if (view === 'BENEFITS') {
    return <BenefitsView />;
  }

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Profile Header */}
      <div className="flex items-center gap-4 pt-4">
         <div className="w-20 h-20 bg-gray-100 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
             <User size={40} className="text-gray-400" />
         </div>
         <div>
            <h1 className="text-2xl font-bold text-gray-800">Bich Tran</h1>
            <p className="text-xs text-gray-500 mt-1">Member since June 2023</p>
         </div>
      </div>

      {/* Panasonic Coins Section */}
      <Card onClick={() => setView('COINS')} className="bg-white border border-gray-100 p-5 cursor-pointer active:scale-95 transition-transform hover:border-primary/50 relative">
         <div className="flex flex-col">
            <h3 className="text-gray-600 font-bold text-sm uppercase tracking-wide flex items-center gap-2">
              Panasonic Coins <ChevronRight size={14} className="text-gray-400" />
            </h3>
            <p className="text-3xl font-bold text-primary mt-1">87,920</p>
         </div>
         <div className="absolute top-5 right-5 text-primary/10">
            <Coins size={40} />
         </div>
      </Card>

      {/* Member Tier Card */}
      <Card className="bg-gradient-to-br from-[#FFD700] to-[#E6C200] text-yellow-900 border-none shadow-lg shadow-yellow-500/20 relative overflow-hidden h-48 flex flex-col justify-between p-6">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <Award size={100} />
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
             <div>
               <span className="font-bold tracking-widest text-xs uppercase opacity-80">Panasonic</span>
               <h2 className="text-4xl font-extrabold mt-1 tracking-tight">Gold</h2>
             </div>
             
             <div className="space-y-3">
               <p className="text-xs font-semibold opacity-90">Spend 2.080.000 VND more to unlock Platinum tier</p>
               
               <button 
                onClick={() => setView('BENEFITS')}
                className="flex justify-between items-center w-full border-t border-yellow-900/10 pt-3 cursor-pointer hover:opacity-80 transition-opacity text-left"
               >
                  <span className="text-sm font-bold">View Tier Benefits</span>
                  <ChevronRight size={18} />
               </button>
             </div>
          </div>
      </Card>

      {/* Menu List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
         <button 
           onClick={() => setView('WARRANTY')}
           className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
         >
            <div className="text-blue-500"><ShieldCheck size={20} /></div>
            <span className="flex-1 text-left font-medium text-gray-800">E-Warranty</span>
            <ChevronRight size={16} className="text-gray-400" />
         </button>
         
         <button 
           onClick={() => setView('SUPPORT')}
           className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
         >
            <div className="text-primary"><Headphones size={20} /></div>
            <span className="flex-1 text-left font-medium text-gray-800">Support & Complaints</span>
            <ChevronRight size={16} className="text-gray-400" />
         </button>

         <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
            <div className="text-gray-500"><User size={20} /></div>
            <span className="flex-1 text-left font-medium text-gray-800">Account Settings</span>
            <ChevronRight size={16} className="text-gray-400" />
         </button>
      </div>

      {/* Refer a Friend Section */}
      <div className="bg-gradient-to-r from-secondary to-blue-400 rounded-2xl p-6 text-white flex items-center justify-between shadow-lg shadow-blue-400/20">
         <div>
            <h3 className="font-bold text-lg">Refer a Friend</h3>
            <p className="text-sm opacity-90">Earn 15,000 coins for each referral</p>
         </div>
         <div 
            onClick={() => setShowRefQR(true)}
            className="bg-white p-2 rounded-lg cursor-pointer active:scale-95 transition-transform"
         >
            <QrCode size={48} className="text-gray-800" />
         </div>
      </div>

      {/* Share This App Section */}
      <div className="bg-gray-100 rounded-2xl p-4">
        <h3 className="font-bold text-gray-800 text-sm mb-3 uppercase tracking-wide">Share This App</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* AppStore */}
          <div 
            onClick={() => setShareModal('APPSTORE')}
            className="bg-white p-3 rounded-xl flex items-center gap-3 shadow-sm cursor-pointer active:scale-95 transition-transform border border-gray-200"
          >
             <QrCode size={40} className="text-gray-800" />
             <div className="flex flex-col">
                <div className="bg-black text-white p-1 rounded-md w-fit mb-0.5">
                  <Smartphone size={12} fill="white" />
                </div>
                <span className="text-[10px] font-bold text-gray-500 leading-tight">Download on</span>
                <span className="text-xs font-bold text-gray-900 leading-tight">App Store</span>
             </div>
          </div>

          {/* PlayStore */}
          <div 
            onClick={() => setShareModal('PLAYSTORE')}
            className="bg-white p-3 rounded-xl flex items-center gap-3 shadow-sm cursor-pointer active:scale-95 transition-transform border border-gray-200"
          >
             <QrCode size={40} className="text-gray-800" />
             <div className="flex flex-col">
                <div className="bg-black text-white p-1 rounded-md w-fit mb-0.5">
                  <Play size={12} fill="white" className="ml-1"/>
                </div>
                <span className="text-[10px] font-bold text-gray-500 leading-tight">Download on</span>
                <span className="text-xs font-bold text-gray-900 leading-tight">Google Play</span>
             </div>
          </div>
        </div>
      </div>

      {/* Refer QR Popup */}
      {showRefQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl relative flex flex-col items-center">
              <button 
                onClick={() => setShowRefQR(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-bold text-gray-800 mb-6">Referral Code</h3>
              
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl mb-6">
                 <QrCode size={160} className="text-gray-900" />
              </div>
              
              <div className="text-center">
                 <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Scan or use code</p>
                 <div className="bg-gray-100 px-6 py-3 rounded-xl">
                    <span className="text-2xl font-mono font-bold text-primary tracking-wider">REF-BICH-8823</span>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Share App Modal (AppStore / PlayStore) */}
      {shareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl relative flex flex-col items-center">
              <button 
                onClick={() => setShareModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
              >
                <X size={20} />
              </button>
              
              <div className="bg-black text-white p-3 rounded-full mb-4">
                 {shareModal === 'APPSTORE' ? <Smartphone size={32} fill="white" /> : <Play size={32} fill="white" className="ml-1"/>}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                Download on {shareModal === 'APPSTORE' ? 'App Store' : 'Google Play Store'}
              </h3>
              
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl mb-2">
                 <QrCode size={180} className="text-gray-900" />
              </div>
              
              <p className="text-xs text-gray-400 mt-4 text-center">Scan this QR code with your camera to download the app.</p>
           </div>
        </div>
      )}

    </div>
  );
};

export default AccountScreen;
