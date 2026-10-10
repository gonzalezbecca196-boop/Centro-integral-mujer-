import React, { useState } from 'react';
import {
  Search,
  Send,
  ArrowLeft,
  Phone,
  MoreVertical,
  CheckCheck,
  Building2,
  ShieldAlert,
  Users,
  User,
} from 'lucide-react';
import { ChatContact, ChatMessage } from '../types';

interface ChatScreenProps {
  contacts: ChatContact[];
  onOpenNewChat: () => void;
  onOpenEmergency: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  contacts,
  onOpenNewChat,
  onOpenEmergency,
}) => {
  const [activeContact, setActiveContact] = useState<ChatContact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'c-legal': [
      {
        id: 'm1',
        senderId: 'c-legal',
        text: 'Hola equipo, acabamos de presentar la medida cautelar de exclusión para el legajo 0142 en el Juzgado 14.',
        timestamp: '10:28 AM',
        isMe: false,
      },
      {
        id: 'm2',
        senderId: 'user',
        text: 'Excelente Romina. Ya coordinamos con trabajo social para el subsidio habitacional y con las promotoras del Sendero 1 para sus traslados.',
        timestamp: '10:30 AM',
        isMe: true,
      },
      {
        id: 'm3',
        senderId: 'c-legal',
        text: 'Perfecto. La usuaria tiene turno hoy a las 12:00 hs para firmar copias del escrito.',
        timestamp: '10:32 AM',
        isMe: false,
      },
    ],
    'c-psico': [
      {
        id: 'm4',
        senderId: 'c-psico',
        text: 'Informo que la usuaria citada en el Consultorio 2 ya se encuentra en sala de espera.',
        timestamp: '10:25 AM',
        isMe: false,
      },
    ],
    'c-guardia': [
      {
        id: 'm5',
        senderId: 'c-guardia',
        text: 'Ingresó derivación urgente de OVD por guardia nocturna. Legajo 0129 cargado en el sistema con botón antipánico.',
        timestamp: '08:00 AM',
        isMe: false,
      },
    ],
  });

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeContact) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      text: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    const contactId = activeContact.id;
    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), newMsg],
    }));
    setMessageInput('');

    // Simulated colleague reply
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        senderId: contactId,
        text: 'Recibido, ya lo registramos en el expediente y en el seguimiento interdisciplinario.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      };
      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), replyMsg],
      }));
    }, 1000);
  };

  return (
    <div className="min-h-full flex flex-col bg-white animate-in fade-in duration-200">
      {activeContact ? (
        /* Active Chat View */
        <div className="flex-1 flex flex-col h-[700px]">
          {/* Top Bar of Active Conversation */}
          <div className="px-4 py-3 bg-purple-900 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveContact(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="w-9 h-9 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold text-xs ring-2 ring-purple-300">
                {activeContact.avatarLetter}
              </div>

              <div>
                <h4 className="font-extrabold text-white text-xs leading-snug">
                  {activeContact.name}
                </h4>
                <p className="text-[10px] text-purple-200">
                  {activeContact.role}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full text-white">
              CIM Mugica
            </span>
          </div>

          {/* Messages Viewport */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70 text-xs">
            {(messages[activeContact.id] || []).map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${
                  msg.isMe ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl shadow-xs leading-relaxed ${
                    msg.isMe
                      ? 'bg-purple-700 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Escribir a ${activeContact.name}...`}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="w-9 h-9 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Contacts List View */
        <div className="pb-24 pt-3 px-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                Mensajería y Enlaces
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Chat
              </h2>
            </div>
            <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
              Canal Interno
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar colega o área..."
              className="w-full px-3 py-2 pl-9 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Contacts list */}
          <div className="space-y-2">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setActiveContact(contact)}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-300 hover:shadow-xs flex items-center justify-between gap-3 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0 ${contact.avatarColor}`}
                  >
                    {contact.avatarLetter}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {contact.name}
                      </h4>
                      {contact.area && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                          {contact.area}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-purple-700 font-semibold truncate">
                      {contact.role}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {contact.lastMessage}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">{contact.time}</span>
                  {contact.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-purple-700 text-white text-[10px] font-bold flex items-center justify-center mt-1 ml-auto">
                      {contact.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
