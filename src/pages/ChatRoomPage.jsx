import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext.jsx';
import { UserContext } from '../App.jsx';
import MessageList from '../components/MessageList.jsx';
import MessageInput from '../components/MessageInput.jsx';
import OnlineUsersList from '../components/OnlineUsersList.jsx';
import TypingIndicator from '../components/TypingIndicator.jsx';

function ChatRoomPage() {
  const { roomId } = useParams(); // Get room ID from URL
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const { user } = useContext(UserContext); // Get current user from context

  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({}); // { email: true/false }
  const typingTimeoutRef = useRef({}); // To manage typing timeouts for different users

  const currentRoomNameRef = useRef('Loading...'); // To store the room name
  
  // Ref for auto-scrolling
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user || !isConnected || !socket) {
      console.log('User not logged in or socket not connected, redirecting to auth.');
      // Give a small delay to ensure socket tries to connect, then redirect
      const timeout = setTimeout(() => {
        if (!user) navigate('/auth');
      }, 1000);
      return () => clearTimeout(timeout);
    }

    // Join room when component mounts or roomId/user changes
    // Pass userId from context (or generate for guest)
    socket.emit('joinRoom', { email: user.email, roomId: roomId, userId: user.id });
    console.log(`Attempting to join room ${roomId} as ${user.email}`);

    // Socket event listeners
    const handleChatHistory = (history) => {
      console.log('Received chat history:', history);
      setMessages(history);
      scrollToBottom();
    };

    const handleMessage = (msg) => {
      console.log('Received new message:', msg);
      // If it's a system message indicating someone joined/left, and we're not that user
      if (msg.senderUsername === 'system' && msg.text.includes('Welcome to') && msg.text.includes(user.email)) {
        // This is the welcome message for the current user, don't add duplicate
        // or system welcome message will already be added once.
        if (currentRoomNameRef.current === 'Loading...') {
          const roomNameMatch = msg.text.match(/Welcome to (.*?)!,/);
          if (roomNameMatch && roomNameMatch[1]) {
            currentRoomNameRef.current = roomNameMatch[1];
            // A better way would be to get room name from `joinRoom` callback or API
            setMessages(prev => [...prev, msg]); // Add system welcome
          }
        } else {
             // If we already have a room name, and this is a general system join message
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
            if (typingEmail !== user.email) { // Don't show typing for self
                if (isTyping) {
                    newState[typingEmail] = true;
                    // Clear existing timeout if any
                    if (typingTimeoutRef.current[typingEmail]) {
                        clearTimeout(typingTimeoutRef.current[typingEmail]);
                    }
                    // Set a timeout to clear typing status after a delay
                    typingTimeoutRef.current[typingEmail] = setTimeout(() => {
                        setTypingUsers(prevTimeout => {
                            const newTimeoutState = { ...prevTimeout };
                            delete newTimeoutState[typingEmail];
                            return newTimeoutState;
                        });
                    }, 2000); // 2 seconds
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
      // Clean up event listeners on component unmount
      socket.off('chatHistory', handleChatHistory);
      socket.off('message', handleMessage);
      socket.off('roomUsers', handleRoomUsers);
      socket.off('typingStatus', handleTypingStatus);
      
      // Clear all typing timeouts to prevent memory leaks
      Object.values(typingTimeoutRef.current).forEach(clearTimeout);
      typingTimeoutRef.current = {};
    };
  }, [roomId, socket, isConnected, user, navigate]);

  // Scroll to bottom whenever messages update
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

  const currentRoomDisplayName = currentRoomNameRef.current; // Use ref for display

  return (
    <div className="chat-room-page">
      <div className="chat-main">
        <h2>Room: {currentRoomDisplayName}</h2>
        <MessageList messages={messages} currentUserEmail={user?.email} />
        <div ref={messagesEndRef} /> {/* Scroll target */}
        <TypingIndicator typingUsers={Object.keys(typingUsers)} />
        <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
      </div>
      <div className="online-users-sidebar">
        <OnlineUsersList users={onlineUsers} />
      </div>
    </div>
  );
}

export default ChatRoomPage;