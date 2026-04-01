import { useEffect, useState } from 'react';
import { chatAPI } from '../api/api';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '/');

const ChatBox = ({ tripId, user }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!tripId) return;
    chatAPI.load(tripId).then((res) => setMessages(res.data)).catch(console.error);
    socket.emit('join-trip', tripId);
  }, [tripId]);

  useEffect(() => {
    socket.on('receive-message', (message) => {
      if (message.tripId === tripId) {
        setMessages((prev) => [...prev, message]);
      }
    });
    return () => socket.off('receive-message');
  }, [tripId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const payload = { text };
    try {
      const response = await chatAPI.send(tripId, payload);
      setMessages((prev) => [...prev, response.data]);
      socket.emit('send-message', response.data);
      setText('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h4 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Trip Chat</h4>
      <div className="mb-4 max-h-72 space-y-3 overflow-y-auto pr-2">
        {messages.map((message) => (
          <div key={message._id} className={`rounded-3xl p-3 ${message.senderId._id === user._id ? 'bg-sky-50 text-slate-900 dark:bg-sky-500/10 dark:text-slate-100' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
            <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{message.senderId.name}</div>
            <p className="whitespace-pre-wrap">{message.text}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
        <button onClick={sendMessage} className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
