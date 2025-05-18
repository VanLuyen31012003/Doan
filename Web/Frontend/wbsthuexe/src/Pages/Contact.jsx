import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApiKhachHang from '../api/ApiKhachHang';
import { getToken } from '../lib/authenticate';
// import './MangeChat.css';

const Chat = () => {
  const [userId, setUserId] = useState(null); // Khởi tạo null, sẽ lấy từ API
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
    // Cuộn xuống tin nhắn mới nhất


  // Gọi API getmyinfo khi component mount
  useEffect(() => {
    if(getToken()===null){
      toast.error("Vui lòng đăng nhập để sử dụng tính năng chat!");
      return;
    }
      ApiKhachHang.getinfo() 
      .then(response => {
        if (response.data.success) {
          setUserId(response.data.data.id.toString()); // Chuyển id thành string để đồng bộ với Socket.IO
        } else {
          console.error('Failed to fetch user info:', response.data.message);
          setUserId('1'); // Fallback nếu API thất bại
        }
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
        setUserId('1'); // Fallback nếu có lỗi
      });
   
 
    
  }, []);

  // Chỉ chạy khi userId đã được lấy từ API
  useEffect(() => {
    if (!userId) return;

    axios.get('http://localhost:8080/api/chat/conversations', {
      params: { userId }
    })
      .then(response => {
        if (response.data.success) {
          let fetchedConversations = response.data.data;
          if (fetchedConversations.length === 0) {
            fetchedConversations = [{ id: '1', name: 'Tư vấn MOTOVIP' }];
          } else {
            if (!fetchedConversations.some(conv => conv.id === '1')) {
              fetchedConversations.push({ id: '1', name: 'Tư vấn MOTOVIP' });
            }
          }
          setConversations(fetchedConversations);
          if (fetchedConversations.length > 0 && !selectedConversation) {
            setSelectedConversation(fetchedConversations[0].id);
          }
        } else {
          console.error('Failed to fetch conversations:', response.data.message);
          setConversations([{ id: '1', name: 'Tư vấn MOTOVIP' }]);
          setSelectedConversation('1');
        }
      })
      .catch(error => {
        console.error('Error fetching conversations:', error);
        setConversations([{ id: '1', name: 'Tư vấn MOTOVIP' }]);
        setSelectedConversation('1');
      });
  }, [userId]);
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
          let fetchedConversations = response.data.data;
          if (fetchedConversations.length === 0) {
            fetchedConversations = [{ id: '1', name: 'Tư vấn MOTOVIP' }];
          } else {
            if (!fetchedConversations.some(conv => conv.id === '1')) {
              fetchedConversations.push({ id: '1', name: 'Tư vấn MOTOVIP' });
            }
          }
          setConversations(fetchedConversations);
          if (fetchedConversations.length > 0 && !selectedConversation) {
            setSelectedConversation(fetchedConversations[0].id);
          }
        }
      }).catch(error => {
        console.error('Error fetching conversations:', error);
        setConversations([{ id: '1', name: 'Tư vấn MOTOVIP' }]);
        setSelectedConversation('1');
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
        const senderName = conversations.find(conv => conv.id === data.senderId)?.name || data.senderId;
        setMessages((prev) => [...prev, { ...data, senderName }]);
      }
    });

    newSocket.on('new_message_notification', (data) => {
      if (data.senderId !== userId) {
        setConversations((prev) => {
          const updatedConversations = prev.filter(conv => conv.id !== data.senderId);
          const senderConversation = prev.find(conv => conv.id === data.senderId) || { id: data.senderId, name: `Tư vấn MOTOVIP` };
          return [senderConversation, ...updatedConversations];
        });
        if (selectedConversation === data.senderId) {
          axios.get('http://localhost:8080/api/chat/history', {
            params: { userId, otherUserId: data.senderId }
          }).then(response => {
            const updatedMessages = response.data.map(msg => ({
              ...msg,
              senderName: conversations.find(conv => conv.id === msg.senderId)?.name || msg.senderId
            }));
            setMessages(updatedMessages);
          }).catch(error => {
            console.error('Error fetching chat history:', error);
          });
        } else {
          const senderName = conversations.find(conv => conv.id === data.senderId)?.name || data.senderId;
          toast.info(`Tin nhắn mới từ ${senderName} tại ${data.timestamp}`, {
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
  }, [userId, selectedConversation, conversations]);
  useEffect(() => {
    if (socket && userId && selectedConversation) {
      const roomId = userId < selectedConversation ? userId + "-" + selectedConversation : selectedConversation + "-" + userId;
      socket.emit('join_room', { otherUserId: selectedConversation });
      console.log(`${userId} joined room ${roomId}`);

      axios.get('http://localhost:8080/api/chat/history', {
        params: { userId, otherUserId: selectedConversation }
      })
        .then(response => {
          const updatedMessages = response.data.map(msg => ({
            ...msg,
            senderName: conversations.find(conv => conv.id === msg.senderId)?.name || msg.senderId
          }));
          setMessages(updatedMessages);
        })
        .catch(error => {
          console.error('Error fetching chat history:', error);
          setMessages([]); // Nếu không có lịch sử, set messages rỗng
        });
    }
  }, [socket, userId, selectedConversation, conversations]);

  const sendMessage = () => {
    if (socket && userId && selectedConversation && message) {
      socket.emit('send_message', {
        receiverId: selectedConversation,
        message,
      });
      const senderName = conversations.find(conv => conv.id === userId)?.name || 'Bạn';
      setMessages((prev) => [
        ...prev,
        { senderId: userId, senderName, message, timestamp: new Date().toLocaleString() },
      ]);
      setMessage('');
    }
  };  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white w-full items-center flex flex-col gap-5 mx-auto mt-8">
        <h1 className="text-3xl text-center md:text-4xl font-bold text-gray-800">
          Liên hệ MOTOVIP Việt Nam
        </h1>
        <p className="text-sm md:text-lg text-gray-600 text-center">
          Hỗ trợ và tư vấn trực tuyến 24/7
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
        <div className="p-4 bg-gradient-to-r from-[#dd5c36] to-[#c14021] text-white">
          <h2 className="font-bold text-xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Đặt câu hỏi ngay
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row h-[500px] border-t">
          {/* Danh sách cuộc trò chuyện */}
          <div className="w-full md:w-1/4 border-r border-gray-200 bg-gray-50">
            <div className="p-3 bg-gray-100 border-b border-gray-200">
              <h3 className="font-medium text-gray-700">Cuộc trò chuyện</h3>
            </div>
            <div className="overflow-y-auto h-[calc(600px-3rem)]">
              {conversations.map((conv, index) => (
                <div
                  key={index}
                  className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-all flex items-center ${
                    selectedConversation === conv.id ? 'bg-orange-50 border-l-4 border-l-[#dd5c36]' : ''
                  }`}
                  onClick={() => setSelectedConversation(conv.id)}
                >
                  <div className="w-10 h-10 rounded-full bg-[#dd5c36] flex items-center justify-center text-white mr-3 flex-shrink-0">
                    {conv.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium text-gray-800 truncate">Nhân viên tư vấn</p>
                    <p className="text-xs text-gray-500 truncate">Nhấn để xem tin nhắn</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Khu vực chat */}
          <div className="w-full md:w-3/4 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat header */}
                <div className="p-3 bg-white border-b border-gray-200 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#dd5c36] flex items-center justify-center text-white mr-3">
                         N
                  </div>
                  <span className="font-medium">
                    Nhân viên tư vấn
                  </span>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 h-[calc(600px-8rem)]">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p>Bắt đầu cuộc trò chuyện</p>
                      <p className="text-sm mt-2">Gửi tin nhắn để nhận hỗ trợ</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div key={index} className={`mb-4 ${msg.senderId === userId ? 'flex justify-end' : 'flex justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm ${
                          msg.senderId === userId 
                            ? 'bg-[#dd5c36] text-white rounded-br-none' 
                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                        }`}>
                          <div className="font-medium text-sm mb-1">
                            {msg.senderId === userId ? 'Bạn' : "Nhân viên tư vấn"}
                          </div>
                          <div className="break-words">
                            {msg.message}
                          </div>
                          <div className={`text-xs mt-1 ${msg.senderId === userId ? 'text-orange-100' : 'text-gray-500'}`}>
                            {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input nhắn tin */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Nhập tin nhắn của bạn..."
                      className="flex-1 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#dd5c36]"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button 
                      onClick={sendMessage} 
                      className="bg-[#dd5c36] text-white px-6 py-2 hover:bg-[#c14021] transition-colors flex items-center"
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
      
      <div className="mt-8 text-center text-gray-600 text-sm">
        <p>© 2025 MOTOVIP - Hệ thống thuê xe hàng đầu Việt Nam</p>
      </div>
      
      <ToastContainer />
    </div>
  );
};

export default Chat;