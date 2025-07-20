import React, { useState, useEffect, useContext } from 'react';
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
          // Check if room already exists to prevent duplicates
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
      // The backend createRoom route does not require a token
      const createdRoom = await createRoom(newRoomName.trim(), token);
      console.log('Room created:', createdRoom);
      setNewRoomName('');
      // The socket event 'newRoomCreated' will update the list
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
      // For guest, simply clear local state
      updateUserAndToken(null, null);
      navigate('/auth');
      return;
    }
    try {
      await apiLogout(token);
      updateUserAndToken(null, null); // Clear user data in context and local storage
      navigate('/auth'); // Redirect to auth page after logout
    } catch (err) {
      setError(err.message || 'Logout failed.');
    }
  };

  return (
    <div className="home-page">
      <div className="header">
        <h1>Welcome, {user?.email || 'Guest'}!</h1>
        <button onClick={handleLogout}>
          {user?.isGuest ? 'Exit Guest Mode' : 'Logout'}
        </button>
      </div>

      <h2>Available Chat Rooms</h2>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <p>Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <p>No rooms available. Be the first to create one!</p>
      ) : (
        <RoomList rooms={rooms} onJoinRoom={handleJoinRoom} />
      )}

      <div className="create-room">
        <h3>Create New Room</h3>
        <form onSubmit={handleCreateRoom}>
          <input
            type="text"
            placeholder="Enter room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <button type="submit">Create Room</button>
        </form>
      </div>
    </div>
  );
}

export default HomePage;