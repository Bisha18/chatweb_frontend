function OnlineUsersList({ users }) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 sm:p-6 border-b-4 border-[--color-brutal-black] bg-[--color-brutal-yellow]">
        <h3 className="text-xl sm:text-2xl font-black uppercase flex items-center gap-2">
          <span className="text-2xl">👥</span>
          Online ({users.length})
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {users.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">😴</div>
            <p className="text-sm font-bold uppercase opacity-70">Nobody here yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user, index) => (
              <div
                key={index}
                className="bg-[--color-brutal-gray] brutal-border p-3 hover:bg-[--color-brutal-yellow] hover:brutal-shadow-sm transition-all duration-200 animate-[slideInUp_0.3s_ease-out]"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[--color-brutal-pink] brutal-border border-2 flex items-center justify-center font-black text-lg">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm sm:text-base truncate">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 rounded-full bg-[--color-brutal-green] animate-[pulse-border_2s_ease-in-out_infinite]"></div>
                      <span className="text-xs font-medium uppercase opacity-70">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OnlineUsersList;