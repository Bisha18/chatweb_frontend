import { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext.jsx';
import { UserContext } from '../App.jsx';
import MessageList from '../components/MessageList.jsx';
import MessageInput from '../components/MessageInput.jsx';
import OnlineUsersList from '../components/OnlineUsersList.jsx';
import TypingIndicator from '../components/TypingIndicator.jsx';

function ChatRoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const { user } = useContext(UserContext);

  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [showUsersList, setShowUsersList] = useState(false);
  const typingTimeoutRef = useRef({});

  const currentRoomNameRef = useRef('Loading...');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user || !isConnected || !socket) {
      console.log('User not logged in or socket not connected, redirecting to auth.');
      const timeout = setTimeout(() => {
        if (!user) navigate('/auth');
      }, 1000);
      return () => clearTimeout(timeout);
    }

    socket.emit('joinRoom', { email: user.email, roomId: roomId, userId: user.id });
    console.log(`Attempting to join room ${roomId} as ${user.email}`);

    const handleChatHistory = (history) => {
      console.log('Received chat history:', history);
      setMessages(history);
      scrollToBottom();
    };

    const handleMessage = (msg) => {
      console.log('Received new message:', msg);
      if (msg.senderUsername === 'system' && msg.text.includes('Welcome to') && msg.text.includes(user.email)) {
        if (currentRoomNameRef.current === 'Loading...') {
          const roomNameMatch = msg.text.match(/Welcome to (.*?)!,/);
          if (roomNameMatch && roomNameMatch[1]) {
            currentRoomNameRef.current = roomNameMatch[1];
            setMessages(prev => [...prev, msg]);
          }
        } else {
          if(msg.text.includes('has joined the room') || msg.text.includes('has left the room')) {
            setMessages((prevMessages) => [...prevMessages, msg]);
          }
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
      scrollToBottom();
    };

    const handleRoomUsers = (users) => {
      console.log('Received online users:', users);
      setOnlineUsers(users);
    };

    const handleTypingStatus = ({ email: typingEmail, isTyping }) => {
      setTypingUsers(prev => {
        const newState = { ...prev };
        if (typingEmail !== user.email) {
          if (isTyping) {
            newState[typingEmail] = true;
            if (typingTimeoutRef.current[typingEmail]) {
              clearTimeout(typingTimeoutRef.current[typingEmail]);
            }
            typingTimeoutRef.current[typingEmail] = setTimeout(() => {
              setTypingUsers(prevTimeout => {
                const newTimeoutState = { ...prevTimeout };
                delete newTimeoutState[typingEmail];
                return newTimeoutState;
              });
            }, 2000);
          } else {
            delete newState[typingEmail];
            if (typingTimeoutRef.current[typingEmail]) {
              clearTimeout(typingTimeoutRef.current[typingEmail]);
              delete typingTimeoutRef.current[typingEmail];
            }
          }
        }
        return newState;
      });
    };

    socket.on('chatHistory', handleChatHistory);
    socket.on('message', handleMessage);
    socket.on('roomUsers', handleRoomUsers);
    socket.on('typingStatus', handleTypingStatus);

    return () => {
      socket.off('chatHistory', handleChatHistory);
      socket.off('message', handleMessage);
      socket.off('roomUsers', handleRoomUsers);
      socket.off('typingStatus', handleTypingStatus);
      
      Object.values(typingTimeoutRef.current).forEach(clearTimeout);
      typingTimeoutRef.current = {};
    };
  }, [roomId, socket, isConnected, user, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text) => {
    if (socket && text.trim()) {
      socket.emit('chatMessage', text.trim());
    }
  };

  const handleTyping = (isTyping) => {
    if (socket) {
      socket.emit('typing', isTyping);
    }
  };

  const currentRoomDisplayName = currentRoomNameRef.current;

  return (
    <div className="h-screen flex flex-col bg-[--color-brutal-pink]">
      {/* Header */}
      <header className="bg-[--color-brutal-white] brutal-border-b border-b-4 p-4 flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-[--color-brutal-yellow] brutal-border brutal-shadow-sm font-bold uppercase text-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-brutal-black)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-100"
        >
          ← Back
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase truncate">
            <span className="inline-block bg-[--color-brutal-green] px-3 py-1 transform -rotate-1">
              {currentRoomDisplayName}
            </span>
          </h1>
        </div>

        <button
          onClick={() => setShowUsersList(!showUsersList)}
          className="px-4 py-2 bg-[--color-brutal-blue] brutal-border brutal-shadow-sm font-bold uppercase text-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-brutal-black)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-100 lg:hidden"
        >
          👥 {onlineUsers.length}
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-[--color-brutal-yellow] p-4 sm:p-6">
          <div className="flex-1 bg-[--color-brutal-white] brutal-border brutal-shadow-lg overflow-hidden flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <MessageList messages={messages} currentUserEmail={user?.email} />
              <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator */}
            <div className="border-t-4 border-[--color-brutal-black] bg-[--color-brutal-gray] px-4 py-2">
              <TypingIndicator typingUsers={Object.keys(typingUsers)} />
            </div>

            {/* Message Input */}
            <div className="border-t-4 border-[--color-brutal-black] p-4">
              <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
            </div>
          </div>
        </div>

        {/* Online Users Sidebar - Desktop */}
        <div className="hidden lg:block w-80 bg-[--color-brutal-blue] p-6">
          <div className="bg-[--color-brutal-white] brutal-border brutal-shadow-lg h-full">
            <OnlineUsersList users={onlineUsers} />
          </div>
        </div>

        {/* Online Users Sidebar - Mobile (Overlay) */}
        {showUsersList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={() => setShowUsersList(false)}>
            <div 
              className="absolute right-0 top-0 h-full w-80 max-w-full bg-[--color-brutal-white] brutal-border-l border-l-4 brutal-shadow-xl p-6 animate-[slideInUp_0.3s_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black uppercase">Online Users</h3>
                <button
                  onClick={() => setShowUsersList(false)}
                  className="px-3 py-2 bg-[--color-brutal-pink] brutal-border font-bold text-sm"
                >
                  ✕
                </button>
              </div>
              <OnlineUsersList users={onlineUsers} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatRoomPage;