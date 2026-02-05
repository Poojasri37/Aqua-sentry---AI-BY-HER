import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { SOCKET_URL } from '../utils/api';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const [lastReading, setLastReading] = useState(null);
    const [lastAlert, setLastAlert] = useState(null);
    const socketRef = useRef(null);
    const connectionUserIdRef = useRef(null);

    // Mock mode disabled to use real backend sockets
    const MOCK_MODE = false;

    useEffect(() => {
        const isAuth = isAuthenticated();

        // If not authenticated, disconnect and clear
        if (!isAuth || !user) {
            if (socketRef.current) {
                console.log('Socket: User logged out, disconnecting');
                socketRef.current.disconnect();
                socketRef.current = null;
                connectionUserIdRef.current = null;
                setIsConnected(false);
            }
            return;
        }

        // If authenticated and already connected for the same user, do nothing
        if (socketRef.current && connectionUserIdRef.current === user._id) {
            return;
        }

        // Handle case where user changed but socket exists
        if (socketRef.current && connectionUserIdRef.current !== user._id) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }

        if (MOCK_MODE) {
            console.log('Socket: Initializing Mock Mode');
            setIsConnected(true);
            const interval = setInterval(() => {
                const mockUpdate = {
                    id: 'TN-100',
                    timestamp: new Date().toISOString(),
                    metrics: {
                        ph: (7 + Math.random() * 0.5).toFixed(2),
                        turbidity: (1 + Math.random()).toFixed(2),
                        temperature: (25 + Math.random() * 2).toFixed(1),
                        waterLevel: Math.floor(80 + Math.random() * 5)
                    }
                };
                setLastReading(mockUpdate);
            }, 5000);
            return () => clearInterval(interval);
        } else {
            const BACKEND_URL = SOCKET_URL || (window.location.hostname === 'localhost'
                ? 'http://localhost:5000'
                : `http://${window.location.hostname}:5000`);

            console.log(`Socket: Connecting to Backend at ${BACKEND_URL}...`);
            const socket = io(BACKEND_URL, {
                transports: ['websocket', 'polling'],
                auth: { token: localStorage.getItem('aquasentry_token') },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });

            socket.on('connect', () => {
                console.log('Socket Connected to Backend');
                setIsConnected(true);
                connectionUserIdRef.current = user._id;
            });

            socket.on('disconnect', (reason) => {
                console.log('Socket Disconnected:', reason);
                setIsConnected(false);
                // If it was a manual disconnect from our side, ref is already nulled
                // If it was a server drop, we keep the ref for auto-reconnect
            });

            socket.on('sensor_update', (data) => {
                setLastReading(data);
            });

            socket.on('global_sensor_update', (data) => {
                setLastReading(data);
            });

            socket.on('new_alert', (data) => {
                console.log('Socket: New Alert Received', data);
                setLastAlert(data);
            });

            socketRef.current = socket;

            // Only clean up on unmount or if dependencies change significantly
            return () => {
                // We keep the socket alive during normal navigation
                // Cleanup is handled by the start of the effect in the next run if needed
            };
        }
    }, [user, isAuthenticated]); // isAuthenticated is memoized in AuthContext

    const subscribeToTank = (tankId) => {
        if (socketRef.current && !MOCK_MODE) {
            socketRef.current.emit('subscribe_tank', tankId);
        }
    };

    const unsubscribeFromTank = (tankId) => {
        if (socketRef.current && !MOCK_MODE) {
            socketRef.current.emit('unsubscribe_tank', tankId);
        }
    };

    const value = {
        isConnected,
        lastReading,
        lastAlert,
        subscribeToTank,
        unsubscribeFromTank
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
