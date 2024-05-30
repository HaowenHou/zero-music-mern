import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

let socket

export default function ChatUI({userId, receiverId, senderAvatar, receiverAvatar}) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io({
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
        const res = await axios.get(`/api/messages/${userId}?partnerId=${receiverId}`);
        setMessages(res.data.data);
      } catch (err) {
        console.error('Failed to fetch messages', err);
      }
    };

    fetchMessages();
  }, [userId, receiverId]);

  const sendMessage = () => {
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
    <div className="p-4">
      <div className="messages space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className="flex">
            {msg.senderId === userId ? (
              <div className='flex items-center gap-2 ml-auto'>
                <div className="bg-orange-400 text-white p-2 rounded-lg max-w-xs break-words" style={{wordWrap: 'break-word'}}>
                  {msg.message}
                </div>
                <img src={senderAvatar} alt="Avatar" className="w-8 h-8 rounded-full mr-2"/>
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <img src={receiverAvatar} alt="Avatar" className="w-8 h-8 rounded-full ml-2"/>
                <div className="bg-gray-300 p-2 rounded-lg max-w-xs break-words" style={{wordWrap: 'break-word'}}>
                  {msg.message}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center">
        <input type="text" value={message} 
        onChange={(e) => setMessage(e.target.value)} className="border w-full h-8 rounded-lg px-2" />
        <button onClick={sendMessage} className="bg-orange-400 text-white p-1 ml-2 w-12 rounded-lg">发送</button>
      </div>
    </div>
  );
}
