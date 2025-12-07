import React, { useState } from 'react';
import { AlertCircle, Tag, CheckCircle, Clock } from 'lucide-react';
import { NotificationItem } from '../types';

const NotificationsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'activity' | 'offers'>('activity');

  const notifications: NotificationItem[] = [
    { id: '1', type: 'alert', title: 'Abnormal Power Usage', message: 'The Living Room AC usage is 20% higher than usual.', date: '10:30 AM', read: false },
    { id: '2', type: 'alert', title: 'Filter Cleaning Required', message: 'It has been 3 months since the last cleaning.', date: 'Yesterday', read: true },
    { id: '3', type: 'offer', title: 'Summer Sale!', message: 'Get 50% off on Smart Air Purifiers.', date: '2 days ago', read: false },
    { id: '4', type: 'offer', title: 'Gold Member Perk', message: 'You have a new voucher for maintenance.', date: '1 week ago', read: true },
  ];

  const filtered = notifications.filter(n => (activeTab === 'activity' ? n.type === 'alert' : n.type === 'offer'));

  return (
    <div className="space-y-4 pb-24 h-full flex flex-col">
      <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-200 rounded-xl">
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'activity' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
        >
          Activity
        </button>
        <button
          onClick={() => setActiveTab('offers')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'offers' ? 'bg-white text-secondary shadow-sm' : 'text-gray-500'}`}
        >
          Offers
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {filtered.map(item => (
          <div key={item.id} className={`p-4 bg-white rounded-xl shadow-sm border-l-4 ${item.read ? 'border-gray-200 opacity-60' : activeTab === 'activity' ? 'border-red-500' : 'border-secondary'} flex gap-4`}>
             <div className={`mt-1 ${item.read ? 'text-gray-400' : activeTab === 'activity' ? 'text-red-500' : 'text-secondary'}`}>
               {activeTab === 'activity' ? <AlertCircle size={20} /> : <Tag size={20} />}
             </div>
             <div className="flex-1">
               <div className="flex justify-between items-start">
                 <h4 className={`font-bold text-sm ${item.read ? 'text-gray-600' : 'text-gray-900'}`}>{item.title}</h4>
                 {!item.read && <div className="w-2 h-2 bg-red-500 rounded-full" />}
               </div>
               <p className="text-xs text-gray-500 mt-1">{item.message}</p>
               <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                 <Clock size={10} /> {item.date}
               </p>
             </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <CheckCircle className="mx-auto mb-2 opacity-50" size={40} />
            <p>No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;