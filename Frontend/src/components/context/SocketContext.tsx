"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { initSocket, getSocket } from "@/socket/socket";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    initSocket();
    const socketInstance = getSocket();
    setSocket(socketInstance);

    socketInstance.on("online_users", (users: string[]) => {
      setOnlineUsers(users);
    });

    socketInstance.on("user_offline", (userId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socketInstance.disconnect();
      socketInstance.off("online_users");
      socketInstance.off("user_offline");
    };
  }, []);

  if (!socket) return null;

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("⚠️ Socket chưa được khởi tạo. Gọi SocketProvider trước.");
  return context;
};
