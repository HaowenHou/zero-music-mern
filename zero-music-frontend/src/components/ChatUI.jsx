import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

let socket

export default function ChatUI({ userId, receiverId, senderAvatar, receiverAvatar }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io(import.meta.env.VITE_SERVER_URL, {
      query: { userId }
    });

    socket.on('newMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('newMessage');
      socket.disconnect();
    };
  }, []);

  // Fetch history messages
  useEffect(() => {
    if (!userId || !receiverId) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/messages/${receiverId}`);
        setMessages(res.data.data);
      } catch (err) {
        console.error('Failed to fetch messages', err);
      }
    };

    fetchMessages();
  }, [userId, receiverId]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      const newMessage = {
        senderId: userId,
        receiverId: receiverId,
        message: message,
        timestamp: new Date()
      };
      socket.emit('privateMessage', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col pt-2 px-4 h-full">
      <div className="space-y-3 flex-1 overflow-auto">
        {messages.map((msg, index) => (
          <div key={index} className="flex">
            {msg.senderId === userId ? (
              <div className='flex items-center gap-2 ml-auto'>
                <div className="bg-orange-400 text-white p-2 rounded-lg max-w-xs break-words px-3" style={{ wordWrap: 'break-word' }}>
                  {msg.message}
                </div>
                <Link to={`/profile/${userId}`}>
                  <img src={import.meta.env.VITE_SERVER_URL + senderAvatar} alt="Avatar" className="w-9 h-9 rounded-full mr-2" />
                </Link>
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <Link to={`/profile/${receiverId}`}>
                  <img src={import.meta.env.VITE_SERVER_URL + receiverAvatar} alt="Avatar" className="w-9 h-9 rounded-full ml-2" />
                </Link>
                <div className="bg-gray-100 p-2 rounded-lg max-w-xs break-words px-3" style={{ wordWrap: 'break-word' }}>
                  {msg.message}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex items-center">
        <input type="text" value={message}
          onChange={(e) => setMessage(e.target.value)} className="border w-full h-10 rounded-lg px-2" />
        <button type="submit" className="bg-orange-400 text-white ml-2 w-16 h-10 rounded-lg">{t("sendMessage")}</button>
      </form>
    </div>
  );
}
