import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ChatUI from './components/ChatUI';

export default function Chat() {
  const router = useRouter();
  // creates a new conversation with the user with the given id
  const { uid: additionalUserId } = router.query;

  const [senderAvatar, setSenderAvatar] = useState('');
  const [receiverAvatar, setReceiverAvatar] = useState('');
  const [chatList, setChatList] = useState([]);
  const [activeTab, setActiveTab] = useState('');

  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const isLoading = status === 'loading';

  // Fetch chat list
  useEffect(() => {
    if (!userId) return;
    const fetchChatList = async () => {
      try {
        const res = await axios.get(`/api/chat/${userId}`);
        const chatList = res.data.data;

        // If there is an additional user id in the URL, and the user is not already in the chat list,
        // fetch the name and avatar, and set it as the active tab
        if (additionalUserId) {
          if (!chatList.find(chat => chat.partnerId === additionalUserId)) {
            const additionalUser = await axios.get(`/api/user?uid=${additionalUserId}`);
            // Add this user info to the response chat list
            chatList.push({
              partnerId: additionalUserId,
              partnerName: additionalUser.data.name,
              partnerAvatar: additionalUser.data.avatar
            });
          }
          setReceiverAvatar(chatList.find(chat => chat.partnerId === additionalUserId).partnerAvatar);
          setActiveTab(additionalUserId);
        }

        setChatList(chatList);
        setSenderAvatar(res.data.userAvatar);
      } catch (err) {
        console.error('Failed to fetch chat list', err);
      }
    };

    fetchChatList();
  }, [userId]);

  const handleChatClick = (receiverId) => {
    setActiveTab(receiverId);
    setReceiverAvatar(chatList.find(chat => chat.partnerId === receiverId).partnerAvatar);
  }

  if (isLoading) return null;

  return (
    <div className="p-4 flex">
      <div className='flex flex-col gap-2 w-60'>
        {chatList && chatList.map(chat => (
          <button
            onClick={() => handleChatClick(chat.partnerId)}
            key={chat.partnerId}
            className={(activeTab === chat.partnerId ?
              `h-16 flex items-center space-x-2 bg-gray-100 p-2 rounded-lg` :
              `hover:bg-gray-50 h-16 flex items-center space-x-2 bg-white p-2 rounded-lg`)}>
            <img src={chat.partnerAvatar} alt={chat.partnerName} className='w-10 h-10 rounded-full' />
            <span className='pl-2'>{chat.partnerName}</span>
          </button>
        ))}
      </div>

      <div className='w-full'>
        {activeTab &&
          <ChatUI
            userId={userId}
            receiverId={activeTab}
            senderAvatar={senderAvatar}
            receiverAvatar={receiverAvatar} />
        }
      </div>

    </div>
  );
}
