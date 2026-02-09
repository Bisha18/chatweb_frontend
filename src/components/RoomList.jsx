function RoomList({ rooms, onJoinRoom }) {
  if (!rooms || rooms.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {rooms.map((room, index) => (
        <div
          key={room._id}
          className="bg-[--color-brutal-gray] brutal-border brutal-shadow-md p-4 hover:bg-[--color-brutal-yellow] transition-all duration-200 animate-[slideInUp_0.3s_ease-out]"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-black uppercase truncate">
                {room.name}
              </h3>
              <p className="text-xs sm:text-sm font-medium uppercase opacity-70 mt-1">
                💬 Room ID: {room._id.slice(-6)}
              </p>
            </div>
            <button
              onClick={() => onJoinRoom(room._id)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-[--color-brutal-blue] brutal-border brutal-shadow-sm font-bold uppercase text-sm sm:text-base hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_var(--color-brutal-black)] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none transition-all duration-100 whitespace-nowrap"
            >
              Join →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RoomList;