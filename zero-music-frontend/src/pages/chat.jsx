import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import ChatUI from '../components/ChatUI';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Chat() {
  const { t } = useTranslation();
  // creates a new conversation with the user with the given id
  const [searchParams] = useSearchParams();
  const additionalUserId = searchParams.get('uid');

  const [senderAvatar, setSenderAvatar] = useState('');
  const [receiverAvatar, setReceiverAvatar] = useState('');
  const [chatList, setChatList] = useState([]);
  const [activeTab, setActiveTab] = useState('');

  const { userId } = useSelector((state) => state.userState);

  // Fetch chat list
  useEffect(() => {
    if (!userId) return;
    const fetchChatList = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/messages`);
        const chatList = res.data.data;

        // If there is an additional user id in the URL, and the user is not already in the chat list,
        // fetch the name and avatar, and set it as the active tab
        if (additionalUserId) {
          if (!chatList.find(chat => chat.partnerId === additionalUserId)) {
            const additionalUser = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/users/${additionalUserId}`);
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

  return (
    <div className="p-4 flex w-full h-full">
      <div className='h-full'>
        <h1 className='text-xl font-bold ml-4 mt-4'>{t("messageList")}</h1>
        <div className='mt-6 flex items-center'>
          <div className='flex flex-col gap-2 w-60'>
            {chatList && chatList.map(chat => (
              <button
                onClick={() => handleChatClick(chat.partnerId)}
                key={chat.partnerId}
                className={(activeTab === chat.partnerId ?
                  `h-16 flex items-center space-x-2 bg-gray-100 p-2 rounded-lg` :
                  `hover:bg-gray-50 h-16 flex items-center space-x-2 bg-white p-2 rounded-lg`)}>
                <img src={import.meta.env.VITE_SERVER_URL + chat.partnerAvatar} alt={chat.partnerName} className='w-10 h-10 rounded-full' />
                <span className='pl-2'>{chat.partnerName}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='w-full h-full'>
        {activeTab &&
          <ChatUI
            userId={userId}
            receiverId={activeTab}
            senderAvatar={senderAvatar}
            receiverAvatar={receiverAvatar}
          />
        }
      </div>

    </div>
  );
}
