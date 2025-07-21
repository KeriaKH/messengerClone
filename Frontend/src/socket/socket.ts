import { io, Socket } from "socket.io-client";

let socket: Socket|null = null; // ✅ Biến socket được khởi tạo là null

export const initSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      withCredentials: true,
      forceNew:true
    });
  }
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error("⚠️ Socket chưa được khởi tạo. Gọi initSocket() trước.");
  }
  return socket;
};

export const destroySocket = () => {
  if (socket) {
    console.log("🗑️ Destroying socket completely...");
    socket.removeAllListeners(); // Remove tất cả listeners
    socket.disconnect();
    socket = null; // ✅ Reset global variable
  }
};