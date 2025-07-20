import React from 'react';

function RoomList({ rooms, onJoinRoom }) {
  if (!rooms || rooms.length === 0) {
    return null; // Or a message "No rooms available." handled in HomePage
  }

  return (
    <div className="room-list-container">
      <h3>Join an Existing Room</h3>
      <ul className="room-list">
        {rooms.map((room) => (
          <li key={room._id}>
            <span>{room.name}</span>
            <button onClick={() => onJoinRoom(room._id)}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoomList;