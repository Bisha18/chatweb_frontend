import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, backendUrl }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_INTERVAL = 2000; // 2 seconds

  useEffect(() => {
    if (!backendUrl) {
      console.error("Backend URL is not provided for Socket.io connection.");
      return;
    }

    let currentSocket = io(backendUrl, {
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: RECONNECT_INTERVAL,
      transports: ['websocket', 'polling'], // Ensure compatibility
    });

    currentSocket.on('connect', () => {
      console.log('Socket.io connected:', currentSocket.id);
      setIsConnected(true);
      reconnectAttempts.current = 0; // Reset attempts on successful connection
    });

    currentSocket.on('disconnect', (reason) => {
      console.log('Socket.io disconnected:', reason);
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        // The server intentionally disconnected, do not reconnect
      } else {
        // Otherwise, the client will automatically try to reconnect
      }
    });

    currentSocket.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error.message);
      if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts.current++;
        console.log(`Attempting to reconnect (${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})...`);
      } else {
        console.error("Max reconnect attempts reached. Please check server status.");
      }
    });

    currentSocket.on('error', (errorMessage) => {
      console.error("Socket error from server:", errorMessage);
      alert(`Server Error: ${errorMessage}`);
    });

    setSocket(currentSocket);

    // Cleanup on unmount
    return () => {
      if (currentSocket) {
        currentSocket.disconnect();
        console.log('Socket.io client disconnected on component unmount.');
      }
    };
  }, [backendUrl]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};