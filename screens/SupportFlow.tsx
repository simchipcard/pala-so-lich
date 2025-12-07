
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Upload, Clock, CheckCircle, AlertTriangle, Mail, Star, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button, Card } from '../components/UIComponents';
import { SupportView, Ticket } from '../types';
import { analyzeComplaint, AnalysisResult } from '../services/geminiService';

interface SupportFlowProps {
  onBack: () => void;
}

// -- Custom Scroll Wheel Component --
const ScrollPicker: React.FC<{ items: string[]; selected: string; onSelect: (val: string) => void }> = ({ items, selected, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Simple scroll snap logic
  const handleScroll = () => {
    if (!containerRef.current) return;
    const itemHeight = 40; 
    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    if (items[index] && items[index] !== selected) {
       // Debounce slightly or just update logic on scroll end in a real app
       // For this mockup, we won't auto-select on scroll to avoid jitters,
       // but we allow clicking.
    }
  };

  return (
    <div className="h-32 relative overflow-hidden bg-gray-50 rounded-lg">
      <div className="absolute top-1/2 left-0 right-0 h-10 -mt-5 border-t border-b border-primary/30 pointer-events-none bg-primary/5" />
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory no-scrollbar py-12"
        onScroll={handleScroll}
      >
        {items.map((item) => (
          <div 
            key={item} 
            onClick={() => onSelect(item)}
            className={`h-10 flex items-center justify-center snap-center cursor-pointer transition-colors ${selected === item ? 'font-bold text-primary text-lg' : 'text-gray-400 text-sm'}`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

const SupportFlow: React.FC<SupportFlowProps> = ({ onBack }) => {
  const [view, setView] = useState<SupportView>(SupportView.MAIN);
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 'T-1023', device: 'Smart Washer', issue: 'Loud noise during spin', status: 'In Progress', priority: 'Medium', date: '2023-10-24' },
    { id: 'T-0988', device: 'Living Room AC', issue: 'Water leaking', status: 'Completed', priority: 'Mild', date: '2023-09-15' },
  ]);

  // Form State
  const [device, setDevice] = useState('Living Room AC');
  const [issues, setIssues] = useState<string[]>([]);
  const [desc, setDesc] = useState('');
  const [resolution, setResolution] = useState('Call back for advice');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  
  // Picker State
  const [pDay, setPDay] = useState('Mon 24');
  const [pMonth, setPMonth] = useState('Oct');
  const [pTime, setPTime] = useState('10:00 AM');

  // Review Modal State
  const [reviewTicketId, setReviewTicketId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Ticket Expansion State (Multi-select)
  const [expandedTicketIds, setExpandedTicketIds] = useState<string[]>([]);

  const availableDevices = ['Living Room AC', 'Smart Washer', 'Kitchen Fridge', 'Master Bedroom TV'];
  
  // Dynamic Issues Mapping
  const deviceIssuesMap: Record<string, string[]> = {
    'Living Room AC': ['Not cooling', 'Water leaking', 'Bad smell', 'Remote not working', 'Loud noise'],
    'Smart Washer': ['Not spinning', 'Water not draining', 'Door stuck', 'Vibration/Noise', 'Error Code'],
    'Kitchen Fridge': ['Not cooling', 'Ice maker broken', 'Noisy', 'Water dispenser leak', 'Door seal'],
    'Master Bedroom TV': ['No picture', 'No sound', 'WiFi issues', 'Screen flickering', 'Remote issues']
  };

  const currentIssueOptions = deviceIssuesMap[device] || ['Other'];

  const toggleIssue = (iss: string) => {
    setIssues(prev => prev.includes(iss) ? prev.filter(i => i !== iss) : [...prev, iss]);
  };

  const toggleTicket = (id: string) => {
    setExpandedTicketIds(prev => 
      prev.includes(id) ? prev.filter(ticketId => ticketId !== id) : [...prev, id]
    );
  };

  // Reset issues when device changes
  useEffect(() => {
    setIssues([]);
  }, [device]);

  const handleSubmit = async () => {
    if (!desc || issues.length === 0) return;
    setLoading(true);
    
    // AI Analysis
    const result = await analyzeComplaint(device, issues, desc);
    
    setLoading(false);
    setAnalysis(result);

    // Simulate creating a ticket based on result
    const newTicket: Ticket = {
      id: `T-${Math.floor(Math.random() * 10000)}`,
      device,
      issue: issues.join(', '),
      status: 'Received',
      priority: result.classification,
      date: new Date().toLocaleDateString(),
      response: result.responseMessage
    };
    
    setTickets([newTicket, ...tickets]);
  };

  const openReviewModal = (ticketId: string) => {
    setReviewTicketId(ticketId);
    setRating(0);
    setReviewText('');
  };

  // --- Views ---

  if (view === SupportView.MAIN) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={onBack}><ArrowLeft className="text-gray-600" /></button>
          <h1 className="text-2xl font-bold text-gray-800">Support Center</h1>
        </div>
        
        <div className="space-y-4">
          <Card onClick={() => setView(SupportView.FORM)} className="flex items-center gap-4 p-6 border border-blue-100 hover:border-primary transition-colors">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-primary">Send Support Request</h3>
              <p className="text-sm text-gray-500">Describe your issue or complain</p>
            </div>
          </Card>

          <Card onClick={() => setView(SupportView.STATUS)} className="flex items-center gap-4 p-6 border border-gray-100 hover:border-gray-300 transition-colors">
            <div className="bg-gray-100 p-3 rounded-full text-gray-600">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">Ticket Status</h3>
              <p className="text-sm text-gray-500">Track ongoing repairs</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (view === SupportView.STATUS) {
     return (
       <div className="h-full flex flex-col pb-24 relative">
         <div className="flex items-center gap-2 mb-6">
           <button onClick={() => setView(SupportView.MAIN)}><ArrowLeft className="text-gray-600" /></button>
           <h1 className="text-xl font-bold text-gray-800">My Tickets</h1>
         </div>
         <div className="space-y-4 overflow-y-auto">
            {tickets.map(t => {
                const isExpanded = expandedTicketIds.includes(t.id);
                return (
                  <Card key={t.id} className="border-l-4 border-l-primary relative transition-all duration-300">
                    <div 
                        className="cursor-pointer"
                        onClick={() => toggleTicket(t.id)}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="font-bold text-gray-800 block">{t.id}</span>
                                <span className="text-sm font-medium text-gray-600">{t.device}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    t.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>{t.status}</span>
                                {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                            </div>
                        </div>
                    </div>
                    
                    {isExpanded && (
                        <div className="mt-4 pt-3 border-t border-gray-100 animate-fade-in">
                            <p className="text-sm text-gray-500 mb-2"><span className="font-bold text-gray-700 text-xs uppercase mr-2">Issue:</span>{t.issue}</p>
                            {t.response && (
                                <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 italic mb-2 border border-gray-100">
                                    " {t.response} "
                                </div>
                            )}
                            <div className="mt-2 text-xs text-gray-400 flex items-center gap-1 mb-4">
                                <Clock size={12} /> <span>{t.date}</span>
                            </div>
                            
                            <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                openReviewModal(t.id);
                            }}
                            className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-primary text-xs font-bold rounded-lg transition-colors border border-gray-200 flex items-center justify-center gap-2"
                            >
                            <Star size={14} className="text-primary" /> Review Service
                            </button>
                        </div>
                    )}
                  </Card>
                );
            })}
         </div>

         {/* Review Modal */}
         {reviewTicketId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
                    <button 
                        onClick={() => setReviewTicketId(null)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
                    >
                        <X size={20} />
                    </button>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">Rate Service</h3>
                    <p className="text-gray-500 text-xs text-center mb-6">How was your experience with Ticket {reviewTicketId}?</p>
                    
                    {/* Stars */}
                    <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button 
                                key={star}
                                onClick={() => setRating(star)}
                                className="transition-transform active:scale-110"
                            >
                                <Star 
                                    size={32} 
                                    fill={star <= rating ? "#FBBF24" : "none"} 
                                    className={star <= rating ? "text-yellow-400" : "text-gray-300"} 
                                />
                            </button>
                        ))}
                    </div>
                    
                    {/* Text Area */}
                    <textarea 
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review here"
                        className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none text-sm placeholder:italic placeholder:text-gray-400 text-gray-700 mb-4"
                    />
                    
                    <Button onClick={() => setReviewTicketId(null)} fullWidth>
                        Submit Review
                    </Button>
                </div>
            </div>
         )}
       </div>
     )
  }

  // --- FORM VIEW (High Fidelity) ---
  return (
    <div className="h-full flex flex-col pb-24 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setView(SupportView.MAIN)}><ArrowLeft className="text-gray-600" /></button>
        <h1 className="text-xl font-bold text-gray-800">New Request</h1>
      </div>

      {!analysis ? (
        <div className="space-y-6">
          {/* Device Selection */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Select Faulty Device</label>
            <select 
              value={device} 
              onChange={(e) => setDevice(e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            >
              {availableDevices.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Issue Type (Dynamic) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Issue Encountered</label>
            <div className="flex flex-wrap gap-2">
              {currentIssueOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => toggleIssue(opt)}
                  className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                    issues.includes(opt) 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Detailed Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={500}
              placeholder="Please describe the noise or leak..."
              className="w-full h-32 p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none text-sm"
            />
            <div className="text-right text-xs text-gray-400">{desc.length}/500</div>
          </div>

          {/* Media Upload */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Attachments</label>
            <div className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-400 flex-col gap-1 cursor-pointer hover:bg-gray-100">
               <Upload size={20} />
               <span className="text-xs">Tap to upload photos/video</span>
            </div>
          </div>

          {/* Preferred Contact Time (Scroll Wheel) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Preferred Contact Time</label>
            <div className="grid grid-cols-3 gap-2 p-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                <ScrollPicker 
                    items={['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']} 
                    selected={pMonth} 
                    onSelect={setPMonth} 
                />
                <ScrollPicker 
                    items={['Mon 24', 'Tue 25', 'Wed 26', 'Thu 27', 'Fri 28']} 
                    selected={pDay} 
                    onSelect={setPDay} 
                />
                <ScrollPicker 
                    items={['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM']} 
                    selected={pTime} 
                    onSelect={setPTime} 
                />
            </div>
          </div>

          {/* Resolution */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Desired Resolution</label>
            <div className="space-y-2">
               {['Call back for advice', 'Schedule Technician Visit', 'Request Replacement Parts'].map(opt => (
                 <label key={opt} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 cursor-pointer">
                    <input type="radio" name="res" checked={resolution === opt} onChange={() => setResolution(opt)} className="w-4 h-4 text-primary focus:ring-primary" />
                    <span className="text-sm text-gray-700">{opt}</span>
                 </label>
               ))}
            </div>
          </div>

          <Button disabled={loading || !desc} onClick={handleSubmit} fullWidth>
            {loading ? 'Analyzing...' : 'Submit Request'}
          </Button>
        </div>
      ) : (
        // --- AI RESULT SCREEN ---
        <div className="flex flex-col items-center justify-center h-full space-y-6 animate-fade-in">
           <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
               analysis.classification === 'Severe' ? 'bg-red-100 text-red-600' : 
               analysis.classification === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
           }`}>
              {analysis.classification === 'Severe' ? <AlertTriangle size={40} /> : <CheckCircle size={40} />}
           </div>
           
           <div className="text-center space-y-2">
             <h2 className="text-2xl font-bold text-gray-800">{analysis.classification} Issue Detected</h2>
             <p className="text-gray-600 text-sm max-w-xs mx-auto">{analysis.responseMessage}</p>
           </div>

           {analysis.classification === 'Severe' && (
             <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white w-full">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-lg">Apology Voucher</h4>
                    <p className="text-xs opacity-90">50% OFF Service Fee</p>
                  </div>
                  <div className="text-2xl font-mono font-bold bg-white/20 p-2 rounded">SORRY50</div>
                </div>
                <p className="text-[10px] mt-2 opacity-80">Sent automatically due to high priority issue.</p>
             </Card>
           )}

           <div className="w-full space-y-3">
             <Button fullWidth onClick={() => setView(SupportView.STATUS)}>View Ticket Status</Button>
             <Button variant="ghost" fullWidth onClick={() => { setAnalysis(null); setView(SupportView.MAIN); }}>Back to Support</Button>
           </div>
        </div>
      )}
    </div>
  );
};

export default SupportFlow;
