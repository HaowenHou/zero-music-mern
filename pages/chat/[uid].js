import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import axios from 'axios';

let socket

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const isLoading = status === 'loading';

  const router = useRouter();
  const { uid: receiverId } = router.query;

  useEffect(() => {
    socket = io({
      query: { userId }
    });

    socket.on('newMessage', (msg) => {
      console.log('New message received:', msg);
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
        timestamp: new Date()  // Optionally include timestamp if your message model includes it
      };
      socket.emit('privateMessage', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Update UI immediately
      setMessage('');
    }
  };

  if (isLoading) return null;

  return (
    <div className="p-4">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 my-2 rounded ${msg.senderId === userId ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-300'}`}>
            {msg.message}
          </div>
        ))}
      </div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="border p-1" />
      <button onClick={sendMessage} className="bg-blue-500 text-white p-1">Send</button>
    </div>
  );
}
