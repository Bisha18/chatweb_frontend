import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRooms, createRoom } from '../api/rooms';
import { useSocket } from '../contexts/SocketContext.jsx';
import RoomList from '../components/RoomList.jsx';
import { UserContext } from '../App.jsx';
import { logout as apiLogout } from '../api/auth';

function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();
  const { user, token, updateUserAndToken } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const fetchedRooms = await getAllRooms();
      setRooms(fetchedRooms);
    } catch (err) {
      setError(err.message || 'Failed to fetch rooms.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();

    if (socket) {
      const handleNewRoomCreated = (room) => {
        console.log("New room created via socket:", room);
        setRooms((prevRooms) => {
          if (!prevRooms.some(r => r._id === room._id || r.name === room.name)) {
            return [...prevRooms, room];
          }
          return prevRooms;
        });
      };

      socket.on('newRoomCreated', handleNewRoomCreated);

      return () => {
        socket.off('newRoomCreated', handleNewRoomCreated);
      };
    }
  }, [socket, isConnected]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setError('');
    if (!newRoomName.trim()) {
      setError('Room name cannot be empty.');
      return;
    }
    try {
      const createdRoom = await createRoom(newRoomName.trim(), token);
      console.log('Room created:', createdRoom);
      setNewRoomName('');
    } catch (err) {
      setError(err.message || 'Failed to create room.');
    }
  };

  const handleJoinRoom = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const handleLogout = async () => {
    setError('');
    if (user && user.isGuest) {
      updateUserAndToken(null, null);
      navigate('/auth');
      return;
    }
    try {
      await apiLogout(token);
      updateUserAndToken(null, null);
      navigate('/auth');
    } catch (err) {
      setError(err.message || 'Logout failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[--color-brutal-blue] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8 animate-[slideInUp_0.4s_ease-out]">
        <div className="bg-[--color-brutal-white] brutal-border brutal-shadow-xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase mb-2">
              <span className="inline-block bg-[--color-brutal-yellow] px-3 py-1 transform -rotate-1">
                Hey, {user?.email || 'Guest'}! 👋
              </span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-[--color-brutal-green]' : 'bg-[--color-brutal-pink]'} brutal-border border-2`}></div>
              <span className="text-sm font-bold uppercase">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-[--color-brutal-pink] brutal-border brutal-shadow-md font-bold uppercase text-sm sm:text-base hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_var(--color-brutal-black)] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none transition-all duration-100 w-full sm:w-auto"
          >
            {user?.isGuest ? '👻 Exit Guest' : '🚪 Logout'}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Room Section */}
        <div className="lg:col-span-1 animate-[slideInUp_0.5s_ease-out]">
          <div className="bg-[--color-brutal-yellow] brutal-border brutal-shadow-lg p-6 sticky top-6">
            <h2 className="text-2xl sm:text-3xl font-black uppercase mb-4 flex items-center gap-2">
              <span className="text-3xl">➕</span>
              Create Room
            </h2>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <input
                type="text"
                placeholder="Room name..."
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-full px-4 py-3 brutal-border bg-[--color-brutal-white] font-bold focus:outline-none focus:brutal-shadow-md transition-all duration-200"
              />
              <button
                type="submit"
                className="w-full py-4 px-6 bg-[--color-brutal-green] brutal-border brutal-shadow-md font-black text-lg uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_var(--color-brutal-black)] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none transition-all duration-100"
              >
                Create! 🚀
              </button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-[--color-brutal-pink] brutal-border animate-[shake_0.5s_ease]">
                <p className="font-bold text-xs uppercase">⚠️ {error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Rooms List Section */}
        <div className="lg:col-span-2 animate-[slideInUp_0.6s_ease-out]">
          <div className="bg-[--color-brutal-white] brutal-border brutal-shadow-lg p-6">
            <h2 className="text-2xl sm:text-3xl font-black uppercase mb-6 flex items-center gap-2">
              <span className="text-3xl">💬</span>
              Chat Rooms
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="text-4xl mb-4 animate-[bounce-subtle_1s_ease-in-out_infinite]">⏳</div>
                  <p className="font-bold uppercase">Loading rooms...</p>
                </div>
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-12 bg-[--color-brutal-gray] brutal-border">
                <div className="text-5xl mb-4">😴</div>
                <p className="font-bold text-lg uppercase mb-2">No rooms yet!</p>
                <p className="text-sm font-medium opacity-70">Be the first to create one →</p>
              </div>
            ) : (
              <RoomList rooms={rooms} onJoinRoom={handleJoinRoom} />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-8 text-center">
        <div className="inline-block bg-[--color-brutal-pink] brutal-border px-6 py-3 transform rotate-1">
          <p className="font-black uppercase text-sm">
            ⚡ Real-time chat • Built with passion ⚡
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;