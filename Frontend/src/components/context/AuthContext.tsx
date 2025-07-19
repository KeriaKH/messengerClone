  "use client";

  import { getUserData, isLogin, login, logOut } from "@/services/authService";
import { getSocket } from "@/socket/socket";
  import { AuthContextType } from "@/types/customeType/AuthContextType";
  import { LoginData } from "@/types/customeType/loginData";
  import { userData } from "@/types/customeType/userData";
  import { createContext, useContext, useEffect, useState } from "react";

  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<userData | null>(null);
    const [loading, setLoading] = useState(true); // Thêm loading state
    const [mounted, setMounted] = useState(false); // Thêm mounted state
    const socket = getSocket();

    useEffect(() => {
      setMounted(true);
      const checkAuth = async () => {
        try {
          if (isLogin()) {
            const userData = getUserData();
            setUser(userData);
            socket.emit("user_connected", userData?.id);
          }
        } catch (error) {
          console.error("Error checking auth:", error);
        } finally {
          setLoading(false);
        }
      };

      const timer = setTimeout(checkAuth, 100);

      return () => {
        clearTimeout(timer)
      };
    },[socket]);

    const Login = async (loginData: LoginData) => {
      const res = await login(loginData.email, loginData.password);
      if ("token" in res) {
        setUser(res as userData);
        socket.emit("user_connected", res.id);
      }
      return res;
    };

    const LogOut = () => {
      logOut();
      socket.disconnect();
      setUser(null);
    };

    if(!mounted || loading) return null

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
