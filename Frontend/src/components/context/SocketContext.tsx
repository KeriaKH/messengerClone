"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { initSocket, getSocket } from "@/socket/socket"
import { Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    initSocket();
    const socketInstance = getSocket();
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  if (!socket) return null; 

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("⚠️ Socket chưa được khởi tạo. Gọi SocketProvider trước.");
  return context;
};
