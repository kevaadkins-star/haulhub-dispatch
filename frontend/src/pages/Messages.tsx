import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MessageSquare, 
  Send, 
  User, 
  Clock, 
  Loader2,
  X,
  Plus
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  subject: string;
  body: string;
  read: number;
  created_at: string;
  sender_name: string;
  sender_email: string;
}

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({
    receiver_id: '',
    subject: '',
    body: ''
  });
  
  const [users, setUsers] = useState<{id: string, full_name: string}[]>([]);

  useEffect(() => {
    fetchMessages();
    fetchUsers();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/messages');
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // For now, listing dispatchers as potential recipients for drivers, or vice versa
      const res = await api.get('/dispatchers');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/messages', newMessage);
      alert('Message sent successfully!');
      setIsNewMessageModalOpen(false);
      setNewMessage({ receiver_id: '', subject: '', body: '' });
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message.');
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/messages/${id}/read`);
      setMessages(messages.map(m => m.id === id ? { ...m, read: 1 } : m));
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const handleSelectMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (msg.read === 0 && msg.receiver_id === user?.id) {
      markAsRead(msg.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with your dispatchers and brokers.</p>
        </div>
        <button 
          onClick={() => setIsNewMessageModalOpen(true)}
          className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> New Message
        </button>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex">
        {/* Message List Sidebar */}
        <div className="w-full md:w-80 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : messages.length === 0 ? (
              <div className="text-center py-10 px-4 text-gray-400 text-sm">No messages yet.</div>
            ) : (
              messages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`w-full text-left p-4 border-b border-gray-50 hover:bg-slate-50 transition-colors flex gap-3 ${selectedMessage?.id === msg.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="h-10 w-10 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className={`text-sm truncate ${msg.read === 0 && msg.receiver_id === user?.id ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                        {msg.sender_id === user?.id ? `To: ${msg.receiver_id.substring(0,8)}` : msg.sender_name}
                      </p>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className={`text-xs truncate ${msg.read === 0 && msg.receiver_id === user?.id ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
                      {msg.subject || '(No Subject)'}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate mt-1">{msg.body}</p>
                  </div>
                  {msg.read === 0 && msg.receiver_id === user?.id && (
                    <div className="h-2 w-2 bg-primary rounded-full self-center"></div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Content Area */}
        <div className="flex-1 hidden md:flex flex-col bg-slate-50/30">
          {selectedMessage ? (
            <>
              <div className="p-6 bg-white border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedMessage.subject || '(No Subject)'}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-bold text-gray-700">{selectedMessage.sender_name}</span>
                      <span>&lt;{selectedMessage.sender_email}&gt;</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                      <Clock className="h-3 w-3" /> {new Date(selectedMessage.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {selectedMessage.body}
                </div>
              </div>
              <div className="p-6 bg-white border-t border-gray-100">
                <button 
                  onClick={() => {
                    setNewMessage({
                      receiver_id: selectedMessage.sender_id === user?.id ? selectedMessage.receiver_id : selectedMessage.sender_id,
                      subject: `Re: ${selectedMessage.subject}`,
                      body: ''
                    });
                    setIsNewMessageModalOpen(true);
                  }}
                  className="bg-slate-900 text-white px-8 py-2 rounded-lg font-bold hover:bg-black transition-colors flex items-center gap-2"
                >
                  <Send className="h-4 w-4" /> Reply
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
              <p>Select a message to read</p>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {isNewMessageModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-gray-900">New Message</h2>
              <button onClick={() => setIsNewMessageModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Recipient</label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={newMessage.receiver_id}
                    onChange={(e) => setNewMessage({...newMessage, receiver_id: e.target.value})}
                  >
                    <option value="">Select a recipient...</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.full_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Subject of your message"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Message Body</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Type your message here..."
                    value={newMessage.body}
                    onChange={(e) => setNewMessage({...newMessage, body: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsNewMessageModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
