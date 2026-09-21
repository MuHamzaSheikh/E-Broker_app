import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  X,
  Phone,
  CheckCheck
} from 'lucide-react';

interface SimpleChatModalProps {
  recipientName: string;
  recipientPhone: string;
  loadRoute?: string;
  onClose: () => void;
}

export const SimpleChatModal: React.FC<SimpleChatModalProps> = ({
  recipientName,
  recipientPhone,
  loadRoute = 'Karachi → Faisalabad',
  onClose
}) => {
  const { language } = useApp();

  const [messages, setMessages] = useState<Array<{ id: string; sender: 'me' | 'other'; text: string; time: string }>>([
    {
      id: '1',
      sender: 'other',
      text: language === 'ur' ? 'السلام علیکم! گاڑی تیار ہے۔ مال کب لوڈ کروانا ہے؟' : 'Assalam-o-Alaikum! My vehicle is ready. What time should I arrive for loading?',
      time: '10:15 AM'
    },
    {
      id: '2',
      sender: 'me',
      text: language === 'ur' ? 'وعلیکم السلام! دوپہر 2 بجے گودام پر پہنچ جائیں۔' : 'Walaikum Assalam! Please arrive at the warehouse gate by 2:00 PM.',
      time: '10:18 AM'
    }
  ]);

  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'me',
        text: inputText.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[580px] max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-base">
              {recipientName.charAt(0)}
            </div>
            <div>
              <h3 className="heading-card text-white">{recipientName}</h3>
              <p className="text-[11px] text-slate-300 font-mono">{recipientPhone} &bull; {loadRoute}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${recipientPhone}`}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 cursor-pointer"
              title="Call"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-100 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-xs text-sm ${
                  m.sender === 'me'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed">{m.text}</p>
                <div
                  className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                    m.sender === 'me' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  <span>{m.time}</span>
                  {m.sender === 'me' && <CheckCheck className="w-3 h-3 text-blue-200" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={language === 'ur' ? 'پیغام لکھیں...' : 'Type a message...'}
            className="flex-1 h-12 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-blue-600 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-12 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white flex items-center justify-center cursor-pointer shadow-sm active:scale-95 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
