import React from 'react';
import moment from 'moment'; // For formatting timestamps

function MessageList({ messages, currentUserEmail }) {
  return (
    <div className="message-list">
      <ul>
        {messages.map((msg, index) => (
          <li
            key={index}
            className={
              msg.senderUsername === 'system'
                ? 'system-message'
                : msg.senderUsername === currentUserEmail
                ? 'my-message'
                : 'other-message'
            }
          >
            {msg.senderUsername !== 'system' && (
              <span className="sender-info">
                {msg.senderUsername === currentUserEmail ? 'You' : msg.senderUsername}:
              </span>
            )}
            <p className="message-text">{msg.text}</p>
            <span className="message-timestamp">
              {moment(msg.timestamp).format('h:mm A')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MessageList;