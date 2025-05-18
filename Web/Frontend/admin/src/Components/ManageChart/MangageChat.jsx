import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Chat = () => {
  const [userId, setUserId] = useState('1');
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (userId) {
      axios.get('http://localhost:8080/api/chat/conversations', {
        params: { userId }
      })
        .then(response => {
          if (response.data.success) {
            setConversations(response.data.data);
            if (response.data.data.length > 0 && !selectedConversation) {
              setSelectedConversation(response.data.data[0].id);
            }
          } else {
            console.error('Failed to fetch conversations:', response.data.message);
          }
        })
        .catch(error => {
          console.error('Error fetching conversations:', error);
        });
    }
  }, [userId, selectedConversation]);

  useEffect(() => {
    if (!userId) return;
    const newSocket = io('http://localhost:9090', {
      query: { userId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server at ' + new Date().toLocaleString());
      axios.get('http://localhost:8080/api/chat/conversations', {
        params: { userId }
      }).then(response => {
        if (response.data.success) {
          setConversations(response.data.data);
          if (response.data.data.length > 0 && !selectedConversation) {
            setSelectedConversation(response.data.data[0].id);
          }
        }
      }).catch(error => {
        console.error('Error fetching conversations:', error);
      });
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    newSocket.on('user_connected', (userId) => {
      console.log(`User ${userId} connected at ` + new Date().toLocaleString());
    });

    newSocket.on('user_disconnected', (userId) => {
      console.log(`User ${userId} disconnected at ` + new Date().toLocaleString());
    });

    newSocket.on('receive_message', (data) => {
      if (selectedConversation === data.senderId) {
        setMessages((prev) => [...prev, data]);
      }
    });

    newSocket.on('new_message_notification', (data) => {
      if (data.senderId !== userId) {
        setConversations((prev) => {
          const updatedConversations = prev.filter(conv => conv.id !== data.senderId);
          const senderConversation = prev.find(conv => conv.id === data.senderId) || { id: data.senderId, name: `Người dùng ${data.senderId}` };
          return [senderConversation, ...updatedConversations];
        });
        if (selectedConversation === data.senderId) {
          axios.get('http://localhost:8080/api/chat/history', {
            params: { userId, otherUserId: data.senderId }
          }).then(response => {
            setMessages(response.data);
          }).catch(error => {
            console.error('Error fetching chat history:', error);
          });
        } else {
          toast.info(`Tin nhắn mới từ ${data.senderId} tại ${data.timestamp}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
    });

    return () => newSocket.close();
  }, [userId, selectedConversation]);

  useEffect(() => {
    if (socket && userId && selectedConversation) {
      const roomId = userId < selectedConversation ? userId + "-" + selectedConversation : selectedConversation + "-" + userId;
      socket.emit('join_room', { otherUserId: selectedConversation });
      console.log(`${userId} joined room ${roomId}`);

      axios.get('http://localhost:8080/api/chat/history', {
        params: { userId, otherUserId: selectedConversation }
      })
        .then(response => {
          setMessages(response.data);
        })
        .catch(error => {
          console.error('Error fetching chat history:', error);
        });
    }
  }, [socket, userId, selectedConversation]);

  const sendMessage = () => {
    if (socket && userId && selectedConversation && message) {
      socket.emit('send_message', {
        receiverId: selectedConversation,
        message,
      });
      setMessages((prev) => [
        ...prev,
        { senderId: userId, message, timestamp: new Date().toLocaleString() },
      ]);
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <h2 className="text-xl font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Chat MotoVIP
          </h2>
        </div>

        {/* Chat container */}
        <div className="flex flex-col md:flex-row h-[600px]">
          {/* Conversations sidebar */}
          <div className="w-full md:w-1/4 border-r border-gray-200 bg-gray-50">
            <div className="p-3 bg-gray-100 border-b border-gray-200">
              <h3 className="font-medium text-gray-700">Danh sách cuộc trò chuyện</h3>
            </div>
            <div className="overflow-y-auto h-[calc(600px-3rem)]">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Không có cuộc trò chuyện nào</div>
              ) : (
                conversations.map((conv, index) => (
                  <div
                    key={index}
                    className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-all flex items-center ${
                      selectedConversation === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => setSelectedConversation(conv.id)}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3 flex-shrink-0">
                      {conv.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-medium text-gray-800 truncate">{conv.name}</p>
                      <p className="text-xs text-gray-500 truncate">Nhấn để xem tin nhắn</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="w-full md:w-3/4 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat header */}
                <div className="p-3 bg-white border-b border-gray-200 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">
                    {(conversations.find(c => c.id === selectedConversation)?.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">
                    {conversations.find(c => c.id === selectedConversation)?.name || `Người dùng ${selectedConversation}`}
                  </span>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 h-[calc(600px-8rem)]">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      Bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div key={index} className={`mb-4 ${msg.senderId === userId ? 'flex justify-end' : 'flex justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm ${
                          msg.senderId === userId 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                        }`}>
                          <div className="font-medium text-sm mb-1">
                            {msg.senderId === userId ? 'Bạn' : (msg.senderName || `Người dùng ${msg.senderId}`)}
                          </div>
                          <div className="break-words">
                            {msg.message}
                          </div>
                          <div className={`text-xs mt-1 ${msg.senderId === userId ? 'text-blue-100' : 'text-gray-500'}`}>
                            {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Nhập tin nhắn của bạn..."
                      className="flex-1 px-4 py-2 focus:outline-none"
                    />
                    <button 
                      onClick={sendMessage} 
                      className="bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                      Gửi
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="font-medium">Chọn một cuộc trò chuyện để bắt đầu</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Chat;