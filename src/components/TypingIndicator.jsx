import React from 'react';

function TypingIndicator({ typingUsers }) {
  if (typingUsers.length === 0) {
    return <div className="typing-indicator"></div>;
  }

  const message = typingUsers.length === 1
    ? `${typingUsers[0]} is typing...`
    : `${typingUsers.join(', ')} are typing...`;

  return (
    <div className="typing-indicator">
      {message}
    </div>
  );
}

export default TypingIndicator;