import { io, Socket } from "socket.io-client";

let socket: Socket;

export const initSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      withCredentials: true,
    });
  }
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error("⚠️ Socket chưa được khởi tạo. Gọi initSocket() trước.");
  }
  return socket;
};
