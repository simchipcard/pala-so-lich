
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Loader2, RefreshCcw } from 'lucide-react';
import { getGeminiChatResponse, ChatMessage } from '../services/geminiService';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  scenario: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose, onOpen, scenario }) => {
  const DEFAULT_GREETING = "Hello Ms. Bich! Saigon is heating up, is your AC ready?";
  
  const [messages, setMessages] = useState<{id: number, text: string, isUser: boolean}[]>([
    { id: 1, text: DEFAULT_GREETING, isUser: false }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // For 4s delay
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading, isTyping]);

  // --- Scenario Trigger Logic ---
  useEffect(() => {
    if (scenario === 'HUMIDITY' && isOpen) {
        // Automatically start the humidity scenario
        handleHiddenSystemMessage("[SYSTEM_TRIGGER]: User clicked Humidity Alert");
    }
  }, [scenario, isOpen]);

  const handleHiddenSystemMessage = async (text: string) => {
     setIsLoading(true);
     try {
       const history: ChatMessage[] = messages.map(m => ({
         role: m.isUser ? 'user' : 'model',
         parts: [{ text: m.text }]
       }));
       const responseText = await getGeminiChatResponse(history, text);
       processResponse(responseText);
     } catch(e) {
       console.error(e);
       setIsLoading(false);
     }
  };

  const handleReset = () => {
    setMessages([{ id: Date.now(), text: DEFAULT_GREETING, isUser: false }]);
    setInputText("");
    setIsLoading(false);
    setIsTyping(false);
  };

  const handleSend = async () => {
    if(!inputText.trim()) return;
    
    const userText = inputText;
    const userMsg = { id: Date.now(), text: userText, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const history: ChatMessage[] = messages.map(m => ({
        role: m.isUser ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const responseText = await getGeminiChatResponse(history, userText);
      processResponse(responseText);
    } catch (error) {
      const errorMsg = { 
        id: Date.now() + 1, 
        text: "Sorry, something went wrong. Please try again.", 
        isUser: false 
      };
      setMessages(prev => [...prev, errorMsg]);
      setIsLoading(false);
    }
  };

  const processResponse = (fullText: string) => {
    // Check for [DELAY] tag
    if (fullText.includes("[DELAY]")) {
       const parts = fullText.split("[DELAY]");
       const firstPart = parts[0].trim();
       const secondPart = parts[1].trim();

       // Show first part
       setMessages(prev => [...prev, { id: Date.now(), text: firstPart, isUser: false }]);
       setIsLoading(false);

       // Wait 4 seconds then show second part
       setIsTyping(true);
       setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, { id: Date.now() + 10, text: secondPart, isUser: false }]);
       }, 4000);
    } else {
       setMessages(prev => [...prev, { id: Date.now(), text: fullText, isUser: false }]);
       setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Window Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 animate-in slide-in-from-bottom-5 fade-in duration-200 origin-bottom-right overflow-hidden font-sans h-[500px] max-h-[70vh]">
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between shadow-sm shrink-0">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary font-bold shadow-inner">P</div>
                <div>
                   <h3 className="text-white font-bold text-sm">Panabot</h3>
                   <div className="flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                     <span className="text-blue-200 text-[10px] font-medium">Online</span>
                   </div>
                </div>
             </div>
             
             <div className="flex items-center gap-1">
                 <button 
                    onClick={handleReset} 
                    className="text-blue-200 hover:text-white transition-colors bg-white/10 rounded-full p-1.5 mr-1"
                    title="Reset Chat"
                 >
                   <RefreshCcw size={14} />
                 </button>
                 <button 
                    onClick={onClose} 
                    className="text-blue-200 hover:text-white transition-colors bg-white/10 rounded-full p-1.5"
                 >
                   <X size={16} />
                 </button>
             </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
             {messages.map(msg => (
               <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  {!msg.isUser && (
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs mr-2 mt-auto shrink-0 border border-white shadow-sm">
                          P
                      </div>
                  )}
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                    msg.isUser 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
               </div>
             ))}
             
             {/* Thinking Indicator (Gemini) */}
             {isLoading && (
               <div className="flex justify-start animate-pulse">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs mr-2 mt-auto shrink-0">P</div>
                  <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                     <Loader2 size={16} className="animate-spin text-primary" />
                     <span className="text-xs text-gray-500 italic">Thinking...</span>
                  </div>
               </div>
             )}

             {/* Typing Indicator (4s Delay) */}
             {isTyping && (
               <div className="flex justify-start animate-pulse">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs mr-2 mt-auto shrink-0">P</div>
                  <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-0"></span>
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                  </div>
               </div>
             )}
             
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
             <input 
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && !isLoading && !isTyping && handleSend()}
               placeholder="Type a message..."
               disabled={isLoading || isTyping}
               className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-gray-700 placeholder:text-gray-400 disabled:opacity-70"
               autoFocus
             />
             <button 
               onClick={handleSend}
               disabled={!inputText.trim() || isLoading || isTyping}
               className="bg-primary text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center justify-center"
             >
               <Send size={18} />
             </button>
          </div>
        </div>
      )}

      {/* Floating Action Button - Only show when closed */}
      {!isOpen && (
        <button 
          onClick={onOpen}
          className={`fixed bottom-24 right-5 w-14 h-14 bg-white rounded-full shadow-lg hover:shadow-xl border border-gray-50 flex items-center justify-center z-50 hover:scale-105 active:scale-95 transition-all duration-300 group`}
        >
          <div className="absolute inset-0 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-primary font-bold text-2xl font-sans relative z-10 drop-shadow-sm">P</span>
        </button>
      )}
    </>
  );
};
