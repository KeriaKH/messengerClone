"use client";

import { getUserData, isLogin, login, logOut } from "@/services/authService";
import { AuthContextType } from "@/types/customeType/AuthContextType";
import { LoginData } from "@/types/customeType/loginData";
import { userData } from "@/types/customeType/userData";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSocket } from "./SocketContext";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<userData | null>(null);
  const [loading, setLoading] = useState(true); // Thêm loading state
  const [mounted, setMounted] = useState(false); // Thêm mounted state
  const { socket, initializeSocket, disconnectSocket } = useSocket();

  const emitUserConnected = useCallback(
    (userId: string) => {
      if (!socket || !userId) return;

      if (socket.connected) {
        console.log("✅ Socket connected, emitting user_connected:", userId);
        socket.emit("user_connected", userId);
      } else {
        console.log("🔄 Socket not connected, waiting for connection...");
        socket.once("connect", () => {
          console.log("✅ Socket connected, emitting user_connected:", userId);
          socket.emit("user_connected", userId);
        });
      }
    },
    [socket]
  );

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      try {
        if (isLogin()) {
          const userData = getUserData();
          setUser(userData);
          if (userData?.id) {
            initializeSocket();
            setTimeout(() => {
              emitUserConnected(userData.id);
            }, 500); // Delay to ensure socket is initialized
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(checkAuth, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [emitUserConnected, initializeSocket]);

  const Login = async (loginData: LoginData) => {
    const res = await login(loginData.email, loginData.password);
    if ("token" in res) {
      setUser(res as userData);
      initializeSocket();
      setTimeout(() => {
        emitUserConnected(res.id);
      }, 500);
    }
    return res || { message: "Login failed" };
  };

  const LogOut = () => {
    if (socket && user?.id) {
      console.log("🔴 Emitting user disconnect:", user.id);
      socket.emit("user_disconnected", user.id);
    }

    // ✅ Disconnect socket khi logout
    disconnectSocket();
    logOut();
    setUser(null);
  };

  if (!mounted || loading)
    return null

  return (
    <AuthContext.Provider value={{ user, Login, LogOut, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
