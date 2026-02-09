import moment from 'moment';

function MessageList({ messages, currentUserEmail }) {
  return (
    <div className="space-y-4">
      {messages.map((msg, index) => {
        const isSystem = msg.senderUsername === 'system';
        const isCurrentUser = msg.senderUsername === currentUserEmail;
        
        if (isSystem) {
          return (
            <div key={index} className="flex justify-center animate-[slideInUp_0.3s_ease-out]">
              <div className="bg-[--color-brutal-gray] brutal-border px-4 py-2 max-w-md">
                <p className="text-xs sm:text-sm font-bold text-center uppercase opacity-70">
                  {msg.text}
                </p>
              </div>
            </div>
          );
        }

        return (
          <div
            key={index}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-[slideInUp_0.3s_ease-out]`}
          >
            <div className={`max-w-xs sm:max-w-md lg:max-w-lg ${isCurrentUser ? 'ml-auto' : 'mr-auto'}`}>
              {/* Sender Name */}
              {!isCurrentUser && (
                <div className="mb-1 px-2">
                  <span className="text-xs font-bold uppercase opacity-70">
                    {msg.senderUsername}
                  </span>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`brutal-border brutal-shadow-md p-3 sm:p-4 ${
                  isCurrentUser
                    ? 'bg-[--color-brutal-blue]'
                    : 'bg-[--color-brutal-white]'
                }`}
              >
                <p className="font-medium text-sm sm:text-base break-words">
                  {msg.text}
                </p>
                <div className="mt-2 flex items-center justify-end gap-2">
                  <span className="text-xs font-bold uppercase opacity-60">
                    {moment(msg.timestamp).format('h:mm A')}
                  </span>
                  {isCurrentUser && (
                    <span className="text-xs">✓</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MessageList;