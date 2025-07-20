import React, { useState, useRef, useEffect } from 'react';

function MessageInput({ onSendMessage, onTyping }) {
  const [message, setMessage] = useState('');
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false); // To track if we've already sent 'typing: true'

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    // Typing indicator logic
    if (!isTypingRef.current) {
      onTyping(true);
      isTypingRef.current = true;
    }

    // Clear previous timer
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    // Set new timer to send 'typing: false' after a delay
    typingTimerRef.current = setTimeout(() => {
      onTyping(false);
      isTypingRef.current = false;
    }, 1500); // 1.5 seconds after last key press
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      // Immediately send typing: false when message is sent
      if (isTypingRef.current) {
        onTyping(false);
        isTypingRef.current = false;
        if (typingTimerRef.current) {
          clearTimeout(typingTimerRef.current);
        }
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      // Ensure typing status is turned off if component unmounts while typing
      if (isTypingRef.current) {
        onTyping(false);
      }
    };
  }, [onTyping]);

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        placeholder="Type a message..."
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default MessageInput;