function TypingIndicator({ typingUsers }) {
  if (typingUsers.length === 0) {
    return <div className="h-6"></div>;
  }

  const message = typingUsers.length === 1
    ? `${typingUsers[0]} is typing...`
    : `${typingUsers.join(', ')} are typing...`;

  return (
    <div className="flex items-center gap-2 animate-[slideInUp_0.3s_ease-out]">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-[--color-brutal-pink] rounded-full animate-[bounce-subtle_1s_ease-in-out_infinite]"></div>
        <div className="w-2 h-2 bg-[--color-brutal-blue] rounded-full animate-[bounce-subtle_1s_ease-in-out_infinite_0.2s]"></div>
        <div className="w-2 h-2 bg-[--color-brutal-green] rounded-full animate-[bounce-subtle_1s_ease-in-out_infinite_0.4s]"></div>
      </div>
      <span className="text-xs sm:text-sm font-bold uppercase opacity-70">
        {message}
      </span>
    </div>
  );
}

export default TypingIndicator;