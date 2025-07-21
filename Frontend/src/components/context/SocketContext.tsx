"use client";

import { destroySocket, getSocket, initSocket } from "@/socket/socket";
import React, { createContext, useContext, useState } from "react";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
  initializeSocket: () => void;
  disconnectSocket: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const initializeSocket = () => {
    if (!socket) {
      console.log("🔄 Initializing socket...");
      initSocket();
      const socketInstance = getSocket();
      setSocket(socketInstance);

      socketInstance.on("connect", () => {
        console.log("✅ Socket connected:", socketInstance.id);
      });

      socketInstance.on("online_users", (users: string[]) => {
        console.log("📋 Received online users:", users);
        setOnlineUsers(users);
      });

      socketInstance.on("user_offline", (userId: string) => {
        console.log("🔴 User offline:", userId);
        setOnlineUsers((prev) => prev.filter((id) => id !== userId));
      });

      socketInstance.on("disconnect", () => {
        console.log("🔴 Socket disconnected");
      });
    }
  };

  const disconnectSocket = () => {
    if (socket) {
    console.log("🔴 Disconnecting socket...");
    
    // ✅ Remove listeners từ React state
    socket.off("online_users");
    socket.off("user_offline");
    socket.off("connect");
    socket.off("disconnect");
    
    // ✅ Destroy socket hoàn toàn
    destroySocket();
    
    setSocket(null);
    setOnlineUsers([]);
    }
  };
  

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, initializeSocket, disconnectSocket }}>
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
