import React from 'react';

function OnlineUsersList({ users }) {
  return (
    <div className="online-users-list">
      <h3>Online Users ({users.length})</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default OnlineUsersList;