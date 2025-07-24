  import { io, Socket } from "socket.io-client";

  let socket: Socket|null = null; 

  export const initSocket = () => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_API_URL, {
        withCredentials: true,
        transports: ["polling"],
        forceNew:false
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
      socket.removeAllListeners(); 
      socket.disconnect();
      socket = null; 
    }
  };