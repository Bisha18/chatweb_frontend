const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export const getAllRooms = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rooms/all`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch rooms');
    }
    return data;
  } catch (error) {
    console.error('Get all rooms API error:', error);
    throw error;
  }
};

export const createRoom = async (name, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rooms/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create room');
    }
    return data;
  } catch (error) {
    console.error('Create room API error:', error);
    throw error;
  }
};