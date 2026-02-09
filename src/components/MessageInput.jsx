import { useState, useRef, useEffect } from 'react';

function MessageInput({ onSendMessage, onTyping }) {
  const [message, setMessage] = useState('');
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (!isTypingRef.current) {
      onTyping(true);
      isTypingRef.current = true;
    }

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = setTimeout(() => {
      onTyping(false);
      isTypingRef.current = false;
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      if (isTypingRef.current) {
        onTyping(false);
        isTypingRef.current = false;
        if (typingTimerRef.current) {
          clearTimeout(typingTimerRef.current);
        }
      }
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      if (isTypingRef.current) {
        onTyping(false);
      }
    };
  }, [onTyping]);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        placeholder="Type something cool..."
        className="flex-1 px-4 py-3 brutal-border bg-[--color-brutal-gray] font-medium text-sm sm:text-base focus:outline-none focus:bg-white focus:brutal-shadow-md transition-all duration-200"
      />
      <button
        type="submit"
        className="px-6 sm:px-8 py-3 bg-[--color-brutal-green] brutal-border brutal-shadow-md font-black uppercase text-sm sm:text-base hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_var(--color-brutal-black)] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none transition-all duration-100 whitespace-nowrap"
      >
        Send 🚀
      </button>
    </form>
  );
}

export default MessageInput;