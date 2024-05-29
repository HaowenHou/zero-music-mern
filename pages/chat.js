import { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io();

    socket.on('newMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, []);

  const sendMessage = () => {
    if (message) {
      socket.emit('privateMessage', { senderId: 'yourSenderId', receiverId: 'receiverId', message });
      setMessage('');
    }
  };

  return (
    <div className="p-4">
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index}>{msg.senderId}: {msg.message}</p>
        ))}
      </div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="border p-1" />
      <button onClick={sendMessage} className="bg-blue-500 text-white p-1">Send</button>
    </div>
  );
}
